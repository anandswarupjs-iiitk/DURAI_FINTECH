const Transaction = require("../models/Transaction");

const calculateRisk = async (senderId, amount, receiver) => {
    let score = 0;
    const reasons = [];

    // High amount
    if (amount > 10000) {
        score += 35;
        reasons.push("High amount");
    }

    // Extremely high amount
    if (amount > 50000) {
        score += 20;
        reasons.push("Extremely high amount");
    }

    // Time risk
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 4) {
        score += 15;
        reasons.push("Odd transaction time");
    }

    // New recipient
    const recipientExists = await Transaction.findOne({
        sender: senderId,
        receiver
    });

    if (!recipientExists) {
        score += 15;
        reasons.push("New recipient");
    }

    // Repeated transactions
    const oneMinuteAgo = new Date(Date.now() - 60000);

    const recentCount = await Transaction.countDocuments({
        sender: senderId,
        createdAt: { $gte: oneMinuteAgo }
    });

    if (recentCount >= 3) {
        score += 15;
        reasons.push("Repeated transactions");
    }

    score = Math.min(score, 100);

    let level;
    if (score < 30) level = "LOW";
    else if (score < 60) level = "MEDIUM";
    else level = "HIGH";

    return {
        fraudFlag: score >= 60,
        riskScore: score,
        riskLevel: level,
        riskPercentage: `${score}%`,
        reasons
    };
};

module.exports = calculateRisk;
