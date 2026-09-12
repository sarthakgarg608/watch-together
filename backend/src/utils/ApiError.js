// ------------------------------------------------------
// Custom API Error
//
// Used for expected application errors such as:
// - Invalid input
// - Unauthorized requests
// - Resource not found
// - Forbidden actions
// ------------------------------------------------------

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong.",
    errors = []
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;