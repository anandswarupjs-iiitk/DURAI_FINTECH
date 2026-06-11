const User = require('../models/User');
const { logActivity } = require('../services/activityService');
const { sendPasswordChangedEmail } = require('../services/emailService');
const { emitPasswordChanged } = require('../sockets/socketHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshTokens -twoFactorSecret');
  return sendSuccess(res, 200, 'Profile retrieved.', { user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return sendError(res, 400, 'Name is required.');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    await logActivity({ userId: req.user._id, action: 'PROFILE_UPDATED', req });
    return sendSuccess(res, 200, 'Profile updated.', { user });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Both current and new password are required.');
    }
    if (newPassword.length < 8) {
      return sendError(res, 400, 'New password must be at least 8 characters.');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return sendError(res, 401, 'Current password is incorrect.');

    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all existing sessions
    await user.save();

    await sendPasswordChangedEmail(user.email, user.name);
    await logActivity({ userId: user._id, action: 'PASSWORD_CHANGED', req });
    emitPasswordChanged(user._id.toString());

    return sendSuccess(res, 200, 'Password changed successfully. Please login again.');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.disable2FA = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });
    await logActivity({ userId: req.user._id, action: '2FA_DISABLED', req });
    return sendSuccess(res, 200, '2FA disabled.');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};