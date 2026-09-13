import PlaybackState from "../models/PlaybackState.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getPlaybackState = asyncHandler(async (req, res) => {
  const selectedMovieId =
    req.room.selectedMovie?.movieId || null;

  /*
   * Find the playback state or create it atomically.
   *
   * This avoids the race condition where two requests
   * simultaneously find no playback state and both try
   * to create one.
   */
  const playbackState =
    await PlaybackState.findOneAndUpdate(
      {
        room: req.room._id,
      },
      {
        $setOnInsert: {
          room: req.room._id,
          movieId: selectedMovieId,
          isPlaying: false,
          currentPosition: 0,
          lastUpdatedAt: new Date(),
          updatedBy: req.user.userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )
      .populate("updatedBy", "_id name")
      .lean();

  /*
   * If the room has a selected movie but the stored playback
   * state belongs to another movie, return a fresh state.
   *
   * Normally selectMovie will reset this state, but this check
   * protects us against stale data.
   */
  if (
    selectedMovieId &&
    playbackState.movieId !== selectedMovieId
  ) {
    const resetPlaybackState =
      await PlaybackState.findOneAndUpdate(
        {
          room: req.room._id,
        },
        {
          $set: {
            movieId: selectedMovieId,
            isPlaying: false,
            currentPosition: 0,
            lastUpdatedAt: new Date(),
            updatedBy: req.user.userId,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("updatedBy", "_id name")
        .lean();

    return res.status(200).json(
      new ApiResponse(
        200,
        resetPlaybackState,
        "Playback state fetched successfully."
      )
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      playbackState,
      "Playback state fetched successfully."
    )
  );
});

const updatePlaybackState = asyncHandler(async (req, res) => {
  const {
    isPlaying,
    currentPosition,
  } = req.body;

  if (typeof isPlaying !== "boolean") {
    throw new ApiError(
      400,
      "isPlaying must be a boolean."
    );
  }

  if (
    typeof currentPosition !== "number" ||
    !Number.isFinite(currentPosition) ||
    currentPosition < 0
  ) {
    throw new ApiError(
      400,
      "currentPosition must be a non-negative number."
    );
  }

  // Only the host can control playback.
  if (
    req.room.host.toString() !==
    req.user.userId
  ) {
    throw new ApiError(
      403,
      "Only the room host can control playback."
    );
  }

  // A movie must be selected before playback can be updated.
  const selectedMovieId =
    req.room.selectedMovie?.movieId;

  if (!selectedMovieId) {
    throw new ApiError(
      400,
      "Select a movie before controlling playback."
    );
  }

  const playbackState =
    await PlaybackState.findOneAndUpdate(
      {
        room: req.room._id,
      },
      {
        $set: {
          movieId: selectedMovieId,
          isPlaying,
          currentPosition,
          lastUpdatedAt: new Date(),
          updatedBy: req.user.userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )
      .populate("updatedBy", "_id name")
      .lean();

  res.status(200).json(
    new ApiResponse(
      200,
      playbackState,
      "Playback state updated successfully."
    )
  );
});

export {
  getPlaybackState,
  updatePlaybackState,
};