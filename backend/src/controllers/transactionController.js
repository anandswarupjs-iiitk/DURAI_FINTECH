const Transaction = require("../models/Transaction");
const User = require("../models/User");
const FraudAlert = require("../models/FraudAlert");
const ActivityLog = require("../models/ActivityLog");

const { analyzeTransaction } = require("../ai/fraudDetector");

// ======================================================
// CREATE TRANSACTION
// ======================================================

const createTransaction = async (req, res, next) => {
    try {

        const {
            amount,
            receiver,
            recipient,
            merchant,
            type,
            description,
            category
        } = req.body;

        if (!amount || (!receiver && !recipient)) {
            return res.status(400).json({
                success: false,
                message: "Amount and recipient required"
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Balance Check
        if (
            type !== "credit" &&
            user.balance < amount
        ) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }

        // Fraud Analysis
        const riskResult =
            await analyzeTransaction({
                userId: req.user._id,
                amount,
                recipient:
                    recipient || receiver,
                type,
                ipAddress: req.ip,
            });

        const transaction =
            await Transaction.create({

                user: req.user._id,

                sender: req.user._id,

                receiver,

                recipient,

                merchant,

                amount,

                category:
                    category || "Transfer",

                type:
                    type || "debit",

                description,

                riskScore:
                    riskResult.score || 0,

                riskLevel:
                    riskResult.riskLevel ||
                    "LOW",

                riskPercentage:
                    riskResult.riskPercentage ||
                    "0%",

                fraudFlag:
                    riskResult.flagged || false,

                flagged:
                    riskResult.flagged || false,

                flagReasons:
                    riskResult.reasons || [],

                status:
                    riskResult.flagged
                        ? "flagged"
                        : "completed",

                ipAddress: req.ip,
            });

        // Deduct balance
        if (
            transaction.status !== "blocked" &&
            type !== "credit"
        ) {
            user.balance -= amount;
            await user.save();
        }

        // Create Fraud Alert
        if (
            riskResult.flagged ||
            riskResult.score >= 70
        ) {

            await FraudAlert.create({
                user: req.user._id,
                transaction:
                    transaction._id,

                severity: "HIGH",

                message:
                    "Suspicious transaction detected",

                reasons:
                    riskResult.reasons,
            });
        }

        // Activity Log
        await ActivityLog.create({
            user: req.user._id,

            action:
                riskResult.flagged
                    ? "TRANSACTION_FLAGGED"
                    : "TRANSACTION_CREATED",

            metadata: {
                transactionId:
                    transaction._id,

                amount,

                riskScore:
                    riskResult.score,
            },

            ipAddress: req.ip,

            userAgent:
                req.headers["user-agent"],
        });

        // Socket Events
        const io = req.app.get("io");

        if (io) {

            io.emit(
                "transactionCreated",
                transaction
            );

            if (
                riskResult.flagged ||
                riskResult.score >= 70
            ) {
                io.emit(
                    "fraudAlert",
                    {
                        transaction,
                        riskScore:
                            riskResult.score,
                        riskLevel:
                            riskResult.riskLevel,
                    }
                );
            }
        }

        res.status(201).json({
            success: true,
            transaction,
            riskScore:
                riskResult.score,

            riskLevel:
                riskResult.riskLevel,

            reasons:
                riskResult.reasons,
        });

    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET TRANSACTIONS
// ======================================================

const getTransactions = async (req, res, next) => {
    try {

        const {
            page = 1,
            limit = 10,
            status,
            riskLevel,
            merchant,
            startDate,
            endDate
        } = req.query;

        let filter = {
            user: req.user._id
        };

        if (status) {
            filter.status = status;
        }

        if (riskLevel) {
            filter.riskLevel = riskLevel;
        }

        if (merchant) {
            filter.merchant = {
                $regex: merchant,
                $options: "i",
            };
        }

        if (startDate || endDate) {

            filter.createdAt = {};

            if (startDate) {
                filter.createdAt.$gte =
                    new Date(startDate);
            }

            if (endDate) {
                filter.createdAt.$lte =
                    new Date(endDate);
            }
        }

        const total =
            await Transaction.countDocuments(
                filter
            );

        const transactions =
            await Transaction.find(filter)

                .sort({
                    createdAt: -1,
                })

                .skip(
                    (page - 1) * limit
                )

                .limit(
                    Number(limit)
                );

        res.status(200).json({
            success: true,
            count: total,

            page:
                Number(page),

            totalPages:
                Math.ceil(
                    total / limit
                ),

            transactions,
        });

    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET SINGLE TRANSACTION
// ======================================================

const getTransaction = async (req, res, next) => {
    try {

        const transaction =
            await Transaction.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message:
                    "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            transaction,
        });

    } catch (error) {
        next(error);
    }
};

// ======================================================
// UPDATE TRANSACTION
// ======================================================

const updateTransaction = async (req, res, next) => {
    try {

        const transaction =
            await Transaction.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message:
                    "Transaction not found",
            });
        }

        if (req.body.status) {
            transaction.status =
                req.body.status;
        }

        const updated =
            await transaction.save();

        res.status(200).json({
            success: true,
            transaction: updated,
        });

    } catch (error) {
        next(error);
    }
};

// ======================================================
// DELETE TRANSACTION
// ======================================================

const deleteTransaction = async (req, res, next) => {
    try {

        const transaction =
            await Transaction.findOne({
                _id: req.params.id,
                user: req.user._id,
            });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message:
                    "Transaction not found",
            });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Transaction deleted",
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
};