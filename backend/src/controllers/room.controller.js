import mongoose from "mongoose";
import Room from "../models/Room.js";
import RoomMember from "../models/RoomMember.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateRoomCode from "../utils/RoomCode.js";

const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    description = "",
    maxParticipants = 5,
    accessType = "private",
  } = req.body;

  if (!name) {
    throw new ApiError(400, "Room name is required.");
  }

  if (typeof name !== "string") {
    throw new ApiError(400, "Room name must be a string.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    throw new ApiError(
      400,
      "Room name must be between 2 and 100 characters."
    );
  }

  if (typeof description !== "string") {
    throw new ApiError(400, "Description must be a string.");
  }

  const trimmedDescription = description.trim();

  if (trimmedDescription.length > 500) {
    throw new ApiError(
      400,
      "Description cannot exceed 500 characters."
    );
  }

  const parsedMaxParticipants = Number(maxParticipants);

  if (
    !Number.isInteger(parsedMaxParticipants) ||
    parsedMaxParticipants < 2 ||
    parsedMaxParticipants > 10
  ) {
    throw new ApiError(
      400,
      "Maximum participants must be an integer between 2 and 10."
    );
  }

  if (!["public", "private"].includes(accessType)) {
    throw new ApiError(
      400,
      "Access type must be either public or private."
    );
  }

  const session = await mongoose.startSession();

  try {
    let room;

    await session.withTransaction(async () => {
      let roomCode;
      let existingRoom;

      do {
        roomCode = generateRoomCode();

        existingRoom = await Room.exists({
          roomCode,
        }).session(session);
      } while (existingRoom);

      const createdRooms = await Room.create(
        [
          {
            roomCode,
            name: trimmedName,
            description: trimmedDescription,
            createdBy: req.user.userId,
            host: req.user.userId,
            maxParticipants: parsedMaxParticipants,
            currentParticipants: 1,
            accessType,
          },
        ],
        { session }
      );

      room = createdRooms[0];

      await RoomMember.create(
        [
          {
            room: room._id,
            user: req.user.userId,
            role: "host",
            status: "active",
          },
        ],
        { session }
      );
    });

    const roomData = {
      id: room._id,
      roomCode: room.roomCode,
      name: room.name,
      description: room.description,
      host: room.host,
      maxParticipants: room.maxParticipants,
      currentParticipants: room.currentParticipants,
      accessType: room.accessType,
      isActive: room.isActive,
      selectedMovie: room.selectedMovie,
      createdAt: room.createdAt,
    };

    res.status(201).json(
      new ApiResponse(
        201,
        roomData,
        "Room created successfully."
      )
    );
  } finally {
    await session.endSession();
  }
});
const joinRoom = asyncHandler(async (req, res) => {
  const { roomCode } = req.body;

  if (!roomCode) {
    throw new ApiError(400, "Room code is required.");
  }

  if (typeof roomCode !== "string") {
    throw new ApiError(400, "Room code must be a string.");
  }

  const normalizedRoomCode = roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(normalizedRoomCode)) {
    throw new ApiError(400, "Invalid room code.");
  }

  const session = await mongoose.startSession();

  try {
    let room;
    let membership;

    await session.withTransaction(async () => {
      room = await Room.findOne({
        roomCode: normalizedRoomCode,
        isActive: true,
      }).session(session);

      if (!room) {
        throw new ApiError(
          404,
          "Room not found or is no longer active."
        );
      }

      const existingMembership = await RoomMember.findOne({
        room: room._id,
        user: req.user.userId,
      }).session(session);

      if (existingMembership?.status === "active") {
        throw new ApiError(
          409,
          "You are already a member of this room."
        );
      }

      /*
       * Atomically reserve one participant slot.
       *
       * This prevents two simultaneous join requests
       * from exceeding maxParticipants.
       */
      const updatedRoom = await Room.findOneAndUpdate(
        {
          _id: room._id,
          isActive: true,
          $expr: {
            $lt: [
              "$currentParticipants",
              "$maxParticipants",
            ],
          },
        },
        {
          $inc: {
            currentParticipants: 1,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedRoom) {
        throw new ApiError(
          409,
          "This room is full."
        );
      }

      room = updatedRoom;

      if (existingMembership) {
        existingMembership.status = "active";
        existingMembership.joinedAt = new Date();
        existingMembership.leftAt = null;

        membership = await existingMembership.save({
          session,
        });
      } else {
        const createdMemberships = await RoomMember.create(
          [
            {
              room: room._id,
              user: req.user.userId,
              role: "member",
              status: "active",
            },
          ],
          { session }
        );

        membership = createdMemberships[0];
      }
    });

    const roomData = {
      id: room._id,
      roomCode: room.roomCode,
      name: room.name,
      description: room.description,
      host: room.host,
      maxParticipants: room.maxParticipants,
      currentParticipants: room.currentParticipants,
      accessType: room.accessType,
      isActive: room.isActive,
      selectedMovie: room.selectedMovie,

      membership: {
        id: membership._id,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt,
      },
    };

    res.status(200).json(
      new ApiResponse(
        200,
        roomData,
        "Joined room successfully."
      )
    );
  } finally {
    await session.endSession();
  }
});

const getRoomDetails = asyncHandler(async (req, res) => {
  const room = req.room;
  const membership = req.roomMembership;

  const activeMembers = await RoomMember.find({
    room: room._id,
    status: "active",
  })
    .populate("user", "_id name email avatar")
    .sort({ joinedAt: 1 });

  const participants = activeMembers.map((member) => ({
    membershipId: member._id,
    user: member.user,
    role: member.role,
    status: member.status,
    joinedAt: member.joinedAt,
  }));

  await room.populate([
    {
      path: "host",
      select: "_id name email avatar",
    },
    {
      path: "createdBy",
      select: "_id name email avatar",
    },
  ]);

  const roomData = {
    id: room._id,
    roomCode: room.roomCode,
    name: room.name,
    description: room.description,
    createdBy: room.createdBy,
    host: room.host,
    maxParticipants: room.maxParticipants,
    accessType: room.accessType,
    isActive: room.isActive,
    selectedMovie: room.selectedMovie,

    membership: {
      id: membership._id,
      role: membership.role,
      status: membership.status,
      joinedAt: membership.joinedAt,
    },

    participants,
    participantCount: participants.length,

    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      roomData,
      "Room details fetched successfully."
    )
  );
});

