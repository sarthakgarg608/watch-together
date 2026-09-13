import Room from "../models/Room.js";
import RoomMember from "../models/RoomMember.js";
import Message from "../models/Message.js";

import {
  chatSocketRateLimit,
} from "../middleware/socketRateLimit.js";

import {
  registerRateLimitedEvent,
} from "./socketUtils.js";

const registerChatSocket = (io, socket) => {
  registerRateLimitedEvent(
    socket,
    "chat:send",
    async ({ content }) => {
      if (
        !socket.data.roomId ||
        !socket.data.roomCode
      ) {
        socket.emit("chat:error", {
          message:
            "You are not connected to a room.",
        });

        return;
      }

      if (
        typeof content !== "string" ||
        !content.trim()
      ) {
        socket.emit("chat:error", {
          message: "Message cannot be empty.",
        });

        return;
      }

      const trimmedContent = content.trim();

      if (trimmedContent.length > 1000) {
        socket.emit("chat:error", {
          message:
            "Message cannot exceed 1000 characters.",
        });

        return;
      }

      const room = await Room.findOne({
        _id: socket.data.roomId,
        roomCode: socket.data.roomCode,
        isActive: true,
      }).select("_id roomCode");

      if (!room) {
        socket.emit("chat:error", {
          message:
            "Room not found or is no longer active.",
        });

        return;
      }

      const membership =
        await RoomMember.findOne({
          room: room._id,
          user: socket.user.userId,
          status: "active",
        });

      if (!membership) {
        socket.emit("chat:error", {
          message:
            "You are not an active member of this room.",
        });

        return;
      }

      const message = await Message.create({
        room: room._id,
        sender: socket.user.userId,
        content: trimmedContent,
      });

      const populatedMessage =
        await Message.findById(message._id)
          .populate(
            "sender",
            "_id name avatar"
          )
          .lean();

      const socketRoom =
        `room:${room.roomCode}`;

      io.to(socketRoom).emit(
        "chat:message",
        populatedMessage
      );
    },
    chatSocketRateLimit,
    "You are sending messages too quickly."
  );
};

export default registerChatSocket;