const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Check if email is from college and registered
router.post('/check-email', authController.checkEmail);

// Signup new user
router.post('/signup', authController.signup);

// Verify OTP (for signup or reset password)
router.post('/verify-otp', authController.verifyOTP);

// Login user
router.post('/login', authController.login);

// Request OTP for password reset
router.post('/request-reset', authController.requestPasswordReset);

// Reset password using OTP
router.post('/reset-password', authController.resetPassword);

module.exports = router;
