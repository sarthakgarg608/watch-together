import { Router } from "express";

import {
  getPlaybackState,
  updatePlaybackState,
} from "../controllers/playback.controller.js";

import {
  requireRoomMember,
  requireRoomHost,
} from "../middleware/roomMiddleware.js";

const router = Router();

router.get(
  "/:roomCode",
  requireRoomMember,
  getPlaybackState
);

router.patch(
  "/:roomCode",
  requireRoomHost,
  updatePlaybackState
);

export default router;