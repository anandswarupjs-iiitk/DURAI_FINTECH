const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const { transactionValidation, handleValidationErrors } = require('../middleware/validateInput');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/',  verifyToken, transactionValidation, handleValidationErrors, createTransaction);
router.get('/',   verifyToken, getTransactions);

module.exports = router;