import { Router } from "express";

import authenticate from "../middleware/authMiddleware.js";

import {
  loginUser,
  refreshAccessToken,
  logoutUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

import {
  authRateLimiter,
  otpRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/authRateLimitMiddleware.js";

const router = Router();

router.post(
  "/login",
  authRateLimiter,
  loginUser
);

router.post(
  "/refresh",
  authRateLimiter,
  refreshAccessToken
);

router.post(
  "/logout",
  logoutUser
);

router.post(
  "/send-registration-otp",
  otpRateLimiter,
  sendRegistrationOtp
);

router.post(
  "/verify-registration-otp",
  otpRateLimiter,
  verifyRegistrationOtp
);

router.post(
  "/send-verification-otp",
  authenticate,
  otpRateLimiter,
  sendVerificationOtp
);

router.post(
  "/verify-email",
  authenticate,
  otpRateLimiter,
  verifyEmail
);

router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  forgotPassword
);

/*
 * Password reset
 *
 * Step 1:
 * Send OTP using /forgot-password
 *
 * Step 2:
 * Verify the OTP.
 *
 * Step 3:
 * Use the returned temporary reset token
 * to change the password.
 */
router.post(
  "/verify-reset-otp",
  otpRateLimiter,
  verifyResetOtp
);

router.post(
  "/reset-password",
  otpRateLimiter,
  resetPassword
);

export default router;

