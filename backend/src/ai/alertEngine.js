const ActivityLog = require('../models/ActivityLog');

const triggerAlert = async ({ userId, amount, score, reasons }) => {
  console.warn(`FRAUD ALERT — User: ${userId} | Amount: ${amount} | Score: ${score} | Reasons: ${reasons.join(', ')}`);

  await ActivityLog.create({
    user: userId,
    event: 'FRAUD_ALERT_TRIGGERED',
    meta: { amount, score, reasons },
  });
};

module.exports = { triggerAlert };