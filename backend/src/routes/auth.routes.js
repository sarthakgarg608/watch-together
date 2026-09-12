import { Router } from "express";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import {
  authRateLimiter,
  otpRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/authRateLimitMiddleware.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  registerUser
);

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
  "/send-verification-otp",
  otpRateLimiter,
  sendVerificationOtp
);

router.post(
  "/verify-email",
  otpRateLimiter,
  verifyEmail
);

router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  forgotPassword
);

router.post(
  "/reset-password",
  otpRateLimiter,
  resetPassword
);

export default router;