// authService.js
// ------------------------------------------------------
// Authentication API service.
//
// This file communicates directly with the backend.
// It does NOT store the access token itself.
//
// Access token:
// - Returned by login / refresh
// - Stored by AuthContext
//
// Refresh token:
// - Stored by backend as an HttpOnly cookie
// - Automatically sent using credentials: "include"
// ------------------------------------------------------

import { apiRequest } from "./api";

// ------------------------------------------------------
// Login
// ------------------------------------------------------

async function login(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error(
      "Email and password are required."
    );
  }

  return apiRequest("/auth/login", {
    method: "POST",

    body: {
      email: credentials.email,
      password: credentials.password,
    },
  });
}

// ------------------------------------------------------
// Register
// ------------------------------------------------------

async function register(userData) {
  if (
    !userData?.name ||
    !userData?.email ||
    !userData?.password
  ) {
    throw new Error(
      "Name, email and password are required."
    );
  }

  return apiRequest("/auth/register", {
    method: "POST",

    body: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    },
  });
}

// ------------------------------------------------------
// Refresh access token
// ------------------------------------------------------
// Backend reads the refresh token from the HttpOnly
// cookie automatically.

async function refreshAccessToken() {
  return apiRequest("/auth/refresh", {
    method: "POST",
  });
}

// ------------------------------------------------------
// Logout
// ------------------------------------------------------

async function logout() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

// ------------------------------------------------------
// Get current user
// ------------------------------------------------------
//
// Your current backend does not have a dedicated
// /auth/me endpoint.
//
// We will add/use the appropriate authenticated
// user endpoint when we integrate the profile flow.
//
// For now this function is intentionally not used.
// ------------------------------------------------------

async function getCurrentUser(token) {
  return apiRequest("/users/me", {
    method: "GET",
    token,
  });
}

// ------------------------------------------------------
// Email verification
// ------------------------------------------------------

async function sendVerificationOtp(token) {
  return apiRequest(
    "/auth/send-verification-otp",
    {
      method: "POST",
      token,
    }
  );
}

async function verifyEmail(email, otp) {
  return apiRequest(
    "/auth/verify-email",
    {
      method: "POST",

      body: {
        email,
        otp,
      },
    }
  );
}

// ------------------------------------------------------
// Password reset
// ------------------------------------------------------

async function forgotPassword(email) {
  return apiRequest(
    "/auth/forgot-password",
    {
      method: "POST",

      body: {
        email,
      },
    }
  );
}

async function resetPassword(
  email,
  otp,
  newPassword
) {
  return apiRequest(
    "/auth/reset-password",
    {
      method: "POST",

      body: {
        email,
        otp,
        newPassword,
      },
    }
  );
}

const authService = {
  login,
  register,
  refreshAccessToken,
  logout,
  getCurrentUser,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

export default authService;