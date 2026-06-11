const User = require('../models/User');
const Transaction = require('../models/Transaction');
const FraudAlert = require('../models/FraudAlert');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -refreshTokens -twoFactorSecret')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return sendSuccess(res, 200, 'Users retrieved.', {
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 30, riskLevel, status } = req.query;
    const query = {};
    if (riskLevel) query.riskLevel = riskLevel;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return sendSuccess(res, 200, 'All transactions retrieved.', {
      transactions,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;
    const query = {};
    if (action) query.action = action;
    if (userId) query.user = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return sendSuccess(res, 200, 'Audit logs retrieved.', {
      logs,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getAllAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 30, severity, resolved } = req.query;
    const query = {};
    if (severity) query.severity = severity;
    if (resolved !== undefined) query.resolved = resolved === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FraudAlert.countDocuments(query);
    const alerts = await FraudAlert.find(query)
      .populate('user', 'name email')
      .populate('transaction', 'amount recipient')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return sendSuccess(res, 200, 'All alerts retrieved.', {
      alerts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};