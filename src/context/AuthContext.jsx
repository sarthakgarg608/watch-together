// AuthContext.jsx
// ------------------------------------------------------
// Central authentication state.
//
// Current version:
// - Mock login
// - User state
// - Login / logout
// - Authentication persistence using localStorage
//
// Later:
// - Backend JWT
// - Access token
// - Refresh token
// - /me API
// ------------------------------------------------------

import { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

const STORAGE_KEY = "watch_together_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // ----------------------------------------------------
  // Restore user when application starts.
  // ----------------------------------------------------

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);

      if (!response?.success || !response?.data?.user) {
        throw new Error("Invalid login response.");
      }

      const loggedInUser = response.data.user;

      setUser(loggedInUser);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);

      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = {
    user,
    setUser,

    isAuthenticated: Boolean(user),

    isLoading,

    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
