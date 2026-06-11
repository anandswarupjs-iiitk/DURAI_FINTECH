const FraudAlert = require('../models/FraudAlert');
const Transaction = require('../models/Transaction');
const { analyzeTransaction } = require('../ai/fraudEngine');
const { sendSuccess, sendError } = require('../utils/apiResponse');

exports.analyzeTransactionManual = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const txn = await Transaction.findOne({ _id: transactionId, user: req.user._id });
    if (!txn) return sendError(res, 404, 'Transaction not found.');

    const { score, riskLevel, reasons } = await analyzeTransaction(txn, req.user);
    return sendSuccess(res, 200, 'Analysis complete.', { score, riskLevel, reasons });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const { resolved, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };
    if (resolved !== undefined) query.resolved = resolved === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FraudAlert.countDocuments(query);
    const alerts = await FraudAlert.find(query)
      .populate('transaction', 'amount recipient createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return sendSuccess(res, 200, 'Alerts retrieved.', {
      alerts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getLiveRiskScore = async (req, res) => {
  try {
    const recent = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('riskScore riskLevel');

    if (!recent.length) {
      return sendSuccess(res, 200, 'Risk score retrieved.', { score: 0, level: 'LOW' });
    }

    const avg = recent.reduce((s, t) => s + t.riskScore, 0) / recent.length;
    const score = Math.round(avg);
    const level = score <= 30 ? 'LOW' : score <= 70 ? 'MEDIUM' : 'HIGH';

    return sendSuccess(res, 200, 'Risk score retrieved.', { score, level, sampleSize: recent.length });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};