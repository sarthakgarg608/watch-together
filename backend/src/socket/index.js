import { Server } from "socket.io";

import env from "../config/env.js";

import socketAuth from "./socketAuth.js";
import registerRoomSocket from "./room.socket.js";
import registerPlaybackSocket from "./playback.socket.js";
import registerChatSocket from "./chat.socket.js";

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.user.userId}`
    );

    registerRoomSocket(io, socket);
    registerPlaybackSocket(io, socket);
    registerChatSocket(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.user.userId} (${reason})`
      );
    });
  });

  return io;
}

export default initializeSocket;