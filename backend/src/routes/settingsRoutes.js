const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, disable2FA } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.put('/disable-2fa', disable2FA);

module.exports = router;