const Transaction = require('../models/Transaction');

const calculateRiskScore = async ({ userId, amount, recipient, type }) => {
  let score = 0;

  if (amount > 10000) score += 40;
  else if (amount > 5000) score += 20;
  else if (amount > 1000) score += 10;

  const hour = new Date().getHours();
  if (hour >= 0 && hour <= 5) score += 20;

  const recentTxns = await Transaction.find({
    user: userId,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
  });
  if (recentTxns.length > 5) score += 20;

  const knownRecipient = await Transaction.findOne({ user: userId, recipient });
  if (!knownRecipient) score += 15;

  return Math.min(score, 100);
};

module.exports = { calculateRiskScore };