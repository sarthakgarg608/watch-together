import { useState } from "react";

function RoomLayout({ header, video, sidebar, controls }) {
  /*
   * Desktop:
   * Sidebar stays visible.
   *
   * Mobile:
   * Sidebar starts closed so the video gets priority.
   */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#02030a] text-white">
      {header}

      <main className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Ambient room glow */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

        {/* Main video area */}
        <section className="relative flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 p-2 sm:p-4 lg:p-5">
            {video}
          </div>

          {controls}
        </section>

        {/* Desktop sidebar */}
        <aside className="hidden w-[340px] shrink-0 border-l border-white/[0.08] bg-[#070912]/90 backdrop-blur-xl lg:flex lg:flex-col">
          {sidebar}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            {/* Background overlay */}
            <button
              type="button"
              aria-label="Close room panel"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Sidebar */}
            <aside className="absolute inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/[0.08] bg-[#070912] shadow-2xl lg:hidden">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    Room panel
                  </p>

                  <p className="text-[10px] text-slate-500">
                    People & chat
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                  aria-label="Close room panel"
                >
                  ✕
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                {sidebar}
              </div>
            </aside>
          </>
        )}

        {/* Mobile room panel button */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="absolute bottom-24 right-3 z-30 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xl transition hover:border-violet-500/40 hover:bg-slate-800 sm:bottom-28 sm:right-5 sm:px-4 sm:py-3 sm:text-sm lg:hidden"
          >
            <span>☰</span>
            Room
          </button>
        )}
      </main>
    </div>
  );
}

export default RoomLayout;