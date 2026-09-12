// RoomLayout.jsx
// ------------------------------------------------------
// Main layout wrapper for the watch room.
//
// Responsibilities:
// - Cinematic room background
// - Responsive two-column layout
// - Main video/content area
// - Right-side room panel
//
// Backend-independent.
// ------------------------------------------------------

function RoomLayout({
  children,
  sidebar,
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030611] text-white">

      {/* ==================================================
          CINEMATIC BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />

        <div className="absolute right-[-15%] top-[20%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

        <div className="absolute bottom-[-20%] left-[30%] h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[150px]" />

      </div>

      {/* ==================================================
          ROOM CONTENT
      ================================================== */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] flex-col">

        {/* Main content + sidebar */}

        <div className="flex flex-1 flex-col lg:flex-row">

          {/* ==================================================
              MAIN AREA
          ================================================== */}

          <section className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6">
            {children}
          </section>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside
            className="
              flex w-full flex-col
              border-t border-white/10
              bg-white/[0.015]
              backdrop-blur-2xl
              lg:w-[370px]
              lg:border-l lg:border-t-0
            "
          >
            {sidebar}
          </aside>

        </div>

      </div>

    </main>
  );
}

export default RoomLayout;