import { Router } from "express";
import authenticate from "../middleware/authMiddleware.js";

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

router.post(
  "/reset-password",
  otpRateLimiter,
  resetPassword
);

export default router;