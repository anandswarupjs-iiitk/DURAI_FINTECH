const crypto = require('crypto');

/**
 * Generate a device fingerprint from request headers.
 * Not cryptographically binding — used for anomaly detection only.
 */
const generateFingerprint = (req) => {
  const ua = req.headers['user-agent'] || '';
  const lang = req.headers['accept-language'] || '';
  const encoding = req.headers['accept-encoding'] || '';
  const raw = `${ua}|${lang}|${encoding}`;
  return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32);
};

const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

module.exports = { generateFingerprint, getClientIP };