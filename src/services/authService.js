// authService.js
// ------------------------------------------------------
// Authentication service.
//
// IMPORTANT:
// This is still a frontend mock.
//
// Later this file will contain actual API requests:
//
// POST /api/v1/auth/login
// POST /api/v1/auth/register
// POST /api/v1/auth/logout
// GET  /api/v1/auth/me
// ------------------------------------------------------

const authService = {
  async login(credentials) {
    console.log(
      "Login request:",
      credentials
    );

    if (
      !credentials?.email ||
      !credentials?.password
    ) {
      throw new Error(
        "Email and password are required."
      );
    }

    return {
      success: true,

      data: {
        user: {
          id: "user-1",
          name: "Demo User",
          email: credentials.email,
          role: "student",
        },

        // Temporary token.
        // Real JWT will come from backend.
        accessToken:
          "mock-access-token",
      },
    };
  },

  async register(userData) {
    console.log(
      "Register request:",
      userData
    );

    return {
      success: true,

      data: {
        user: userData,
      },
    };
  },

  async logout() {
    console.log("Logout request");

    return {
      success: true,
    };
  },

  async getCurrentUser() {
    return {
      success: false,
      data: null,
    };
  },
};

export default authService;