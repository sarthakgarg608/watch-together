import { Router } from "express";

import authenticate from "../middleware/authMiddleware.js";
import {
  requireVerifiedEmail,
} from "../middleware/authorizationMiddleware.js";

import {
  requireRoomMember,
  requireRoomHost,
} from "./middleware/roomMiddleware.js";

import {
  createRoom,
  joinRoom,
  getRoomDetails,
  leaveRoom,
  removeParticipant,
  transferHost,
  closeRoom,
  updateRoom,
  selectMovie,
  getRoomPresence,
} from "../controllers/room.controller.js";

const router = Router();

// All room operations require:
// 1. Authentication
// 2. Verified email

router.use(authenticate);
router.use(requireVerifiedEmail);

// Create a new room
router.post("/", createRoom);

// Join an existing room
router.post("/join", joinRoom);

// Get details of a specific room
router.get("/:roomCode",requireRoomMember, getRoomDetails);

router.get(
  "/:roomCode/presence",
  requireRoomMember,
  getRoomPresence
);

router.post(
  "/:roomCode/leave",
  requireRoomMember,
  leaveRoom
);

router.post(
  "/:roomCode/remove-participant",
  requireRoomHost,
  removeParticipant
);

router.post(
  "/:roomCode/transfer-host",
  requireRoomHost,
  transferHost
);

router.post(
  "/:roomCode/close",
  requireRoomHost,
  closeRoom
);

router.patch(
  "/:roomCode",
  requireRoomHost,
  updateRoom
);

router.patch(
  "/:roomCode/movie",
  requireRoomHost,
  selectMovie
);


export default router;