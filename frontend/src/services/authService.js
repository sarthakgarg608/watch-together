import { apiRequest } from "./api";

async function login(credentials) {
  if (
    !credentials?.email ||
    !credentials?.password
  ) {
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

/*
 * Registration
 *
 * This function is kept temporarily for compatibility.
 * The current Register.jsx uses the OTP registration
 * functions below instead.
 */
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

/*
 * Registration OTP
 *
 * Step 1:
 * Send an OTP to the email entered during registration.
 */
async function sendRegistrationOtp(
  registrationData
) {
  if (
    !registrationData?.name ||
    !registrationData?.email ||
    !registrationData?.password
  ) {
    throw new Error(
      "Name, email and password are required."
    );
  }

  return apiRequest(
    "/auth/send-registration-otp",
    {
      method: "POST",
      body: {
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password,
      },
    }
  );
}

/*
 * Registration OTP
 *
 * Step 2:
 * Verify the registration OTP.
 *
 * The backend creates the actual User only
 * after this OTP is successfully verified.
 */
async function verifyRegistrationOtp(
  email,
  otp
) {
  if (!email || !otp) {
    throw new Error(
      "Email and OTP are required."
    );
  }

  return apiRequest(
    "/auth/verify-registration-otp",
    {
      method: "POST",
      body: {
        email,
        otp,
      },
    }
  );
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

/*
 * Existing email verification flow.
 */
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
  if (!email || !otp) {
    throw new Error(
      "Email and OTP are required."
    );
  }

  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: {
      email,
      otp,
    },
  });
}

/*
 * Password reset
 *
 * Step 1:
 * User enters their email and requests
 * a password-reset OTP.
 */
async function forgotPassword(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

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

/*
 * Password reset
 *
 * Step 2:
 * Verify the OTP.
 *
 * The backend returns a short-lived
 * password-reset token after successful
 * verification.
 */
async function verifyResetOtp(
  email,
  otp
) {
  if (!email || !otp) {
    throw new Error(
      "Email and OTP are required."
    );
  }

  return apiRequest(
    "/auth/verify-reset-otp",
    {
      method: "POST",
      body: {
        email,
        otp,
      },
    }
  );
}

/*
 * Password reset
 *
 * Step 3:
 * Change the password using the temporary
 * password-reset token returned after OTP
 * verification.
 */
async function resetPassword(
  resetToken,
  newPassword
) {
  if (!resetToken) {
    throw new Error(
      "Password reset token is required."
    );
  }

  if (!newPassword) {
    throw new Error(
      "New password is required."
    );
  }

  return apiRequest(
    "/auth/reset-password",
    {
      method: "POST",
      body: {
        resetToken,
        newPassword,
      },
    }
  );
}

const authService = {
  login,

  /*
   * Registration
   */
  register,
  sendRegistrationOtp,
  verifyRegistrationOtp,

  /*
   * Session management
   */
  refreshAccessToken,
  logout,
  getCurrentUser,

  /*
   * Email verification
   */
  sendVerificationOtp,
  verifyEmail,

  /*
   * Password reset
   */
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};

export default authService;

