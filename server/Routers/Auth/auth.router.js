const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyRegistrationOTP,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
} = require("../../Controllers/Auth/auth.controller");

// @desc    Register new user (sends OTP via EmailJS)
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Verify OTP for registration
// @route   POST /api/auth/verify-otp
// @access  Public
router.post(
  "/verify-otp",
  function (req, res, next) {
    console.log("OTP verification route hit");
    next(); // Pass control to the next middleware
  },
  verifyRegistrationOTP
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", logoutUser);

// @desc    Forgot password (sends OTP via EmailJS)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post("/forgot-password", forgotPassword);

// @desc    Reset password with OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
router.post("/reset-password", resetPassword);

// @desc    Check authentication status (protected route example)
// @route   GET /api/auth/check-auth
// @access  Private
router.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name,
    },
  });
});

module.exports = router;
