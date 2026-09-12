import ApiError from "../utils/ApiError.js";

/*
 * Allows only users with one of the specified roles.
 *
 * Example:
 * authorize("admin")
 *
 * Example:
 * authorize("user", "admin")
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(
          401,
          "Authentication required."
        )
      );
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return next(
        new ApiError(
          403,
          "You do not have permission to perform this action."
        )
      );
    }

    next();
  };
}

/*
 * Requires the user's email to be verified.
 */
function requireVerifiedEmail(
  req,
  res,
  next
) {
  if (!req.user) {
    return next(
      new ApiError(
        401,
        "Authentication required."
      )
    );
  }

  if (!req.user.isEmailVerified) {
    return next(
      new ApiError(
        403,
        "Please verify your email before continuing."
      )
    );
  }

  next();
}

export {
  authorize,
  requireVerifiedEmail,
};