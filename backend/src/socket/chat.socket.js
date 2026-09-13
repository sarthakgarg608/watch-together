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
    async (payload = {}) => {
      /*
       * User must be connected to a room.
       */
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

      /*
       * Validate payload.
       */
      if (
        !payload ||
        typeof payload.content !== "string"
      ) {
        socket.emit("chat:error", {
          message:
            "Message content must be a string.",
        });

        return;
      }

      const trimmedContent =
        payload.content.trim();

      if (!trimmedContent) {
        socket.emit("chat:error", {
          message:
            "Message cannot be empty.",
        });

        return;
      }

      if (trimmedContent.length > 1000) {
        socket.emit("chat:error", {
          message:
            "Message cannot exceed 1000 characters.",
        });

        return;
      }

      /*
       * Verify room is still active.
       */
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

      /*
       * Verify active membership.
       *
       * Socket presence alone is NOT enough.
       */
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

      /*
       * Save message.
       */
      const message = await Message.create({
        room: room._id,
        sender: socket.user.userId,
        content: trimmedContent,
        messageType: "text",
      });

      /*
       * Populate sender before broadcasting.
       */
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