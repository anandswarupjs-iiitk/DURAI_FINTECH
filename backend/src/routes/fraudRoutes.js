const express = require('express');
const router = express.Router();
const { analyzeTransactionManual, getAlerts, getLiveRiskScore } = require('../controllers/fraudController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/analyze', analyzeTransactionManual);
router.get('/alerts', getAlerts);
router.get('/risk-score', getLiveRiskScore);

module.exports = router;