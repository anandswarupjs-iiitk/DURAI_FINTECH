const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
{
    // ───────────────── USER DETAILS ─────────────────
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference required"],
        index: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    recipient: {
        type: String,
        trim: true,
    },

    // ───────────────── TRANSACTION DETAILS ─────────────────
    amount: {
        type: Number,
        required: [true, "Transaction amount required"],
        min: [1, "Amount must be greater than 0"],
    },

    merchant: {
        type: String,
        trim: true,
        default: "Unknown",
    },

    description: {
        type: String,
        trim: true,
        maxlength: [200, "Description too long"],
    },

    category: {
        type: String,
        enum: [
            "Food",
            "Transport",
            "Shopping",
            "Entertainment",
            "Transfer",
            "Bills",
            "Investment",
            "Other",
        ],
        default: "Transfer",
    },

    type: {
        type: String,
        enum: ["debit", "credit", "transfer"],
        required: true,
    },

    // ───────────────── STATUS ─────────────────
    status: {
        type: String,
        enum: [
            "pending",
            "completed",
            "failed",
            "flagged",
            "blocked",
        ],
        default: "pending",
    },

    // ───────────────── FRAUD DETECTION ─────────────────
    fraudFlag: {
        type: Boolean,
        default: false,
    },

    flagged: {
        type: Boolean,
        default: false,
    },

    isFlagged: {
        type: Boolean,
        default: false,
    },

    flagReasons: {
        type: [String],
        default: [],
    },

    fraudReasons: {
        type: [String],
        default: [],
    },

    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },

    riskLevel: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW",
    },

    riskPercentage: {
        type: String,
        default: "0%",
    },

    // ───────────────── SECURITY TRACKING ─────────────────
    ipAddress: {
        type: String,
    },

    deviceFingerprint: {
        type: String,
    },

    location: {
        type: String,
    },

},
{
    timestamps: true,
}
);

// ───────────────── INDEXES ─────────────────

transactionSchema.index({
    user: 1,
    createdAt: -1,
});

transactionSchema.index({
    user: 1,
    status: 1,
});

transactionSchema.index({
    fraudFlag: 1,
    riskScore: -1,
});

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);