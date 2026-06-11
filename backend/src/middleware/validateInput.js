const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').isString().trim(),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Min 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain uppercase')
    .matches(/[0-9]/).withMessage('Must contain a number')
    .matches(/[!@#$%^&*]/).withMessage('Must contain a special character'),
];

const loginValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const transactionValidation = [
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ gt: 0 }).withMessage('Must be positive number'),
  body('recipient').notEmpty().withMessage('Recipient is required').isString().trim(),
  body('type').notEmpty().withMessage('Type is required').isIn(['debit', 'credit', 'transfer']).withMessage('Invalid type'),
  body('description').optional().isString().isLength({ max: 200 }).trim(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { registerValidation, loginValidation, transactionValidation, handleValidationErrors };