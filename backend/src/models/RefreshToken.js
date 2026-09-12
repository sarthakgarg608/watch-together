import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // SHA-256 hash of the actual refresh token.
    // We never store the raw refresh token in MongoDB.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // All rotated tokens from the same login session
    // belong to the same token family.
    familyId: {
      type: String,
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // null means the token is still usable.
    revokedAt: {
      type: Date,
      default: null,
    },

    // Helps us understand which token replaced this one.
    replacedByTokenHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;