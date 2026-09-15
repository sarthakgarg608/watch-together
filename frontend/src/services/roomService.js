import { apiRequest } from "./api";

// --------------------------------------------------
// Create Room
// --------------------------------------------------

async function createRoom(roomData, token) {
  if (!roomData?.name) {
    throw new Error("Room name is required.");
  }

  return apiRequest("/rooms", {
    method: "POST",
    token,

    body: {
      name: roomData.name,
      description: roomData.description || "",
      maxParticipants:
        roomData.maxParticipants || 5,
      accessType:
        roomData.accessType || "private",
    },
  });
}

// --------------------------------------------------
// Join Room
// --------------------------------------------------

async function joinRoom(roomCode, token) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  return apiRequest("/rooms/join", {
    method: "POST",
    token,

    body: {
      roomCode: roomCode
        .trim()
        .toUpperCase(),
    },
  });
}

// --------------------------------------------------
// Get Room Details
// --------------------------------------------------

async function getRoom(roomCode, token) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}`,
    {
      method: "GET",
      token,
    }
  );
}

// --------------------------------------------------
// Leave Room
// --------------------------------------------------

async function leaveRoom(roomCode, token) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}/leave`,
    {
      method: "POST",
      token,
    }
  );
}

// --------------------------------------------------
// Update Room
// --------------------------------------------------

async function updateRoom(
  roomCode,
  roomData,
  token
) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}`,
    {
      method: "PATCH",
      token,

      body: roomData,
    }
  );
}

// --------------------------------------------------
// Select Movie
// --------------------------------------------------

async function selectMovie(
  roomCode,
  movieData,
  token
) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  if (!movieData?.movieId) {
    throw new Error("Movie ID is required.");
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}/movie`,
    {
      method: "PATCH",
      token,

      body: {
        movieId: movieData.movieId,
        title: movieData.title || "",
        posterUrl:
          movieData.posterUrl || "",
        videoUrl:
          movieData.videoUrl || "",
      },
    }
  );
}

// --------------------------------------------------
// Remove Participant
// --------------------------------------------------

async function removeParticipant(
  roomCode,
  userId,
  token
) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  if (!userId) {
    throw new Error(
      "Participant user ID is required."
    );
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}/remove-participant`,
    {
      method: "POST",
      token,

      body: {
        userId,
      },
    }
  );
}

// --------------------------------------------------
// Transfer Host
// --------------------------------------------------

async function transferHost(
  roomCode,
  userId,
  token
) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  if (!userId) {
    throw new Error(
      "New host user ID is required."
    );
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}/transfer-host`,
    {
      method: "POST",
      token,

      body: {
        userId,
      },
    }
  );
}

// --------------------------------------------------
// Close Room
// --------------------------------------------------

async function closeRoom(
  roomCode,
  token
) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}/close`,
    {
      method: "POST",
      token,
    }
  );
}

// --------------------------------------------------
// Room Presence
// --------------------------------------------------

async function getRoomPresence(
  roomCode,
  token
) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  return apiRequest(
    `/rooms/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}/presence`,
    {
      method: "GET",
      token,
    }
  );
}

const roomService = {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
  updateRoom,
  selectMovie,
  removeParticipant,
  transferHost,
  closeRoom,
  getRoomPresence,
};

export default roomService;