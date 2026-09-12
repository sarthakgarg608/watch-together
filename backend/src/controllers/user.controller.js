import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password"
  );

  if (!user) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "Current user fetched successfully."
    )
  );
});

export { getCurrentUser };