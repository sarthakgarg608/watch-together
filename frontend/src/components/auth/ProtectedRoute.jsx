// ProtectedRoute.jsx
// ------------------------------------------------------
// Protects private application routes.
//
// If user is not authenticated:
//     redirect → /login
//
// Later JWT validation will happen through AuthContext.
// ------------------------------------------------------

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;