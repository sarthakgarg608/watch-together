// AppLayout.jsx
// ------------------------------------------------------
// Global application layout.
//
// Every normal page will use:
// Navbar
//   ↓
// Page Content
//   ↓
// Footer
//
// Room pages can later use their own special layout.
// ------------------------------------------------------

import Navbar from "./Navbar";

function AppLayout({ children }) {
  return (
    <div className="app-layout">

      <Navbar />

      <div className="app-content">
        {children}
      </div>

      <footer className="app-footer">
        <p>
          Watch Together
        </p>
      </footer>

    </div>
  );
}

export default AppLayout;