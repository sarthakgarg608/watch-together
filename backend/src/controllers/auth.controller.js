import bcrypt from "bcryptjs";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../utils/jwt.js";
import {
  refreshTokenCookieName,
  refreshTokenCookieOptions,
} from "../utils/cookie.js";



import Otp from "../models/Otp.js";

import {
  sendOtpEmail,
} from "../services/email.service.js";

import generateOtp from "../utils/otp.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // -----------------------------------------
  // 1. Validate required fields
  // -----------------------------------------

  if (!name) {
    throw new ApiError(400, "Name is required.");
  }

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  // -----------------------------------------
  // 2. Validate name
  // -----------------------------------------

  if (name.trim().length < 2) {
    throw new ApiError(
      400,
      "Name must be at least 2 characters long."
    );
  }

  // -----------------------------------------
  // 3. Validate password
  // -----------------------------------------

  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long."
    );
  }

  // -----------------------------------------
  // 4. Normalize email
  // -----------------------------------------

  const normalizedEmail = email.trim().toLowerCase();

  // -----------------------------------------
  // 5. Check if user already exists
  // -----------------------------------------

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email already exists."
    );
  }

  // -----------------------------------------
  // 6. Hash password
  // -----------------------------------------

  const hashedPassword = await bcrypt.hash(password, 12);

  // -----------------------------------------
  // 7. Create user
  // -----------------------------------------

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  // -----------------------------------------
  // 8. Remove password before sending response
  // -----------------------------------------

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };

  // -----------------------------------------
  // 9. Send response
  // -----------------------------------------

  res.status(201).json(
    new ApiResponse(
      201,
      userResponse,
      "Account created successfully."
    )
  );
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // -----------------------------------------
  // 1. Validate required fields
  // -----------------------------------------

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  // -----------------------------------------
  // 2. Normalize email
  // -----------------------------------------

  const normalizedEmail = email.trim().toLowerCase();

  // -----------------------------------------
  // 3. Find user
  // -----------------------------------------

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  // -----------------------------------------
  // 4. Compare password
  // -----------------------------------------

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  // -----------------------------------------
  // 5. Update last login time
  // -----------------------------------------

  user.lastLoginAt = new Date();
  await user.save();

  // -----------------------------------------
  // 6. Generate JWT tokens
  // -----------------------------------------

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  const {
  token: refreshToken,
  familyId,
} = generateRefreshToken(
  user._id.toString()
);
  const refreshTokenHash =
  hashToken(refreshToken);

