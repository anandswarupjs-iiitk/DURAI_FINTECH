const Transaction = require('../models/Transaction');

/**
 * FraudGuard AI Risk Scoring Engine
 *
 * Factors:
 * 1. Transaction amount anomaly   (0–25 pts)
 * 2. Transaction frequency        (0–15 pts)
 * 3. New recipient                (0–15 pts)
 * 4. Device change                (0–10 pts)
 * 5. IP change                    (0–10 pts)
 * 6. Login failures               (0–15 pts)
 * 7. OTP failures                 (0–10 pts)
 *
 * Total max: 100
 */
const analyzeTransaction = async (transaction, user, context = {}) => {
  const { loginFailures = 0, otpFailures = 0 } = context;
  let score = 0;
  const reasons = [];

  // ── 1. Amount anomaly ─────────────────────────────────────────────────────
  const recentTxns = await Transaction.find({
    user: user._id,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    status: { $ne: 'blocked' },
  }).select('amount');

  if (recentTxns.length > 0) {
    const amounts = recentTxns.map((t) => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((s, x) => s + (x - avg) ** 2, 0) / amounts.length);
    const zScore = stdDev > 0 ? Math.abs(transaction.amount - avg) / stdDev : 0;

    if (zScore > 4) { score += 25; reasons.push('Transaction amount is an extreme outlier (>4σ from mean)'); }
    else if (zScore > 3) { score += 18; reasons.push('Transaction amount is a significant outlier (>3σ)'); }
    else if (zScore > 2) { score += 10; reasons.push('Transaction amount is above average (>2σ)'); }
    else if (transaction.amount > avg * 2) { score += 5; reasons.push('Transaction amount is 2x higher than average'); }
  } else {
    // First transaction — high amount is more suspicious
    if (transaction.amount > 10000) { score += 20; reasons.push('Large first transaction (no history)'); }
    else if (transaction.amount > 5000) { score += 10; reasons.push('Moderately large first transaction'); }
  }

  // ── 2. Frequency (velocity) ───────────────────────────────────────────────
  const lastHourCount = await Transaction.countDocuments({
    user: user._id,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
  });

  if (lastHourCount > 15) { score += 15; reasons.push(`High transaction velocity: ${lastHourCount} transactions in 1 hour`); }
  else if (lastHourCount > 8) { score += 10; reasons.push(`Elevated frequency: ${lastHourCount} transactions in 1 hour`); }
  else if (lastHourCount > 4) { score += 5; reasons.push(`Moderate frequency: ${lastHourCount} transactions in 1 hour`); }

  // ── 3. New recipient ──────────────────────────────────────────────────────
  const knownRecipient = await Transaction.findOne({
    user: user._id,
    recipient: transaction.recipient,
    status: { $in: ['completed', 'pending'] },
  });

  if (!knownRecipient) {
    score += 15;
    reasons.push(`New recipient: "${transaction.recipient}" has never been transacted with before`);
  }

  // ── 4. Device change ──────────────────────────────────────────────────────
  if (
    user.deviceFingerprint &&
    transaction.deviceFingerprint &&
    user.deviceFingerprint !== transaction.deviceFingerprint
  ) {
    score += 10;
    reasons.push('Transaction from an unrecognized device');
  }

  // ── 5. IP change ──────────────────────────────────────────────────────────
  if (
    user.ipAddress &&
    transaction.ipAddress &&
    user.ipAddress !== transaction.ipAddress
  ) {
    score += 10;
    reasons.push(`Transaction from new IP: ${transaction.ipAddress}`);
  }

  // ── 6. Login failures ─────────────────────────────────────────────────────
  if (loginFailures >= 5) { score += 15; reasons.push(`${loginFailures} failed login attempts before this session`); }
  else if (loginFailures >= 3) { score += 10; reasons.push(`${loginFailures} recent login failures`); }
  else if (loginFailures >= 1) { score += 5; reasons.push(`${loginFailures} failed login attempt(s)`); }

  // ── 7. OTP failures ───────────────────────────────────────────────────────
  if (otpFailures >= 3) { score += 10; reasons.push(`${otpFailures} 2FA/OTP failures`); }
  else if (otpFailures >= 1) { score += 5; reasons.push(`${otpFailures} OTP failure(s)`); }

  // ── Clamp score ───────────────────────────────────────────────────────────
  score = Math.min(100, Math.round(score));

  const riskLevel = score <= 30 ? 'LOW' : score <= 70 ? 'MEDIUM' : 'HIGH';

  return { score, riskLevel, reasons };
};

module.exports = { analyzeTransaction };