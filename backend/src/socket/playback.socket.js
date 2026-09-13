import Room from "../models/Room.js";
import RoomMember from "../models/RoomMember.js";
import PlaybackState from "../models/PlaybackState.js";

import {
  playbackSocketRateLimit,
} from "../middleware/socketRateLimit.js";

import {
  registerRateLimitedEvent,
} from "./socketUtils.js";

const registerPlaybackSocket = (io, socket) => {
  // --------------------------------------------------
  // PLAY
  // --------------------------------------------------
  registerRateLimitedEvent(
    socket,
    "playback:play",
    async ({ position }) => {
      await handlePlaybackUpdate({
        io,
        socket,
        isPlaying: true,
        position,
      });
    },
    playbackSocketRateLimit,
    "You are controlling playback too quickly."
  );

  // --------------------------------------------------
  // PAUSE
  // --------------------------------------------------
  registerRateLimitedEvent(
    socket,
    "playback:pause",
    async ({ position }) => {
      await handlePlaybackUpdate({
        io,
        socket,
        isPlaying: false,
        position,
      });
    },
    playbackSocketRateLimit,
    "You are controlling playback too quickly."
  );

  // --------------------------------------------------
  // SEEK
  // --------------------------------------------------
  registerRateLimitedEvent(
    socket,
    "playback:seek",
    async ({ position }) => {
      await handlePlaybackUpdate({
        io,
        socket,
        isPlaying: true,
        position,
      });
    },
    playbackSocketRateLimit,
    "You are seeking playback too quickly."
  );

  // --------------------------------------------------
  // SYNC REQUEST
  // --------------------------------------------------
  registerRateLimitedEvent(
    socket,
    "playback:sync-request",
    async () => {
      if (!socket.data.roomId) {
        return;
      }

      const playbackState = await PlaybackState.findOne({
        room: socket.data.roomId,
      })
        .populate("updatedBy", "_id name")
        .lean();

      if (!playbackState) {
        return;
      }

      socket.emit("playback:sync", {
        isPlaying: playbackState.isPlaying,
        position: playbackState.currentPosition,
        updatedAt: playbackState.lastUpdatedAt,
      });
    },
    playbackSocketRateLimit,
    "Too many synchronization requests."
  );
};

// --------------------------------------------------
// HANDLE PLAYBACK UPDATE
// --------------------------------------------------
const handlePlaybackUpdate = async ({
  io,
  socket,
  isPlaying,
  position,
}) => {
  try {
    if (
      !socket.data.roomId ||
      !socket.data.roomCode
    ) {
      socket.emit("playback:error", {
        message:
          "You are not connected to a room.",
      });

      return;
    }

    // Validate playback position.
    if (
      typeof position !== "number" ||
      !Number.isFinite(position) ||
      position < 0
    ) {
      socket.emit("playback:error", {
        message:
          "Invalid playback position.",
      });

      return;
    }

    const room = await Room.findOne({
      _id: socket.data.roomId,
      isActive: true,
    }).select(
      "_id host selectedMovie"
    );

    if (!room) {
      socket.emit("playback:error", {
        message:
          "Room not found or is no longer active.",
      });

      return;
    }

    // Only the current host can control playback.
    if (
      room.host.toString() !==
      socket.user.userId
    ) {
      socket.emit("playback:error", {
        message:
          "Only the room host can control playback.",
      });

      return;
    }

    // Make sure the host still has an active
    // host membership.
    const membership =
      await RoomMember.findOne({
        room: room._id,
        user: socket.user.userId,
        status: "active",
        role: "host",
      });

    if (!membership) {
      socket.emit("playback:error", {
        message:
          "You are not the active host of this room.",
      });

      return;
    }

    // Playback is only allowed after selecting
    // a movie.
    if (!room.selectedMovie?.movieId) {
      socket.emit("playback:error", {
        message:
          "Select a movie before controlling playback.",
      });

      return;
    }

    const now = new Date();

    const playbackState =
      await PlaybackState.findOneAndUpdate(
        {
          room: room._id,
        },
        {
          $set: {
            isPlaying,
            currentPosition: position,
            lastUpdatedAt: now,
            updatedBy: socket.user.userId,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      ).lean();

    const socketRoom =
      `room:${socket.data.roomCode}`;

    io.to(socketRoom).emit(
      "playback:updated",
      {
        isPlaying:
          playbackState.isPlaying,

        position:
          playbackState.currentPosition,

        updatedAt:
          playbackState.lastUpdatedAt,

        updatedBy: {
          userId:
            socket.user.userId,

          name:
            socket.user.name,
        },
      }
    );
  } catch (error) {
    console.error(
      "Playback update error:",
      error
    );

    socket.emit("playback:error", {
      message:
        "Unable to update playback.",
    });
  }
};

export default registerPlaybackSocket;