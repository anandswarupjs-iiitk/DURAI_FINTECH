const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"],
    },

    profileImage: {
    type: String,
    default: "",
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please enter a valid email",
        ],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    balance: {
        type: Number,
        default: 50000,
    },

    // ================= FRAUD MONITORING =================

    fraudScore: {
        type: Number,
        default: 0,
    },

    riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low",
    },

    suspiciousTransactions: {
        type: Number,
        default: 0,
    },

    // ================= 2FA =================

    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },

    twoFactorSecret: {
        type: String,
        select: false,
    },

    // ================= PASSWORD RESET =================

    passwordResetToken: {
        type: String,
        select: false,
    },

    passwordResetExpire: {
        type: Date,
        select: false,
    },

    // ================= SECURITY TRACKING =================

    lastLogin: {
        type: Date,
    },

    loginAttempts: {
        type: Number,
        default: 0,
    },

    lockUntil: {
        type: Date,
    },

    deviceFingerprint: {
        type: String,
    },

    ipAddress: {
        type: String,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

},
{
    timestamps: true,
}
);

// ================= HASH PASSWORD =================

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_ROUNDS) || 12
    );

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});

// ================= COMPARE PASSWORD =================

userSchema.methods.comparePassword = async function (
    enteredPassword
) {
    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};

// ================= ACCOUNT LOCK CHECK =================

userSchema.methods.isLocked = function () {

    return (
        this.lockUntil &&
        this.lockUntil > Date.now()
    );
};

// ================= FAILED LOGIN =================

userSchema.methods.incrementLoginAttempts =
async function () {

    if (this.loginAttempts >= 4) {

        this.lockUntil = new Date(
            Date.now() + 15 * 60 * 1000
        );
    }

    this.loginAttempts += 1;

    await this.save();
};

// ================= RESET LOGIN ATTEMPTS =================

userSchema.methods.resetLoginAttempts =
async function () {

    this.loginAttempts = 0;

    this.lockUntil = undefined;

    await this.save();
};

module.exports = mongoose.model(
    "User",
    userSchema
);