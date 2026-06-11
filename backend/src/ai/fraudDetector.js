const { calculateRiskScore } = require('./riskScorer');
const { triggerAlert } = require('./alertEngine');

const analyzeTransaction = async ({ userId, amount, recipient, type }) => {
  const score = await calculateRiskScore({ userId, amount, recipient, type });

  const flagged = score >= 70;
  const reasons = [];

  if (amount > 10000) reasons.push('High value transaction');
  if (score >= 70)    reasons.push('High risk score');

  const hour = new Date().getHours();
  if (hour >= 0 && hour <= 5) reasons.push('Unusual transaction time');

  if (flagged) await triggerAlert({ userId, amount, score, reasons });

  return { score, flagged, reasons };
};

module.exports = { analyzeTransaction };