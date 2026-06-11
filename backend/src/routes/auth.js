const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  getProfile,
  setup2FA,
  uploadPhoto,
  verify2FA,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const upload =
require("../middleware/upload");

const {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} = require("../middleware/validateInput");

const { verifyToken } = require("../middleware/verifyToken");

// ================= REGISTER =================
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  register
);

// ================= LOGIN =================
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  login
);

// ================= LOGOUT =================
router.post(
  "/logout",
  verifyToken,
  logout
);

// ================= CURRENT USER =================
router.get(
  "/me",
  verifyToken,
  getMe
);

// ================= REFRESH TOKEN =================
router.post(
  "/refresh-token",
  refreshToken
);

// ================= 2FA SETUP =================
router.get(
  "/2fa/setup",
  verifyToken,
  setup2FA
);

// ================= 2FA VERIFY =================
router.post(
  "/2fa/verify",
  verifyToken,
  verify2FA
);

router.get(
  "/profile",
  verifyToken,
  getProfile
);

router.get("/routes", (req, res) => {
  res.json({
    routes: [
      "POST /register",
      "POST /login",
      "POST /logout",
      "GET /me",
      "POST /refresh-token",
      "GET /2fa/setup",
      "POST /2fa/verify"
    ]
  });
});

router.put(
  "/upload-photo",
  verifyToken,
  upload.single("profileImage"),
  uploadPhoto
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);


module.exports = router;