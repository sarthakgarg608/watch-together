import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: [
        "email-verification",
        "password-reset",
      ],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // Number of incorrect OTP attempts.
    attempts: {
      type: Number,
      default: 0,
    },

    // Maximum incorrect attempts allowed.
    maxAttempts: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Only one active OTP should exist for a particular
 * email + purpose.
 */
otpSchema.index(
  {
    email: 1,
    purpose: 1,
  },
  {
    unique: true,
  }
);

/*
 * MongoDB automatically removes expired OTP documents.
 */
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;