import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    maxParticipants: {
      type: Number,
      default: 5,
      min: 2,
      max: 10,
    },

    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    accessType: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    selectedMovie: {
      movieId: {
        type: String,
        default: null,
      },

      title: {
        type: String,
        default: null,
      },

      posterUrl: {
        type: String,
        default: null,
      },

      videoUrl: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;