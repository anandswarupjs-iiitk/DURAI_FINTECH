const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
{
    // ───────────────── USER INFORMATION ─────────────────

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },

    // ───────────────── ACTION TYPE ─────────────────

    action: {
        type: String,
        required: [true, "Action is required"],
        enum: [
            "REGISTER",
            "LOGIN",
            "LOGOUT",
            "LOGIN_FAILED",
            "PASSWORD_CHANGED",
            "PASSWORD_RESET_REQUEST",
            "PASSWORD_RESET_COMPLETE",
            "TRANSACTION_CREATED",
            "TRANSACTION_COMPLETED",
            "TRANSACTION_FAILED",
            "TRANSACTION_FLAGGED",
            "FRAUD_ALERT_CREATED",
            "2FA_ENABLED",
            "2FA_DISABLED",
            "2FA_FAILED",
            "PROFILE_UPDATED",
            "DEVICE_CHANGED",
            "IP_CHANGED",
            "ACCOUNT_LOCKED",
            "ACCOUNT_UNLOCKED",
            "ADMIN_ACTION"
        ],
    },

    // ───────────────── ACTIVITY DETAILS ─────────────────

    details: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Details cannot exceed 500 characters"],
    },

    // ───────────────── SEVERITY LEVEL ─────────────────

    severity: {
        type: String,
        enum: [
            "low",
            "medium",
            "high",
            "critical"
        ],
        default: "low",
    },

    // ───────────────── STATUS ─────────────────

    status: {
        type: String,
        enum: [
            "success",
            "failed",
            "warning"
        ],
        default: "success",
    },

    // ───────────────── SECURITY DATA ─────────────────

    ipAddress: {
        type: String,
        default: "",
        trim: true,
    },

    deviceFingerprint: {
        type: String,
        default: "",
        trim: true,
    },

    userAgent: {
        type: String,
        default: "",
        trim: true,
    },

    location: {
        type: String,
        default: "",
        trim: true,
    },

    // ───────────────── EXTRA METADATA ─────────────────

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    // ───────────────── FRAUD INFORMATION ─────────────────

    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },

    riskLevel: {
        type: String,
        enum: [
            "LOW",
            "MEDIUM",
            "HIGH"
        ],
        default: "LOW",
    },

    fraudDetected: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
}
);

// ───────────────── DATABASE INDEXES ─────────────────

// Recent user activities
activityLogSchema.index({
    user: 1,
    createdAt: -1,
});

// Search by action
activityLogSchema.index({
    action: 1,
});

// Search by severity
activityLogSchema.index({
    severity: 1,
});

// Search by status
activityLogSchema.index({
    status: 1,
});

// Fraud investigation queries
activityLogSchema.index({
    fraudDetected: 1,
    riskScore: -1,
});

// General timeline queries
activityLogSchema.index({
    createdAt: -1,
});

// Auto-delete logs after 90 days
activityLogSchema.index(
    {
        createdAt: 1,
    },
    {
        expireAfterSeconds: 7776000, // 90 days
    }
);

module.exports = mongoose.model(
    "ActivityLog",
    activityLogSchema
);