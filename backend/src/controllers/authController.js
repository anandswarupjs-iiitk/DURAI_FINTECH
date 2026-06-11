const crypto = require('crypto');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { issueTokenPair, rotateRefreshToken, revokeRefreshToken, generatePasswordResetToken } = require('../services/tokenService');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require('../services/emailService');
const { logActivity } = require('../services/activityService');
const { generateFingerprint, getClientIP } = require('../utils/deviceFingerprint');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { emitUserLoggedIn, emitPasswordChanged } = require('../sockets/socketHandler');

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required.');
    }
    if (password.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters.');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 409, 'Email already registered.');

    const role = adminSecret && adminSecret === process.env.ADMIN_SECRET ? 'admin' : 'user';

    const ip = getClientIP(req);
    const fingerprint = generateFingerprint(req);

    const user = await User.create({
      name,
      email,
      password,
      role,
      ipAddress: ip,
      deviceFingerprint: fingerprint,
    });

    const { accessToken, refreshToken } = await issueTokenPair(user._id, user.role);

    await logActivity({ userId: user._id, action: 'REGISTER', req, metadata: { role } });

    return sendSuccess(res, 201, 'Account created successfully.', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, otpToken } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +twoFactorSecret +refreshTokens'
    );

    if (!user) {
      await logActivity({ action: 'LOGIN_FAILED', req, metadata: { email, reason: 'user_not_found' } });
      return sendError(res, 401, 'Invalid credentials.');
    }

    // Account lock check
    if (user.isLocked()) {
      return sendError(res, 423, 'Account temporarily locked due to multiple failed attempts. Try again later.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      await logActivity({ userId: user._id, action: 'LOGIN_FAILED', req, metadata: { reason: 'wrong_password' } });
      return sendError(res, 401, `Invalid credentials. ${5 - user.loginAttempts} attempts remaining.`);
    }

    // 2FA check
    if (user.twoFactorEnabled) {
      if (!otpToken) {
        return sendSuccess(res, 200, '2FA_REQUIRED', { twoFactorRequired: true });
      }
      const valid = authenticator.verify({ token: otpToken, secret: user.twoFactorSecret });
      if (!valid) {
        await logActivity({ userId: user._id, action: '2FA_FAILED', req });
        return sendError(res, 401, 'Invalid 2FA code.');
      }
    }

    await user.resetLoginAttempts();

    const ip = getClientIP(req);
    const fingerprint = generateFingerprint(req);

    // Detect IP/device change for anomaly tracking
    const ipChanged = user.ipAddress && user.ipAddress !== ip;
    const deviceChanged = user.deviceFingerprint && user.deviceFingerprint !== fingerprint;

    user.lastLogin = new Date();
    user.ipAddress = ip;
    user.deviceFingerprint = fingerprint;
    await user.save();

    const { accessToken, refreshToken } = await issueTokenPair(user._id, user.role);

    await logActivity({
      userId: user._id,
      action: 'LOGIN',
      req,
      metadata: { ipChanged, deviceChanged },
    });

    emitUserLoggedIn(user._id.toString(), { ipChanged, deviceChanged });

    return sendSuccess(res, 200, 'Login successful.', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, twoFactorEnabled: user.twoFactorEnabled },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await revokeRefreshToken(req.user._id, refreshToken);
    }
    await logActivity({ userId: req.user._id, action: 'LOGOUT', req });
    return sendSuccess(res, 200, 'Logged out successfully.');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 400, 'Refresh token is required.');

    const tokens = await rotateRefreshToken(refreshToken);
    return sendSuccess(res, 200, 'Token refreshed.', tokens);
  } catch (err) {
    return sendError(res, 401, err.message);
  }
};

// ─── GET ME ───────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshTokens');
  return sendSuccess(res, 200, 'User profile retrieved.', { user });
};

// ================= GET PROFILE =================

exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 400, 'Email is required.');

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return sendSuccess(res, 200, 'If that email exists, a reset link has been sent.');
    }

    // Invalidate old tokens for this user
    await PasswordReset.deleteMany({ user: user._id });

    const { raw, hashed } = generatePasswordResetToken();

    await PasswordReset.create({
      user: user._id,
      token: hashed,
      expireAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${raw}&email=${encodeURIComponent(user.email)}`;
    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    await logActivity({ userId: user._id, action: 'PASSWORD_RESET_REQUEST', req });

    return sendSuccess(res, 200, 'If that email exists, a reset link has been sent.');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return sendError(res, 400, 'Token, email, and new password are required.');
    }
    if (newPassword.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters.');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 400, 'Invalid or expired reset token.');

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await PasswordReset.findOne({
      user: user._id,
      token: hashed,
      used: false,
      expireAt: { $gt: new Date() },
    });

    if (!resetRecord) return sendError(res, 400, 'Invalid or expired reset token.');

    // Mark as used and update password
    resetRecord.used = true;
    await resetRecord.save();

    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    await sendPasswordChangedEmail(user.email, user.name);
    await logActivity({ userId: user._id, action: 'PASSWORD_RESET_COMPLETE', req });
    emitPasswordChanged(user._id.toString());

    return sendSuccess(res, 200, 'Password reset successfully. Please login.');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─── 2FA SETUP ────────────────────────────────────────────────────────────────
exports.setup2FA = async (req, res) => {
  try {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(req.user.email, 'FraudGuard', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    // Temporarily store secret (not enabled until verified)
    await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret });

    return sendSuccess(res, 200, '2FA setup initiated.', { qrCodeUrl, secret });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ================= UPDATE PROFILE PHOTO =================

exports.uploadPhoto = async (req, res) => {

  try {

    const user =
      await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    user.profileImage =
      `http://localhost:5000/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({

      success: true,

      user,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ─── 2FA VERIFY ───────────────────────────────────────────────────────────────
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return sendError(res, 400, 'OTP token is required.');

    const user = await User.findById(req.user._id).select('+twoFactorSecret');
    if (!user.twoFactorSecret) return sendError(res, 400, 'Run 2FA setup first.');

    const valid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!valid) return sendError(res, 400, 'Invalid OTP code.');

    user.twoFactorEnabled = true;
    await user.save();

    await logActivity({ userId: user._id, action: '2FA_ENABLED', req });

    return sendSuccess(res, 200, '2FA enabled successfully.');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};