// AppRoutes.jsx
// ------------------------------------------------------
// Application routing.
//
// BrowserRouter is handled by App.jsx.
// This file only handles routes.
// ------------------------------------------------------

import {
  Route,
  Routes,
} from "react-router-dom";

import PublicRoute from "../components/auth/PublicRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/Dashboard";

import CreateRoom from "../pages/rooms/CreateRoom";
import JoinRoom from "../pages/rooms/JoinRoom";
import RoomPage from "../pages/rooms/RoomPage";
import InvitePage from "../pages/rooms/InvitePage";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* ================= AUTHENTICATION ================= */}

      <Route element={<PublicRoute />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

      </Route>

      {/* ================= PROTECTED ================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/rooms/create"
          element={<CreateRoom />}
        />

        <Route
          path="/join"
          element={<JoinRoom />}
        />

        <Route
          path="/rooms/:roomCode"
          element={<RoomPage />}
        />

        <Route
          path="/join/:roomCode"
          element={<InvitePage />}
        />

      </Route>

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;