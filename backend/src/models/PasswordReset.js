const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
    // Auto-delete document after expiry
    index: { expireAfterSeconds: 0 },
  },
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);