import mongoose from "mongoose";

const playbackStateSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true,
      index: true,
    },

    isPlaying: {
      type: Boolean,
      default: false,
    },

    currentPosition: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlaybackState = mongoose.model(
  "PlaybackState",
  playbackStateSchema
);

export default PlaybackState;