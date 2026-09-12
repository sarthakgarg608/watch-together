import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authenticate = asyncHandler(
  async (req, res, next) => {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(
        401,
        "Authentication required."
      );
    }

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      throw new ApiError(
        401,
        "Invalid authorization format."
      );
    }

    const token = parts[1];

    let decodedToken;

    try {
      decodedToken =
        verifyAccessToken(token);
    } catch (error) {
      if (
        error.name === "TokenExpiredError"
      ) {
        throw new ApiError(
          401,
          "Access token has expired."
        );
      }

      if (
        error.name === "JsonWebTokenError"
      ) {
        throw new ApiError(
          401,
          "Invalid access token."
        );
      }

      throw error;
    }

    if (!decodedToken.userId) {
      throw new ApiError(
        401,
        "Invalid access token."
      );
    }

    /*
     * We verify that the user still exists.
     *
     * This is important because a valid JWT can still
     * exist even after the corresponding user is deleted.
     */
    const user =
      await User.findById(
        decodedToken.userId
      ).select(
        "_id role isEmailVerified"
      );

    if (!user) {
      throw new ApiError(
        401,
        "User no longer exists."
      );
    }

    /*
     * Store only the information required by
     * protected routes.
     */
    req.user = {
      userId: user._id.toString(),
      role: user.role,
      isEmailVerified:
        user.isEmailVerified,
    };

    next();
  }
);

export default authenticate;