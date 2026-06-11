const express = require("express");
const router = express.Router();

const {
  getBalance,
  getFraudSummary,
  getRecentTransactions,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");


// 🔒 Protect all dashboard routes
router.use(protect);


// =====================
// Dashboard Routes
// =====================

router.get("/balance", getBalance);

router.get("/fraud-summary", getFraudSummary);

router.get("/recent", getRecentTransactions);


module.exports = router;