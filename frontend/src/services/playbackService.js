
import { apiRequest } from "./api";

// --------------------------------------------------
// Get Playback State
// --------------------------------------------------

async function getPlaybackState(
  roomCode,
  token
) {
  if (!roomCode) {
    throw new Error(
      "Room code is required."
    );
  }

  return apiRequest(
    `/playback/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}`,
    {
      method: "GET",
      token,
    }
  );
}

// --------------------------------------------------
// Update Playback State
// --------------------------------------------------
//
// This REST endpoint is useful for loading/fallback
// state. Real-time playback controls use Socket.IO.
//

async function updatePlaybackState(
  roomCode,
  playbackData,
  token
) {
  if (!roomCode) {
    throw new Error(
      "Room code is required."
    );
  }

  if (
    typeof playbackData?.isPlaying !==
    "boolean"
  ) {
    throw new Error(
      "Playback state must be true or false."
    );
  }

  if (
    typeof playbackData?.currentPosition !==
      "number" ||
    !Number.isFinite(
      playbackData.currentPosition
    ) ||
    playbackData.currentPosition < 0
  ) {
    throw new Error(
      "Playback position must be a non-negative number."
    );
  }

  return apiRequest(
    `/playback/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}`,
    {
      method: "PATCH",
      token,
      body: {
        isPlaying:
          playbackData.isPlaying,

        currentPosition:
          playbackData.currentPosition,
      },
    }
  );
}

const playbackService = {
  getPlaybackState,
  updatePlaybackState,
};

export default playbackService;

