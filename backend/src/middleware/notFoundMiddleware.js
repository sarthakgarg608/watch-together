// ------------------------------------------------------
// 404 Route Middleware
//
// Runs when no registered route matches the request.
// ------------------------------------------------------

import ApiError from "../utils/ApiError.js";

function notFoundMiddleware(req, res, next) {
  next(
    new ApiError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
}

export default notFoundMiddleware;