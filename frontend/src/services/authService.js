import { apiRequest } from "./api";

async function login(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required.");
  }

  return apiRequest("/auth/login", {
    method: "POST",
    body: {
      email: credentials.email,
      password: credentials.password,
    },
  });
}

async function register(userData) {
  if (
    !userData?.name ||
    !userData?.email ||
    !userData?.password
  ) {
    throw new Error("Name, email and password are required.");
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

/*
 * Registration email verification
 *
 * Step 1:
 * Send an OTP to the email entered during registration.
 */
async function sendRegistrationOtp(registrationData) {
  if (
    !registrationData?.name ||
    !registrationData?.email ||
    !registrationData?.password
  ) {
    throw new Error(
      "Name, email and password are required."
    );
  }

  return apiRequest("/auth/send-registration-otp", {
    method: "POST",
    body: {
      name: registrationData.name,
      email: registrationData.email,
      password: registrationData.password,
    },
  });
}

/*
 * Step 2:
 * Verify the OTP.
 *
 * The backend creates the actual User only after
 * this OTP is successfully verified.
 */
async function verifyRegistrationOtp(email, otp) {
  if (!email || !otp) {
    throw new Error("Email and OTP are required.");
  }

  return apiRequest("/auth/verify-registration-otp", {
    method: "POST",
    body: {
      email,
      otp,
    },
  });
}

async function refreshAccessToken() {
  return apiRequest("/auth/refresh", {
    method: "POST",
  });
}

async function logout() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

async function getCurrentUser(token) {
  return apiRequest("/users/me", {
    method: "GET",
    token,
  });
}

async function sendVerificationOtp(token) {
  return apiRequest("/auth/send-verification-otp", {
    method: "POST",
    token,
  });
}

async function verifyEmail(email, otp) {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: {
      email,
      otp,
    },
  });
}

async function forgotPassword(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: {
      email,
    },
  });
}

async function resetPassword(email, otp, newPassword) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: {
      email,
      otp,
      newPassword,
    },
  });
}

const authService = {
  login,
  register,

  // New registration verification flow
  sendRegistrationOtp,
  verifyRegistrationOtp,

  refreshAccessToken,
  logout,
  getCurrentUser,

  // Existing email verification flow
  sendVerificationOtp,
  verifyEmail,

  // Existing password reset flow
  forgotPassword,
  resetPassword,
};

export default authService;