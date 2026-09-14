import { Router } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const message = req.query.message;

    if (
      message &&
      (
        typeof message !== "string" ||
        message.trim().length > 100
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Message must be a string with at most 100 characters.",
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        },
        message?.trim() ||
          "Watch Together API is healthy."
      )
    );
  })
);

export default router;