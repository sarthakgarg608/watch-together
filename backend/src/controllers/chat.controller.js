import Message from "../models/Message.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getMessages = asyncHandler(async (req, res) => {
  const limit = Math.min(
    Number.parseInt(req.query.limit, 10) || 50,
    100
  );

  const before = req.query.before;

  const query = {
    room: req.room._id,
    isDeleted: false,
  };

  if (before) {
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
    .populate("sender", "_id name avatar")
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