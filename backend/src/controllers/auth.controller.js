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
import PendingRegistration from "../models/PendingRegistration.js";

const sendRegistrationOtp = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
    } = req.body;

    // -----------------------------------------
    // 1. Validate required fields
    // -----------------------------------------

    if (!name) {
      throw new ApiError(
        400,
        "Name is required."
      );
    }

    if (!email) {
      throw new ApiError(
        400,
        "Email is required."
      );
    }

    if (!password) {
      throw new ApiError(
        400,
        "Password is required."
      );
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

    const normalizedEmail =
      email.trim().toLowerCase();

    // -----------------------------------------
    // 5. Check whether account already exists
    // -----------------------------------------

    const existingUser =
      await User.findOne({
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

    const passwordHash =
      await bcrypt.hash(password, 12);

    // -----------------------------------------
    // 7. Create/update pending registration
    // -----------------------------------------

    await PendingRegistration.findOneAndUpdate(
      {
        email: normalizedEmail,
      },
      {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        expiresAt: new Date(
          Date.now() + 10 * 60 * 1000
        ),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // -----------------------------------------
    // 8. Generate OTP
    // -----------------------------------------

    const otp = generateOtp();

    // -----------------------------------------
    // 9. Hash OTP
    // -----------------------------------------

    const otpHash =
      await bcrypt.hash(otp, 10);

    // -----------------------------------------
    // 10. Store OTP
    // -----------------------------------------

    await Otp.findOneAndUpdate(
      {
        email: normalizedEmail,
        purpose: "registration",
      },
      {
        email: normalizedEmail,
        otpHash,
        purpose: "registration",
        expiresAt: new Date(
          Date.now() + 5 * 60 * 1000
        ),
        attempts: 0,
        maxAttempts: 5,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // -----------------------------------------
    // 11. Send OTP email
    // -----------------------------------------

    await sendOtpEmail({
      email: normalizedEmail,
      otp,
      purpose: "registration",
    });

    // -----------------------------------------
    // 12. Send response
    // -----------------------------------------

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Registration OTP sent successfully."
      )
    );
  }
);

const verifyRegistrationOtp = asyncHandler(
  async (req, res) => {
    const {
      email,
      otp,
    } = req.body;

    // -----------------------------------------
    // 1. Validate required fields
    // -----------------------------------------

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

    if (!/^\d{6}$/.test(otp)) {
      throw new ApiError(
        400,
        "OTP must be 6 digits."
      );
    }

    // -----------------------------------------
    // 2. Normalize email
    // -----------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // -----------------------------------------
    // 3. Find pending registration
    // -----------------------------------------

    const pendingRegistration =
      await PendingRegistration.findOne({
        email: normalizedEmail,
      });

    if (!pendingRegistration) {
      throw new ApiError(
        400,
        "Registration session not found or expired. Please start registration again."
      );
    }

    // -----------------------------------------
    // 4. Check registration expiration
    // -----------------------------------------

    if (
      pendingRegistration.expiresAt < new Date()
    ) {
      await PendingRegistration.deleteOne({
        _id: pendingRegistration._id,
      });

      await Otp.deleteOne({
        email: normalizedEmail,
        purpose: "registration",
      });

      throw new ApiError(
        400,
        "Registration session has expired. Please start again."
      );
    }

    // -----------------------------------------
    // 5. Find OTP
    // -----------------------------------------

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "registration",
    });

    if (!otpRecord) {
      throw new ApiError(
        400,
        "OTP not found or expired. Please request a new OTP."
      );
    }

    // -----------------------------------------
    // 6. Check OTP expiration
    // -----------------------------------------

    if (
      otpRecord.expiresAt < new Date()
    ) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      throw new ApiError(
        400,
        "OTP has expired. Please request a new OTP."
      );
    }

    // -----------------------------------------
    // 7. Check maximum attempts
    // -----------------------------------------

    if (
      otpRecord.attempts >=
      otpRecord.maxAttempts
    ) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      throw new ApiError(
        400,
        "Too many incorrect OTP attempts. Please request a new OTP."
      );
    }

    // -----------------------------------------
    // 8. Verify OTP
    // -----------------------------------------

    const isOtpValid =
      await bcrypt.compare(
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

    // -----------------------------------------
    // 9. Check again whether account exists
    // -----------------------------------------
    //
    // This protects against the email being
    // registered while OTP verification was
    // taking place.
    //

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      await PendingRegistration.deleteOne({
        _id: pendingRegistration._id,
      });

      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      throw new ApiError(
        409,
        "An account with this email already exists."
      );
    }

    // -----------------------------------------
    // 10. Create the real user
    // -----------------------------------------

    let user;

    try {
      user = await User.create({
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        password: pendingRegistration.passwordHash,
        isEmailVerified: true,
      });
    } catch (error) {
      /*
       * MongoDB unique-index protection.
       *
       * This can happen if another request created
       * the same account concurrently.
       */
      if (error.code === 11000) {
        throw new ApiError(
          409,
          "An account with this email already exists."
        );
      }

      throw error;
    }

    // -----------------------------------------
    // 11. Remove temporary registration data
    // -----------------------------------------

    await PendingRegistration.deleteOne({
      _id: pendingRegistration._id,
    });

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    // -----------------------------------------
    // 12. Prepare user response
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
    // 13. Send response
    // -----------------------------------------

    res.status(201).json(
      new ApiResponse(
        201,
        userResponse,
        "Account created successfully. Please log in."
      )
    );
  }
);

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

  if (!user.isEmailVerified) {
  throw new ApiError(
    403,
    "Please verify your email before logging in."
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
 * Atomically revoke the old refresh token.
 *
 * Only the first refresh request should be able
 * to rotate this token.
 */
const revokedToken =
  await RefreshToken.findOneAndUpdate(
    {
      _id: storedToken._id,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
        replacedByTokenHash:
          newRefreshTokenHash,
      },
    },
    {
      new: true,
    }
  );

if (!revokedToken) {
  // Another request already rotated this token.
  //
  // Revoke the entire token family because this
  // indicates refresh-token reuse.
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
    req.cookies[refreshTokenCookieName];

  // Logout should be idempotent.
  // Even if the cookie does not exist, the client
  // should still end up in a logged-out state.
  if (!refreshToken) {
    return res
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
  }

  const refreshTokenHash =
    hashToken(refreshToken);

  // Revoke the refresh token instead of deleting it.
  //
  // Keeping the record allows us to detect reuse of
  // an already-revoked refresh token.
  await RefreshToken.findOneAndUpdate(
    {
      tokenHash: refreshTokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );

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

    await RefreshToken.updateMany(
      {
        user: user._id,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );

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
  loginUser,
  refreshAccessToken,
  logoutUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
};