const express = require('express');
const router = express.Router();
const { getExpenseBreakdown, getMonthlyTrends, getSavingsRatio } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/expense-breakdown', getExpenseBreakdown);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/savings-ratio', getSavingsRatio);

module.exports = router;