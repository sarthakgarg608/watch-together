import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Maximum requests from one IP during the window.
  limit: 30,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication requests. Please try again later.",
  },
});

const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,

  // OTP endpoints are intentionally stricter.
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many OTP requests. Please try again later.",
  },
});

const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many password reset requests. Please try again later.",
  },
});

export {
  authRateLimiter,
  otpRateLimiter,
  passwordResetRateLimiter,
};