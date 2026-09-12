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
  hashToken,
};