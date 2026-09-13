import { Router } from "express";

import authenticate from "../middleware/authMiddleware.js";
import {
  requireVerifiedEmail,
} from "../middleware/authorizationMiddleware.js";

import {
  requireRoomMember,
} from "../middleware/roomMiddleware.js";

import {
  getMessages,
} from "../controllers/chat.controller.js";

const router = Router();

router.use(authenticate);
router.use(requireVerifiedEmail);

router.get(
  "/:roomCode/messages",
  requireRoomMember,
  getMessages
);

export default router;