import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

import CreateRoom from "../pages/rooms/CreateRoom";
import JoinRoom from "../pages/rooms/JoinRoom";
import RoomPage from "../pages/rooms/RoomPage";
import InvitePage from "../pages/rooms/InvitePage";

// --------------------------------------------------
// Loading screen
// --------------------------------------------------

function AuthLoadingScreen() {
  return (
    <div>
      <p>Loading Watch Together...</p>
    </div>
  );
}

// --------------------------------------------------
// Protected Route
// --------------------------------------------------

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}

// --------------------------------------------------
// Public-only Route
// --------------------------------------------------
// Used for login/register pages.
//
// If already logged in, don't allow the user to
// unnecessarily visit the authentication pages.

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// --------------------------------------------------
// Routes
// --------------------------------------------------
function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
}
function AppRoutes() {
  return (
    <Routes>
      {/* ------------------------------------------ */}
      {/* Public Routes */}
      {/* ------------------------------------------ */}

      <Route path="/" element={<HomeRoute />} />

      {/* ------------------------------------------ */}
      {/* Authentication Routes */}
      {/* ------------------------------------------ */}

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ------------------------------------------ */}
      {/* Protected Routes */}
      {/* ------------------------------------------ */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/create"
        element={
          <ProtectedRoute>
            <CreateRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/join"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/:roomCode"
        element={
          <ProtectedRoute>
            <RoomPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/:roomCode/invite"
        element={
          <ProtectedRoute>
            <InvitePage />
          </ProtectedRoute>
        }
      />

      {/* ------------------------------------------ */}
      {/* 404 */}
      {/* ------------------------------------------ */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
