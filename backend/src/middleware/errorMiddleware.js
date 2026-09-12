// ------------------------------------------------------
// Global Error Middleware
//
// Every unhandled application error eventually reaches
// this middleware.
// ------------------------------------------------------

import env from "../config/env.js";

function errorMiddleware(err, req, res, next) {
  console.error("API Error:", {
    message: err.message,
    method: req.method,
    path: req.originalUrl,
    stack:
      env.nodeEnv === "development"
        ? err.stack
        : undefined,
  });

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode === 500
        ? "Internal server error."
        : err.message,
    errors: err.errors || [],
  };

  // Include stack information only during development.
  if (env.nodeEnv === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorMiddleware;