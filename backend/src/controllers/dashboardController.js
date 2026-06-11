const Transaction = require("../models/Transaction");
const FraudAlert = require("../models/FraudAlert");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/apiResponse");


// ========================
// BALANCE
// ========================
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("balance name email");

    return sendSuccess(res, 200, "Balance retrieved.", {
      balance: user.balance,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ========================
// FRAUD SUMMARY
// ========================
exports.getFraudSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalAlerts,
      highAlerts,
      unresolvedAlerts,
      flaggedTransactions,
    ] = await Promise.all([
      FraudAlert.countDocuments({ user: userId }),
      FraudAlert.countDocuments({ user: userId, severity: "HIGH" }),
      FraudAlert.countDocuments({ user: userId, resolved: false }),
      Transaction.countDocuments({ user: userId, isFlagged: true }),
    ]);

    const riskData = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const riskBreakdown = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };

    riskData.forEach((r) => {
      riskBreakdown[r._id] = r.count;
    });

    return sendSuccess(res, 200, "Fraud summary retrieved.", {
      totalAlerts,
      highAlerts,
      unresolvedAlerts,
      flaggedTransactions,
      riskBreakdown,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ========================
// RECENT TRANSACTIONS
// ========================
exports.getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return sendSuccess(res, 200, "Recent transactions retrieved.", {
      transactions,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};