// Navbar.jsx
// ------------------------------------------------------
// Global navigation bar.
//
// Features:
// - Responsive desktop/mobile navigation
// - Authentication-aware links
// - Glassmorphism
// - Animated hover states
// - User profile indicator
// ------------------------------------------------------

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = async () => {
    await logout();

    setIsMenuOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  // --------------------------------------------------
  // Active navigation item
  // --------------------------------------------------

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-white/[0.06]
        bg-[#040611]/75
        backdrop-blur-2xl
      "
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="group flex items-center gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <span
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-gradient-to-br
              from-violet-500
              to-fuchsia-600
              text-sm font-black
              shadow-lg
              shadow-violet-900/20
              transition-transform duration-300
              group-hover:scale-105
            "
          >
            ▶
          </span>

          <span className="hidden text-base font-black tracking-tight sm:block">
            Watch
            <span className="text-violet-400">Together</span>
          </span>
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <div className="hidden items-center gap-1 md:flex">
          {/* Home is only available to unauthenticated users */}
          {!isAuthenticated && (
            <NavLink to="/" label="Home" active={isActive("/")} />
          )}

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                label="Dashboard"
                active={isActive("/dashboard")}
              />

              <NavLink
                to="/rooms/create"
                label="Create Room"
                active={isActive("/rooms/create")}
              />

              <NavLink
                to="/rooms/join"
                label="Join Room"
                active={isActive("/rooms/join")}
              />
            </>
          )}
        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div
                className="
                  flex items-center gap-2
                  rounded-full
                  border border-white/10
                  bg-white/[0.035]
                  px-3 py-1.5
                "
              >
                <span
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-fuchsia-500
                    text-[10px]
                    font-black
                  "
                >
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>

                <span className="max-w-[100px] truncate text-xs font-semibold text-slate-300">
                  {user?.name || "User"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-xl
                  px-3 py-2
                  text-xs font-semibold
                  text-slate-500
                  transition-all duration-200
                  hover:bg-red-500/10
                  hover:text-red-300
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="
                  rounded-xl
                  px-3 py-2
                  text-sm font-semibold
                  text-slate-400
                  transition-colors
                  hover:text-white
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  px-4 py-2.5
                  text-xs font-bold
                  shadow-lg
                  shadow-violet-900/20
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-white/10
            bg-white/[0.035]
            text-slate-300
            transition-all
            hover:bg-white/[0.08]
            md:hidden
          "
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      <div
        className={`
          overflow-hidden border-t border-white/[0.06]
          bg-[#040611]/95
          backdrop-blur-2xl
          transition-all duration-300
          md:hidden
          ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="space-y-1 px-4 py-4">
          {/* Home is only available to unauthenticated users */}
          {!isAuthenticated && (
            <MobileNavLink
              to="/"
              label="Home"
              active={isActive("/")}
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {isAuthenticated && (
            <>
              <MobileNavLink
                to="/dashboard"
                label="Dashboard"
                active={isActive("/dashboard")}
                onClick={() => setIsMenuOpen(false)}
              />

              <MobileNavLink
                to="/rooms/create"
                label="Create Room"
                active={isActive("/rooms/create")}
                onClick={() => setIsMenuOpen(false)}
              />

              <MobileNavLink
                to="/rooms/join"
                label="Join Room"
                active={isActive("/rooms/join")}
                onClick={() => setIsMenuOpen(false)}
              />

              <button
                type="button"
                onClick={handleLogout}
                className="
                  mt-3 w-full
                  rounded-xl
                  border border-red-400/10
                  bg-red-500/[0.04]
                  px-4 py-3
                  text-left text-sm
                  font-semibold
                  text-red-300
                "
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="
                  rounded-xl
                  border border-white/10
                  px-4 py-3
                  text-center
                  text-sm font-semibold
                  text-slate-300
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  px-4 py-3
                  text-center
                  text-sm font-bold
                "
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ------------------------------------------------------
// Desktop nav item
// ------------------------------------------------------

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`
        relative rounded-xl
        px-3 py-2
        text-xs font-semibold
        transition-all duration-200
        ${
          active
            ? "bg-white/[0.07] text-white"
            : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
        }
      `}
    >
      {label}

      {active && (
        <span
          className="
            absolute bottom-0
            left-1/2
            h-0.5 w-5
            -translate-x-1/2
            rounded-full
            bg-violet-400
          "
        />
      )}
    </Link>
  );
}

// ------------------------------------------------------
// Mobile nav item
// ------------------------------------------------------

function MobileNavLink({ to, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        block rounded-xl
        px-4 py-3
        text-sm font-semibold
        transition-all
        ${
          active
            ? "bg-violet-500/10 text-violet-300"
            : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
        }
      `}
    >
      {label}
    </Link>
  );
}

export default Navbar;
