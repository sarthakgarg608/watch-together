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

    // Identifies which movie this playback state belongs to.
    // This prevents an old movie's playback position from
    // being reused after the room selects a different movie.
    movieId: {
      type: String,
      default: null,
      trim: true,
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