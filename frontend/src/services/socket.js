// socket.js
// ------------------------------------------------------
// Central Socket.IO client configuration.
//
// IMPORTANT:
// Backend is NOT created yet.
//
// For now, this file only prepares the frontend
// Socket.IO client.
//
// Later the backend URL will point to our actual
// Node.js + Socket.IO server.
// ------------------------------------------------------

import { io } from "socket.io-client";

// Backend Socket.IO URL.
//
// Backend does not exist yet, so we keep this empty.
// We will configure the real URL when backend starts.
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

// Create one Socket.IO client instance.
//
// autoConnect: false
// ------------------
// We don't want the socket to connect automatically
// when the application starts.
//
// The Room page will explicitly connect when the
// user enters a room.
const socket = io(SOCKET_URL, {
  autoConnect: false,

  transports: [
    "websocket",
    "polling",
  ],
});

export default socket;