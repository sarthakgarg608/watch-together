import Room from "../models/Room.js";
import RoomMember from "../models/RoomMember.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getRoomFromParams = async (roomCode) => {
  if (!roomCode || typeof roomCode !== "string") {
    throw new ApiError(400, "Room code is required.");
  }

  const normalizedRoomCode = roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedRoomCode)) {
    throw new ApiError(400, "Invalid room code.");
  }

  const room = await Room.findOne({
    roomCode: normalizedRoomCode,
    isActive: true,
  });

  if (!room) {
    throw new ApiError(
      404,
      "Room not found or is no longer active."
    );
  }

  return room;
};

const requireRoomMember = asyncHandler(async (req, res, next) => {
  const room = await getRoomFromParams(req.params.roomCode);

  const membership = await RoomMember.findOne({
    room: room._id,
    user: req.user.userId,
    status: "active",
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not an active member of this room."
    );
  }

  req.room = room;
  req.roomMembership = membership;

  next();
});

const requireRoomHost = asyncHandler(async (req, res, next) => {
  const room = await getRoomFromParams(req.params.roomCode);

  if (room.host.toString() !== req.user.userId) {
    throw new ApiError(
      403,
      "Only the room host can perform this action."
    );
  }

  const membership = await RoomMember.findOne({
    room: room._id,
    user: req.user.userId,
    status: "active",
  });

  if (!membership || membership.role !== "host") {
    throw new ApiError(
      403,
      "You are not the active host of this room."
    );
  }

  req.room = room;
  req.roomMembership = membership;

  next();
});

export {
  requireRoomMember,
  requireRoomHost,
};