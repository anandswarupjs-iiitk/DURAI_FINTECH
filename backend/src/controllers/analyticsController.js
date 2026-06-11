const Transaction = require('../models/Transaction');
const { sendSuccess, sendError } = require('../utils/apiResponse');

exports.getExpenseBreakdown = async (req, res) => {
  try {
    const breakdown = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'debit', status: { $ne: 'blocked' } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    return sendSuccess(res, 200, 'Expense breakdown retrieved.', { breakdown });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getMonthlyTrends = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'blocked' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return sendSuccess(res, 200, 'Monthly trends retrieved.', { trends });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

exports.getSavingsRatio = async (req, res) => {
  try {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: thisMonth },
          status: { $ne: 'blocked' },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let income = 0, expenses = 0;
    result.forEach((r) => {
      if (r._id === 'credit') income = r.total;
      if (r._id === 'debit') expenses = r.total;
    });

    const savingsRatio = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return sendSuccess(res, 200, 'Savings ratio retrieved.', {
      income,
      expenses,
      savings: income - expenses,
      savingsRatio: Math.round(savingsRatio * 10) / 10,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};