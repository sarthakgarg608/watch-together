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
  /*
   * PLAY
   */
  registerRateLimitedEvent(
    socket,
    "playback:play",
    async (payload = {}) => {
      await handlePlaybackUpdate({
        io,
        socket,
        isPlaying: true,
        position: payload.position,
      });
    },
    playbackSocketRateLimit,
    "You are controlling playback too quickly."
  );

  /*
   * PAUSE
   */
  registerRateLimitedEvent(
    socket,
    "playback:pause",
    async (payload = {}) => {
      await handlePlaybackUpdate({
        io,
        socket,
        isPlaying: false,
        position: payload.position,
      });
    },
    playbackSocketRateLimit,
    "You are controlling playback too quickly."
  );

  /*
   * SEEK
   *
   * Seeking should NOT automatically mean "playing".
   *
   * If isPlaying is provided by the frontend,
   * use it.
   *
   * Otherwise preserve the current playback state.
   */
  registerRateLimitedEvent(
    socket,
    "playback:seek",
    async (payload = {}) => {
      let isPlaying = payload.isPlaying;

      if (typeof isPlaying !== "boolean") {
        const currentState =
          await PlaybackState.findOne({
            room: socket.data.roomId,
          }).select("isPlaying");

        isPlaying =
          currentState?.isPlaying ?? false;
      }

      await handlePlaybackUpdate({
        io,
        socket,
        isPlaying,
        position: payload.position,
      });
    },
    playbackSocketRateLimit,
    "You are controlling playback too quickly."
  );

  /*
   * SYNC REQUEST
   */
  registerRateLimitedEvent(
    socket,
    "playback:sync-request",
    async () => {
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

      const room = await Room.findOne({
        _id: socket.data.roomId,
        roomCode: socket.data.roomCode,
        isActive: true,
      }).select(
        "_id selectedMovie"
      );

      if (!room) {
        socket.emit("playback:error", {
          message:
            "Room not found or is no longer active.",
        });

        return;
      }

      const playbackState =
        await PlaybackState.findOne({
          room: room._id,
        })
          .populate(
            "updatedBy",
            "_id name"
          )
          .lean();

      /*
       * No playback state yet.
       */
      if (!playbackState) {
        socket.emit("playback:sync", {
          movieId:
            room.selectedMovie?.movieId ||
            null,
          isPlaying: false,
          position: 0,
          updatedAt: new Date(),
          updatedBy: null,
        });

        return;
      }

      /*
       * Protect against stale playback data.
       *
       * If the playback state belongs to another
       * movie, start from zero.
       */
      if (
        playbackState.movieId !==
        (room.selectedMovie?.movieId || null)
      ) {
        socket.emit("playback:sync", {
          movieId:
            room.selectedMovie?.movieId ||
            null,
          isPlaying: false,
          position: 0,
          updatedAt: new Date(),
          updatedBy: null,
        });

        return;
      }

      socket.emit("playback:sync", {
        movieId:
          playbackState.movieId,

        isPlaying:
          playbackState.isPlaying,

        position:
          playbackState.currentPosition,

        updatedAt:
          playbackState.lastUpdatedAt,

        updatedBy:
          playbackState.updatedBy
            ? {
                userId:
                  playbackState.updatedBy._id,
                name:
                  playbackState.updatedBy.name,
              }
            : null,
      });
    },
    playbackSocketRateLimit,
    "Too many synchronization requests."
  );
};

/*
 * Common playback update handler.
 */
const handlePlaybackUpdate = async ({
  io,
  socket,
  isPlaying,
  position,
}) => {
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

  /*
   * Validate isPlaying.
   */
  if (typeof isPlaying !== "boolean") {
    socket.emit("playback:error", {
      message:
        "Invalid playback state.",
    });

    return;
  }

  /*
   * Validate position.
   */
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

  /*
   * Find active room.
   */
  const room = await Room.findOne({
    _id: socket.data.roomId,
    roomCode: socket.data.roomCode,
    isActive: true,
  }).select(
    "_id roomCode host selectedMovie"
  );

  if (!room) {
    socket.emit("playback:error", {
      message:
        "Room not found or is no longer active.",
    });

    return;
  }

  /*
   * Only host controls playback.
   */
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

  /*
   * Verify host membership.
   */
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

  /*
   * A movie must be selected.
   */
  const selectedMovieId =
    room.selectedMovie?.movieId;

  if (!selectedMovieId) {
    socket.emit("playback:error", {
      message:
        "Select a movie before controlling playback.",
    });

    return;
  }

  const now = new Date();

  /*
   * Update playback state.
   */
  const playbackState =
    await PlaybackState.findOneAndUpdate(
      {
        room: room._id,
      },
      {
        $set: {
          movieId: selectedMovieId,
          isPlaying,
          currentPosition: position,
          lastUpdatedAt: now,
          updatedBy: socket.user.userId,
        },
        $setOnInsert: {
          room: room._id,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    ).lean();

  const socketRoom =
    `room:${socket.data.roomCode}`;

  /*
   * Broadcast the new state to everyone
   * currently connected to the room.
   */
  io.to(socketRoom).emit(
    "playback:updated",
    {
      movieId:
        playbackState.movieId,

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
};

export default registerPlaybackSocket;