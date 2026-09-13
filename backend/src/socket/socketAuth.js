import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

const socketAuth = async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader) {
      return next(
        new ApiError(401, "Authentication required.")
      );
    }

    const parts = authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return next(
        new ApiError(401, "Invalid authorization format.")
      );
    }

    const token = parts[1];

    let decodedToken;

    try {
      decodedToken = verifyAccessToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(
          new ApiError(401, "Access token has expired.")
        );
      }

      if (error.name === "JsonWebTokenError") {
        return next(
          new ApiError(401, "Invalid access token.")
        );
      }

      return next(error);
    }

    if (!decodedToken.userId) {
      return next(
        new ApiError(401, "Invalid access token.")
      );
    }

    const user = await User.findById(decodedToken.userId)
      .select("_id name role isEmailVerified");

    if (!user) {
      return next(
        new ApiError(401, "User no longer exists.")
      );
    }

    if (!user.isEmailVerified) {
      return next(
        new ApiError(403, "Please verify your email before continuing.")
      );
    }

    socket.user = {
      userId: user._id.toString(),
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default socketAuth;