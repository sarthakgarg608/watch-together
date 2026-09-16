import crypto from "crypto";

import jwt from "jsonwebtoken";

import env from "../config/env.js";

function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    env.accessTokenSecret,
    {
      expiresIn: "15m",
    }
  );
}

function generateRefreshToken(
  userId,
  familyId = crypto.randomUUID()
) {
  const token = jwt.sign(
    {
      userId,
      familyId,
    },
    env.refreshTokenSecret,
    {
      expiresIn: "7d",
      jwtid: crypto.randomUUID(),
    }
  );

  return {
    token,
    familyId,
  };
}

function verifyAccessToken(token) {
  return jwt.verify(
    token,
    env.accessTokenSecret
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    env.refreshTokenSecret
  );
}

/*
 * Generate a short-lived token that proves
 * the user has successfully verified their
 * password-reset OTP.
 *
 * This token is NOT an access token and cannot
 * be used to authenticate normal API requests.
 */
function generatePasswordResetToken(userId) {
  return jwt.sign(
    {
      userId,
      purpose: "password-reset",
    },
    env.passwordResetTokenSecret,
    {
      expiresIn: "10m",
      jwtid: crypto.randomUUID(),
    }
  );
}

/*
 * Verify the temporary password-reset token.
 */
function verifyPasswordResetToken(token) {
  return jwt.verify(
    token,
    env.passwordResetTokenSecret
  );
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  hashToken,
};

