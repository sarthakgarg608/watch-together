import PlaybackState from "../models/PlaybackState.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getPlaybackState = asyncHandler(async (req, res) => {
  let playbackState = await PlaybackState.findOne({
    room: req.room._id,
  })
    .populate("updatedBy", "_id name")
    .lean();

  // A room may not have a playback state yet.
  // Create the initial state when it is requested for the first time.
  if (!playbackState) {
    playbackState = await PlaybackState.create({
      room: req.room._id,
      isPlaying: false,
      currentPosition: 0,
      lastUpdatedAt: new Date(),
      updatedBy: req.user.userId,
    });

    playbackState = await PlaybackState.findById(playbackState._id)
      .populate("updatedBy", "_id name")
      .lean();
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
  const { isPlaying, currentPosition } = req.body;

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

  // Only the host controls playback.
  if (req.room.host.toString() !== req.user.userId) {
    throw new ApiError(
      403,
      "Only the room host can control playback."
    );
  }

  const playbackState = await PlaybackState.findOneAndUpdate(
    {
      room: req.room._id,
    },
    {
      $set: {
        isPlaying,
        currentPosition,
        lastUpdatedAt: new Date(),
        updatedBy: req.user.userId,
      },
    },
    {
      new: true,
      upsert: true,
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