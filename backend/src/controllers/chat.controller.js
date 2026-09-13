import Message from "../models/Message.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getMessages = asyncHandler(async (req, res) => {
  const rawLimit = req.query.limit;

  let limit = 50;

  if (rawLimit !== undefined) {
    if (
      typeof rawLimit !== "string" ||
      !/^\d+$/.test(rawLimit)
    ) {
      throw new ApiError(
        400,
        "limit must be a positive integer."
      );
    }

    limit = Number.parseInt(rawLimit, 10);

    if (limit < 1 || limit > 100) {
      throw new ApiError(
        400,
        "limit must be between 1 and 100."
      );
    }
  }

  const before = req.query.before;

  const query = {
    room: req.room._id,
    isDeleted: false,
  };

  if (before !== undefined) {
    if (
      typeof before !== "string" ||
      !before.trim()
    ) {
      throw new ApiError(
        400,
        "Invalid before timestamp."
      );
    }

    const beforeDate = new Date(before);

    if (Number.isNaN(beforeDate.getTime())) {
      throw new ApiError(
        400,
        "Invalid before timestamp."
      );
    }

    query.createdAt = {
      $lt: beforeDate,
    };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate(
      "sender",
      "_id name avatar"
    )
    .lean();

  const hasMore = messages.length === limit;

  messages.reverse();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        messages,
        hasMore,
      },
      "Messages fetched successfully."
    )
  );
});

export {
  getMessages,
};