const express = require('express');
const router = express.Router();
const { getAllUsers, getAllTransactions, getAuditLogs, getAllAlerts } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));
router.get('/users', getAllUsers);
router.get('/transactions', getAllTransactions);
router.get('/logs', getAuditLogs);
router.get('/alerts', getAllAlerts);

module.exports = router;