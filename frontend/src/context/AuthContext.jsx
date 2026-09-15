import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Restore session when the application starts
  // --------------------------------------------------

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const response =
        await authService.refreshAccessToken();

      if (
        response.success &&
        response.data?.accessToken
      ) {
        setAccessToken(
          response.data.accessToken
        );

        if (response.data.user) {
          setUser(response.data.user);
        }
      }
    } catch {
      // No valid refresh session.
      // User simply remains logged out.
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  async function login(credentials) {
    const response =
      await authService.login(credentials);

    if (
      response.success &&
      response.data
    ) {
      setAccessToken(
        response.data.accessToken
      );

      setUser(
        response.data.user || null
      );
    }

    return response;
  }

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  // --------------------------------------------------
  // Refresh access token
  // --------------------------------------------------

  async function refreshAccessToken() {
    const response =
      await authService.refreshAccessToken();

    if (
      response.success &&
      response.data?.accessToken
    ) {
      setAccessToken(
        response.data.accessToken
      );

      if (response.data.user) {
        setUser(response.data.user);
      }

      return response.data.accessToken;
    }

    throw new Error(
      "Unable to refresh access token."
    );
  }

  // --------------------------------------------------
  // Context value
  // --------------------------------------------------

  const value = {
    user,
    accessToken,
    loading,

    isAuthenticated:
      Boolean(accessToken && user),

    login,
    logout,
    refreshAccessToken,

    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}

export {
  AuthProvider,
  useAuth,
};

