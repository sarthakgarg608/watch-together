// Navbar.jsx
// ------------------------------------------------------
// Global navigation bar.
//
// Public users:
// - Home
// - Login
// - Register
//
// Authenticated users:
// - Dashboard
// - Create Room
// - Join Room
// - Logout
// ------------------------------------------------------

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <nav className="navbar">

      {/* ================= BRAND ================= */}

      <Link
        to="/"
        className="navbar-brand"
      >
        Watch Together
      </Link>

      {/* ================= NAVIGATION ================= */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/rooms/create">
              Create Room
            </Link>

            <Link to="/join">
              Join Room
            </Link>

            <span>
              {user?.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;