const leaveRoom = asyncHandler(async (req, res) => {
  const room = req.room;
  const membership = req.roomMembership;

  /*
   * Normal member leaving.
   */
  if (membership.role !== "host") {
    membership.status = "left";
    membership.leftAt = new Date();

    await membership.save();

    await Room.updateOne(
      {
        _id: room._id,
        currentParticipants: { $gt: 0 },
      },
      {
        $inc: {
          currentParticipants: -1,
        },
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          roomCode: room.roomCode,
          roomActive: room.isActive,
          membership: {
            id: membership._id,
            status: membership.status,
            leftAt: membership.leftAt,
          },
        },
        "You left the room successfully."
      )
    );
  }

  /*
   * Host is leaving.
   */
  const nextHost = await RoomMember.findOne({
    room: room._id,
    status: "active",
    _id: { $ne: membership._id },
  }).sort({ joinedAt: 1 });

  /*
   * Host was the only participant.
   */
  if (!nextHost) {
    membership.status = "left";
    membership.leftAt = new Date();

    await membership.save();

    room.isActive = false;
    room.currentParticipants = 0;

    await room.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          roomCode: room.roomCode,
          roomActive: false,
          membership: {
            id: membership._id,
            status: membership.status,
            leftAt: membership.leftAt,
          },
        },
        "You left the room and the room has been closed."
      )
    );
  }

  /*
   * Transfer host to the earliest active member.
   */
  membership.status = "left";
  membership.leftAt = new Date();
  membership.role = "member";

  await membership.save();

  nextHost.role = "host";
  await nextHost.save();

  room.host = nextHost.user;

  if (room.currentParticipants > 0) {
    room.currentParticipants -= 1;
  }

  await room.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        roomCode: room.roomCode,
        roomActive: true,
        previousHost: req.user.userId,
        newHost: nextHost.user,
        membership: {
          id: membership._id,
          status: membership.status,
          leftAt: membership.leftAt,
        },
      },
      "You left the room and host ownership was transferred."
    )
  );
});

