import { Router } from "express";

import authenticate from "../middleware/authMiddleware.js";
import { requireVerifiedEmail } from "../middleware/authorizationMiddleware.js";
import {
  getPlaybackState,
  updatePlaybackState,
} from "../controllers/playback.controller.js";
import {
  requireRoomMember,
  requireRoomHost,
} from "../middleware/roomMiddleware.js";

const router = Router();

router.use(authenticate);
router.use(requireVerifiedEmail);

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