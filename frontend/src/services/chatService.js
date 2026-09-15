
import { apiRequest } from "./api";

// --------------------------------------------------
// Get Room Messages
// --------------------------------------------------

async function getMessages(
  roomCode,
  token
) {
  if (!roomCode) {
    throw new Error(
      "Room code is required."
    );
  }

  return apiRequest(
    `/chat/${encodeURIComponent(
      roomCode.trim().toUpperCase()
    )}`,
    {
      method: "GET",
      token,
    }
  );
}

const chatService = {
  getMessages,
};

export default chatService;