const removeParticipant = asyncHandler(async (req, res) => {
  const room = req.room;
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  if (userId === req.user.userId) {
    throw new ApiError(
      400,
      "Host cannot remove themselves."
    );
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const membership = await RoomMember.findOne({
        room: room._id,
        user: userId,
        status: "active",
      }).session(session);

      if (!membership) {
        throw new ApiError(
          404,
          "Active participant not found in this room."
        );
      }

      membership.status = "left";
      membership.leftAt = new Date();

      await membership.save({
        session,
      });

      const updatedRoom = await Room.findOneAndUpdate(
        {
          _id: room._id,
          currentParticipants: {
            $gt: 0,
          },
        },
        {
          $inc: {
            currentParticipants: -1,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedRoom) {
        throw new ApiError(
          409,
          "Unable to update room participant count."
        );
      }
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          roomCode: room.roomCode,
          removedUserId: userId,
        },
        "Participant removed successfully."
      )
    );
  } finally {
    await session.endSession();
  }
});

const transferHost = asyncHandler(async (req, res) => {
  const room = req.room;
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  if (userId === req.user.userId) {
    throw new ApiError(
      400,
      "You are already the host."
    );
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const newHostMembership = await RoomMember.findOne({
        room: room._id,
        user: userId,
        status: "active",
      }).session(session);

      if (!newHostMembership) {
        throw new ApiError(
          404,
          "The selected user is not an active participant."
        );
      }

      const currentHostMembership = await RoomMember.findOne({
        room: room._id,
        user: req.user.userId,
        status: "active",
        role: "host",
      }).session(session);

      if (!currentHostMembership) {
        throw new ApiError(
          403,
          "Current host membership was not found."
        );
      }

      currentHostMembership.role = "member";

      await currentHostMembership.save({
        session,
      });

      newHostMembership.role = "host";

      await newHostMembership.save({
        session,
      });

      await Room.updateOne(
        {
          _id: room._id,
          isActive: true,
          host: req.user.userId,
        },
        {
          $set: {
            host: userId,
          },
        },
        {
          session,
        }
      );
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          roomCode: room.roomCode,
          previousHost: req.user.userId,
          newHost: userId,
        },
        "Host ownership transferred successfully."
      )
    );
  } finally {
    await session.endSession();
  }
});

const closeRoom = asyncHandler(async (req, res) => {
  const room = req.room;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const updatedRoom = await Room.findOneAndUpdate(
        {
          _id: room._id,
          isActive: true,
        },
        {
          $set: {
            isActive: false,
            currentParticipants: 0,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedRoom) {
        throw new ApiError(
          404,
          "Room not found or is already closed."
        );
      }

      await RoomMember.updateMany(
        {
          room: room._id,
          status: "active",
        },
        {
          $set: {
            status: "left",
            leftAt: new Date(),
          },
        },
        {
          session,
        }
      );
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          roomCode: room.roomCode,
          isActive: false,
          currentParticipants: 0,
        },
        "Room closed successfully."
      )
    );
  } finally {
    await session.endSession();
  }
});

