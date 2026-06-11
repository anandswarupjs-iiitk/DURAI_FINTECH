const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ userId, action, metadata = {}, req }) => {
  try {
    const ip = req?.headers?.['x-forwarded-for']?.split(',')[0] || req?.ip || 'unknown';
    const ua = req?.headers?.['user-agent'] || '';
    const fingerprint = req?.fingerprint || '';

    await ActivityLog.create({
      user: userId,
      action,
      metadata,
      ipAddress: ip,
      deviceFingerprint: fingerprint,
      userAgent: ua,
    });
  } catch (err) {
    // Never block the main flow for logging errors
    console.error('Activity logging error:', err.message);
  }
};

module.exports = { logActivity };