// PublicRoute.jsx
// ------------------------------------------------------
// Prevents authenticated users from unnecessarily
// opening login/register pages.
//
// Example:
// Logged-in user → /login
//              → /dashboard
// ------------------------------------------------------

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function PublicRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default PublicRoute;