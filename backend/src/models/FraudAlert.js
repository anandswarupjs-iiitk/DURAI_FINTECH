const mongoose = require('mongoose');

const fraudAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reasons: [{ type: String }],
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: { type: Date },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FraudAlert', fraudAlertSchema);