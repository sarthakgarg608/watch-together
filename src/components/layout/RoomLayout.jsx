// RoomLayout.jsx
// ------------------------------------------------------
// Special layout for watch rooms.
//
// Room pages have a different structure from normal
// application pages because the video player is the
// primary content.
//
// Current structure:
//
// Room Header
//      ↓
// Main Watch Area
//      ↓
// Sidebar
//
// Styling will be added later with Tailwind.
// ------------------------------------------------------

function RoomLayout({
  header,
  children,
  sidebar,
}) {
  return (
    <div className="room-layout">

      {/* ================= HEADER ================= */}

      <div className="room-layout-header">
        {header}
      </div>

      {/* ================= CONTENT ================= */}

      <div className="room-layout-content">

        <main className="room-layout-main">
          {children}
        </main>

        <aside className="room-layout-sidebar">
          {sidebar}
        </aside>

      </div>

    </div>
  );
}

export default RoomLayout;