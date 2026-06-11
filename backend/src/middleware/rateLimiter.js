const rateLimit = require("express-rate-limit");

// ======================================================
// AUTH RATE LIMITER
// Protects login, register, forgot password, reset password
// ======================================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max:
        process.env.NODE_ENV === "production"
            ? 10
            : 50,

    message: {
        success: false,
        message:
            "Too many authentication attempts. Please try again after 15 minutes.",
    },

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,
});

// ======================================================
// GENERAL API LIMITER
// Protects all API endpoints
// ======================================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max:
        process.env.NODE_ENV === "production"
            ? 100
            : 1000,

    message: {
        success: false,
        message:
            "Too many requests. Please try again later.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

// ======================================================
// TRANSACTION LIMITER
// Prevents transaction spam
// ======================================================

const transactionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute

    max:
        process.env.NODE_ENV === "production"
            ? 30
            : 200,

    message: {
        success: false,
        message:
            "Too many transaction requests. Please slow down.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

// ======================================================
// PASSWORD RESET LIMITER
// Prevents email abuse
// ======================================================

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour

    max: 5,

    message: {
        success: false,
        message:
            "Too many password reset requests. Try again later.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    authLimiter,
    apiLimiter,
    transactionLimiter,
    passwordResetLimiter,
};