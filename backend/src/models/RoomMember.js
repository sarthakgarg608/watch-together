import mongoose from "mongoose";

const roomMemberSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["host", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["active", "left"],
      default: "active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    leftAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// A user can have only one membership record for a particular room.
roomMemberSchema.index(
  { room: 1, user: 1 },
  { unique: true }
);

const RoomMember = mongoose.model(
  "RoomMember",
  roomMemberSchema
);

export default RoomMember;