const updateRoom = asyncHandler(async (req, res) => {
  const room = req.room;

  const {
    name,
    description,
    maxParticipants,
    accessType,
  } = req.body;

  const updates = {};

  if (name !== undefined) {
    if (typeof name !== "string") {
      throw new ApiError(400, "Room name must be a string.");
    }

    const trimmedName = name.trim();

    if (
      trimmedName.length < 2 ||
      trimmedName.length > 100
    ) {
      throw new ApiError(
        400,
        "Room name must be between 2 and 100 characters."
      );
    }

    updates.name = trimmedName;
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new ApiError(
        400,
        "Description must be a string."
      );
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length > 500) {
      throw new ApiError(
        400,
        "Description cannot exceed 500 characters."
      );
    }

    updates.description = trimmedDescription;
  }

  if (maxParticipants !== undefined) {
    const parsedMaxParticipants = Number(maxParticipants);

    if (
      !Number.isInteger(parsedMaxParticipants) ||
      parsedMaxParticipants < 2 ||
      parsedMaxParticipants > 10
    ) {
      throw new ApiError(
        400,
        "Maximum participants must be an integer between 2 and 10."
      );
    }

    const activeParticipants = await RoomMember.countDocuments({
      room: room._id,
      status: "active",
    });

    if (parsedMaxParticipants < activeParticipants) {
      throw new ApiError(
        400,
        `Maximum participants cannot be lower than the current participant count of ${activeParticipants}.`
      );
    }

    updates.maxParticipants = parsedMaxParticipants;
  }

  if (accessType !== undefined) {
    if (!["public", "private"].includes(accessType)) {
      throw new ApiError(
        400,
        "Access type must be either public or private."
      );
    }

    updates.accessType = accessType;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(
      400,
      "No valid room changes were provided."
    );
  }

  Object.assign(room, updates);

  await room.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: room._id,
        roomCode: room.roomCode,
        name: room.name,
        description: room.description,
        host: room.host,
        maxParticipants: room.maxParticipants,
        accessType: room.accessType,
        isActive: room.isActive,
        selectedMovie: room.selectedMovie,
        updatedAt: room.updatedAt,
      },
      "Room updated successfully."
    )
  );
});

const selectMovie = asyncHandler(async (req, res) => {
  const room = req.room;

  const {
    movieId,
    title,
    posterUrl = null,
    videoUrl = null,
  } = req.body;

  if (!movieId) {
    throw new ApiError(400, "Movie ID is required.");
  }

  if (typeof movieId !== "string") {
    throw new ApiError(
      400,
      "Movie ID must be a string."
    );
  }

  if (!title) {
    throw new ApiError(400, "Movie title is required.");
  }

  if (typeof title !== "string") {
    throw new ApiError(
      400,
      "Movie title must be a string."
    );
  }

  const trimmedMovieId = movieId.trim();
  const trimmedTitle = title.trim();

  if (
    trimmedMovieId.length < 1 ||
    trimmedMovieId.length > 100
  ) {
    throw new ApiError(
      400,
      "Movie ID is invalid."
    );
  }

  if (
    trimmedTitle.length < 1 ||
    trimmedTitle.length > 200
  ) {
    throw new ApiError(
      400,
      "Movie title must be between 1 and 200 characters."
    );
  }

  if (
    posterUrl !== null &&
    typeof posterUrl !== "string"
  ) {
    throw new ApiError(
      400,
      "Poster URL must be a string or null."
    );
  }

  if (
    videoUrl !== null &&
    typeof videoUrl !== "string"
  ) {
    throw new ApiError(
      400,
      "Video URL must be a string or null."
    );
  }

  room.selectedMovie = {
    movieId: trimmedMovieId,
    title: trimmedTitle,
    posterUrl: posterUrl?.trim() || null,
    videoUrl: videoUrl?.trim() || null,
  };

  await room.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        roomCode: room.roomCode,
        selectedMovie: room.selectedMovie,
      },
      "Movie selected successfully."
    )
  );
});
export {
  createRoom,
  joinRoom,
  getRoomDetails,
  leaveRoom,
  selectMovie,
  updateRoom,
  transferHost,
  removeParticipant,
  closeRoom,
};
  
