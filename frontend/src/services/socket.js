
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
});

// --------------------------------------------------
// Connect Socket
// --------------------------------------------------

function connectSocket(accessToken) {
  if (!accessToken) {
    throw new Error(
      "Access token is required to connect to Socket.IO."
    );
  }

  /*
   * Backend socketAuth.js expects:
   *
   * socket.handshake.auth.accessToken
   */
  socket.auth = {
    accessToken,
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

// --------------------------------------------------
// Disconnect Socket
// --------------------------------------------------

function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

// --------------------------------------------------
// Join Room
// --------------------------------------------------

function joinSocketRoom(roomCode) {
  if (!roomCode) {
    throw new Error("Room code is required.");
  }

  socket.emit("room:join", {
    roomCode: roomCode
      .trim()
      .toUpperCase(),
  });
}

// --------------------------------------------------
// Leave Room
// --------------------------------------------------

function leaveSocketRoom() {
  if (!socket.connected) {
    return;
  }

  socket.emit("room:leave");
}

export {
  socket,
  connectSocket,
  disconnectSocket,
  joinSocketRoom,
  leaveSocketRoom,
};

export default socket;

