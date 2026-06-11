const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const User = require('../models/User');

const issueTokenPair = async (userId, role) => {
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);

  // Hash and store refresh token
  const hashed = await bcrypt.hash(refreshToken, 10);
  await User.findByIdAndUpdate(userId, {
    $push: { refreshTokens: hashed },
  });

  return { accessToken, refreshToken };
};

const rotateRefreshToken = async (oldToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch {
    throw new Error('Invalid or expired refresh token.');
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user) throw new Error('User not found.');

  // Verify old token against stored hashes
  let matchIndex = -1;
  for (let i = 0; i < user.refreshTokens.length; i++) {
    const match = await bcrypt.compare(oldToken, user.refreshTokens[i]);
    if (match) { matchIndex = i; break; }
  }

  if (matchIndex === -1) throw new Error('Refresh token reuse detected. Please login again.');

  // Remove old token (rotation)
  user.refreshTokens.splice(matchIndex, 1);

  const accessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);
  const hashed = await bcrypt.hash(newRefreshToken, 10);
  user.refreshTokens.push(hashed);

  await user.save();
  return { accessToken, refreshToken: newRefreshToken };
};

const revokeRefreshToken = async (userId, token) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;

  const filtered = [];
  for (const stored of user.refreshTokens) {
    const match = await bcrypt.compare(token, stored);
    if (!match) filtered.push(stored);
  }
  user.refreshTokens = filtered;
  await user.save();
};

const generatePasswordResetToken = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
};

module.exports = {
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  generatePasswordResetToken,
};