await RefreshToken.create({
  user: user._id,
  tokenHash: refreshTokenHash,
  familyId,
  expiresAt: new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ),
});



  // -----------------------------------------
  // 7. Prepare user response
  // -----------------------------------------

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  // -----------------------------------------
  // 8. Send response
  // -----------------------------------------

  res
  .status(200)
  .cookie(
    refreshTokenCookieName,
    refreshToken,
    refreshTokenCookieOptions
  )
  .json(
    new ApiResponse(
      200,
      {
        user: userResponse,
        accessToken,
      },
      "Login successful."
    )
  );
});
const refreshAccessToken = asyncHandler(
  async (req, res) => {
    const refreshToken =
      req.cookies[refreshTokenCookieName];

    if (!refreshToken) {
      throw new ApiError(
        401,
        "Refresh token is required."
      );
    }

    let decodedToken;

    try {
      decodedToken =
        verifyRefreshToken(refreshToken);
    } catch (error) {
      res.clearCookie(
        refreshTokenCookieName,
        refreshTokenCookieOptions
      );

      if (
        error.name === "TokenExpiredError"
      ) {
        throw new ApiError(
          401,
          "Refresh token has expired."
        );
      }

      throw new ApiError(
        401,
        "Invalid refresh token."
      );
    }

    if (
      !decodedToken.userId ||
      !decodedToken.familyId
    ) {
      throw new ApiError(
        401,
        "Invalid refresh token."
      );
    }

    const incomingTokenHash =
      hashToken(refreshToken);

    const storedToken =
      await RefreshToken.findOne({
        tokenHash: incomingTokenHash,
      });

    if (!storedToken) {
      res.clearCookie(
        refreshTokenCookieName,
        refreshTokenCookieOptions
      );

      throw new ApiError(
        401,
        "Invalid refresh token."
      );
    }

    /*
     * If this token was already revoked, someone is
     * trying to reuse an old refresh token.
     *
     * Revoke the entire token family.
     */
    if (storedToken.revokedAt) {
      await RefreshToken.updateMany(
        {
          familyId: storedToken.familyId,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        }
      );

      res.clearCookie(
        refreshTokenCookieName,
        refreshTokenCookieOptions
      );

      throw new ApiError(
        401,
        "Refresh token reuse detected. Please log in again."
      );
    }

    if (
      storedToken.expiresAt.getTime() <
      Date.now()
    ) {
      storedToken.revokedAt =
        new Date();

      await storedToken.save();

      res.clearCookie(
        refreshTokenCookieName,
        refreshTokenCookieOptions
      );

      throw new ApiError(
        401,
        "Refresh token has expired."
      );
    }

    if (
      storedToken.user.toString() !==
      decodedToken.userId
    ) {
      throw new ApiError(
        401,
        "Invalid refresh token."
      );
    }

    if (
      storedToken.familyId !==
      decodedToken.familyId
    ) {
      throw new ApiError(
        401,
        "Invalid refresh token."
      );
    }

    const user =
      await User.findById(
        decodedToken.userId
      );

    if (!user) {
      res.clearCookie(
        refreshTokenCookieName,
        refreshTokenCookieOptions
      );

      throw new ApiError(
        401,
        "User no longer exists."
      );
    }

    /*
     * Generate a NEW refresh token.
     * It belongs to the same token family.
     */
    const {
      token: newRefreshToken,
      familyId,
    } = generateRefreshToken(
      user._id.toString(),
      storedToken.familyId
    );

    const newRefreshTokenHash =
      hashToken(newRefreshToken);

    /*
     * Revoke the old token.
     */
    storedToken.revokedAt =
      new Date();

    storedToken.replacedByTokenHash =
      newRefreshTokenHash;

    await storedToken.save();

    /*
     * Store the new refresh token.
     */
    await RefreshToken.create({
      user: user._id,
      tokenHash: newRefreshTokenHash,
      familyId,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    });

    const accessToken =
      generateAccessToken(
        user._id.toString()
      );

    /*
     * Replace the browser cookie with the
     * newly generated refresh token.
     */
    res
      .cookie(
        refreshTokenCookieName,
        newRefreshToken,
        refreshTokenCookieOptions
      )
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
          },
          "Access token refreshed successfully."
        )
      );
  }
);
const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken =
  req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(
      400,
      "Refresh token is required."
    );
  }

  await RefreshToken.deleteOne({
    tokenHash: hashToken(refreshToken),
  });

  res
  .clearCookie(
    refreshTokenCookieName,
    refreshTokenCookieOptions
  )
  .status(200)
  .json(
    new ApiResponse(
      200,
      null,
      "Logged out successfully."
    )
  );
});
const sendVerificationOtp = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(
        400,
        "Email is required."
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    if (user.isEmailVerified) {
      throw new ApiError(
        400,
        "Email is already verified."
      );
    }

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(
      otp,
      10
    );

    await Otp.findOneAndUpdate(
      {
        email: normalizedEmail,
        purpose: "email-verification",
      },
      {
        email: normalizedEmail,
        otpHash,
        purpose: "email-verification",
        expiresAt: new Date(
          Date.now() + 5 * 60 * 1000
        ),
      },
      {
        upsert: true,
        new: true,
      }
    );

    await sendOtpEmail({
      email: normalizedEmail,
      otp,
      purpose: "email-verification",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Verification OTP sent successfully."
      )
    );
  }
);
const verifyEmail = asyncHandler(
  async (req, res) => {
    const { email, otp } = req.body;

    if (!email) {
      throw new ApiError(
        400,
        "Email is required."
      );
    }

    if (!otp) {
      throw new ApiError(
        400,
        "OTP is required."
      );
    }

    if (otp.length !== 6) {
      throw new ApiError(
        400,
        "OTP must be 6 digits."
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "email-verification",
    });

    if (!otpRecord) {
      throw new ApiError(
        400,
        "OTP not found or expired."
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      throw new ApiError(
        400,
        "OTP has expired."
      );
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  throw new ApiError(
    400,
    "Too many incorrect OTP attempts. Please request a new OTP."
  );
}

const isOtpValid = await bcrypt.compare(
  otp,
  otpRecord.otpHash
);

if (!isOtpValid) {
  otpRecord.attempts += 1;

  await otpRecord.save();

  throw new ApiError(
    400,
    "Invalid OTP."
  );
}

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    user.isEmailVerified = true;

    await user.save();

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Email verified successfully."
      )
    );
  }
);
const forgotPassword = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(
        400,
        "Email is required."
      );
    }

    if (typeof email !== "string") {
      throw new ApiError(
        400,
        "Email must be a valid string."
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
     * We intentionally do not reveal whether
     * this email belongs to an existing account.
     *
     * This prevents account enumeration.
     */
    if (user) {
      const otp = generateOtp();

      const otpHash = await bcrypt.hash(
        otp,
        10
      );

      await Otp.findOneAndUpdate(
        {
          email: normalizedEmail,
          purpose: "password-reset",
        },
        {
          email: normalizedEmail,
          otpHash,
          purpose: "password-reset",

          // OTP expires after 5 minutes.
          expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
          ),

          // New OTP gets a fresh attempt counter.
          attempts: 0,
          maxAttempts: 5,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      await sendOtpEmail({
        email: normalizedEmail,
        otp,
        purpose: "password-reset",
      });
    }

    /*
     * Same response whether the account exists
     * or doesn't exist.
     */
    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "If an account exists with this email, a password reset OTP has been sent."
      )
    );
  }
);

const resetPassword = asyncHandler(
  async (req, res) => {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email) {
      throw new ApiError(
        400,
        "Email is required."
      );
    }

    if (!otp) {
      throw new ApiError(
        400,
        "OTP is required."
      );
    }

    if (!newPassword) {
      throw new ApiError(
        400,
        "New password is required."
      );
    }

    if (newPassword.length < 8) {
      throw new ApiError(
        400,
        "Password must be at least 8 characters long."
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "password-reset",
    });

    if (!otpRecord) {
      throw new ApiError(
        400,
        "OTP not found or expired."
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      throw new ApiError(
        400,
        "OTP has expired."
      );
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  throw new ApiError(
    400,
    "Too many incorrect OTP attempts. Please request a new OTP."
  );
}

const isOtpValid = await bcrypt.compare(
  otp,
  otpRecord.otpHash
);

if (!isOtpValid) {
  otpRecord.attempts += 1;

  await otpRecord.save();

  throw new ApiError(
    400,
    "Invalid OTP."
  );
}

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        12
      );

    await user.save();

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    // Invalidate existing refresh tokens
    await RefreshToken.deleteMany({
      user: user._id,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Password reset successfully."
      )
    );
  }
);
export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
};