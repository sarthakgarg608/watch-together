// AppLayout.jsx
// ------------------------------------------------------
// Global application layout.
//
// Normal pages:
// Navbar
//   ↓
// Page Content
//   ↓
// Footer
//
// Home page:
// - Uses its own premium landing-page navbar.
//
// Room pages:
// - Use their own room-specific UI.
// ------------------------------------------------------

import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  const location = useLocation();

  // Home has its own navbar.
  const isHomePage = location.pathname === "/";

  // Room pages have their own room-specific layout.
  const isRoomPage = location.pathname.startsWith("/room");

  const showNavbar = !isHomePage && !isRoomPage;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Global Navbar */}

      {showNavbar && <Navbar />}

      {/* Page Content */}

      <main className="app-content">{children}</main>

      {/* Global Footer */}

      {!isRoomPage && (
        <footer className="border-t border-white/5 bg-slate-950 px-6 py-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Watch Together. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}

export default AppLayout;
