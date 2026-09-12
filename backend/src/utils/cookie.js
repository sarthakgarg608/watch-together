const refreshTokenCookieName =
  "watch_together_refresh_token";

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth",
};

export {
  refreshTokenCookieName,
  refreshTokenCookieOptions,
};