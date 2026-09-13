import Room from "../models/Room.js";
import RoomMember from "../models/RoomMember.js";

import {
  addPresence,
  removePresence,
  getRoomPresence,
} from "../services/presence.service.js";

const registerRoomSocket = (io, socket) => {
  socket.on(
  "room:join",
  async (payload = {}) => {
    try {
      const { roomCode } = payload;

      if (
        typeof roomCode !== "string" ||
        !roomCode.trim()
      ) {
        socket.emit("room:error", {
          message:
            "Room code is required.",
        });

        return;
      }

      const normalizedRoomCode =
        roomCode.trim().toUpperCase();

      if (
        !/^[A-Z0-9]{6}$/.test(
          normalizedRoomCode
        )
      ) {
        socket.emit("room:error", {
          message:
            "Invalid room code.",
        });

        return;
      }

      const room = await Room.findOne({
        roomCode: normalizedRoomCode,
        isActive: true,
      }).select(
        "_id roomCode"
      );

      if (!room) {
        socket.emit("room:error", {
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
        socket.emit("room:error", {
          message:
            "You are not an active member of this room.",
        });

        return;
      }

      /*
       * Already connected to this room.
       */
      if (
        socket.data.roomCode ===
        room.roomCode
      ) {
        socket.emit("room:error", {
          message:
            "You are already connected to this room.",
        });

        return;
      }

      /*
       * Leave previous socket room first.
       */
      if (socket.data.roomCode) {
        leaveSocketRoom(io, socket);
      }

      const socketRoom =
        `room:${room.roomCode}`;

      socket.join(socketRoom);

      socket.data.roomCode =
        room.roomCode;

      socket.data.roomId =
        room._id.toString();

      addPresence(
        room.roomCode,
        socket.user.userId
      );

      const presence =
        getRoomPresence(
          room.roomCode
        );

      socket.emit(
        "room:joined",
        {
          roomCode:
            room.roomCode,

          user: {
            userId:
              socket.user.userId,

            name:
              socket.user.name,
          },

          presence,
        }
      );

      socket.to(socketRoom).emit(
        "room:user-joined",
        {
          user: {
            userId:
              socket.user.userId,

            name:
              socket.user.name,
          },

          presence,
        }
      );
    } catch (error) {
      console.error(
        "Socket room join error:",
        error
      );

      socket.emit("room:error", {
        message:
          "Unable to join room.",
      });
    }
  }
);

  socket.on("room:leave", () => {
    leaveSocketRoom(io, socket);
  });

  socket.on("disconnect", () => {
    leaveSocketRoom(io, socket);
  });
};

const leaveSocketRoom = (io, socket) => {
  const roomCode = socket.data.roomCode;

  if (!roomCode) {
    return;
  }

  const socketRoom = `room:${roomCode}`;

  const userActuallyLeft =
    removePresence(
      roomCode,
      socket.user.userId
    );

  socket.leave(socketRoom);

  socket.data.roomCode = null;
  socket.data.roomId = null;

  /*
    If the user still has another socket connection
    open in the same room, don't announce them as offline.
  */
  if (!userActuallyLeft) {
    return;
  }

  const presence = getRoomPresence(roomCode);

  io.to(socketRoom).emit(
    "room:user-left",
    {
      user: {
        userId: socket.user.userId,
        name: socket.user.name,
      },
      presence,
    }
  );
};

export default registerRoomSocket;