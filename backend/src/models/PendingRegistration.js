import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * MongoDB automatically removes expired
 * pending registration documents.
 *
 * A registration is allowed to remain pending
 * for 10 minutes.
 */
pendingRegistrationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);

export default PendingRegistration;