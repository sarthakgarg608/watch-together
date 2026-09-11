// Home.jsx
// ------------------------------------------------------
// Main landing page for Watch Together.
//
// Styling:
// - Tailwind CSS
// - Dark cinematic theme
// - Glassmorphism
// - Gradients
// - Responsive layout
// - Entrance animations
// ------------------------------------------------------

import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-[-180px] h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" />

        <div className="absolute right-[-120px] top-1/3 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[120px]" />

        <div className="absolute bottom-[-180px] left-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_45%)]" />
      </div>

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        {/* Logo */}

        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20 transition duration-300 group-hover:scale-105 group-hover:shadow-violet-500/40">
            <span className="text-lg">▶</span>
          </div>

          <span className="text-lg font-bold tracking-tight sm:text-xl">
            Watch
            <span className="text-violet-400">Together</span>
          </span>
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition duration-300 hover:bg-white/5 hover:text-white sm:px-4"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:border-violet-400/30 hover:bg-violet-500/10 sm:px-5"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl items-center px-5 pb-20 pt-12 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* LEFT SIDE */}

          <div className="animate-fade-up">
            {/* Small badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300 backdrop-blur-md sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Watch together. Wherever you are.
            </div>

            {/* Heading */}

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Movies are better
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                together.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Create a private watch room, invite your friends, and enjoy movies
              together with synchronized playback and real-time chat.
            </p>

            {/* CTA */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-900/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-500/30 sm:px-7"
              >
                <span className="relative z-10">Get Started</span>

                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition duration-300 hover:border-white/20 hover:bg-white/10 sm:px-7"
              >
                I already have an account
              </Link>
            </div>

            {/* Trust text */}

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Private rooms
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Synchronized playback
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Real-time chat
              </span>
            </div>
          </div>

          {/* RIGHT SIDE — WATCH ROOM PREVIEW */}

          <div className="relative animate-scale-in">
            {/* Glow */}

            <div className="absolute -inset-5 rounded-[2rem] bg-violet-600/10 blur-3xl" />

            {/* Browser / room window */}

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
              {/* Window header */}

              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>

                <div className="rounded-md bg-white/5 px-3 py-1 text-[10px] text-slate-500">
                  watch-together.app
                </div>

                <div className="w-10" />
              </div>

              {/* Video area */}

              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-800 via-violet-950/50 to-slate-950">
                {/* Fake movie scene */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,rgba(168,85,247,0.45),transparent_25%),radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.25),transparent_30%)]" />

                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Play button */}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white/20">
                    <span className="ml-1 text-xl">▶</span>
                  </div>
                </div>

                {/* Movie title */}

                <div className="absolute bottom-4 left-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-300">
                    Now Watching
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    The Watch Party
                  </p>
                </div>
              </div>

              {/* Room controls */}

              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-violet-500 text-[9px] font-bold">
                      S
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-500 text-[9px] font-bold">
                      A
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-pink-500 text-[9px] font-bold">
                      R
                    </div>
                  </div>

                  <span className="text-xs text-slate-500">
                    3 friends watching
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live
                </div>
              </div>
            </div>

            {/* Floating chat card */}

            <div className="absolute -bottom-7 -left-5 hidden w-48 rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl sm:block">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500 text-[9px] font-bold">
                  A
                </div>

                <span className="text-[10px] font-semibold text-slate-300">
                  Alex
                </span>
              </div>

              <p className="text-[11px] text-slate-400">This scene is 🔥</p>
            </div>

            {/* Floating invite card */}

            <div className="absolute -right-4 -top-5 hidden rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                Room Code
              </p>

              <p className="mt-1 text-sm font-bold tracking-[0.25em] text-violet-300">
                W7K9Q
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FEATURE STRIP
      ================================================== */}

      <section className="relative z-10 border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-px sm:grid-cols-3">
          <Feature
            icon="▶"
            title="Synchronized Playback"
            description="Everyone watches the same moment together."
          />

          <Feature
            icon="💬"
            title="Real-Time Chat"
            description="Talk, react and share the experience."
          />

          <Feature
            icon="👥"
            title="Invite Friends"
            description="Create a room and bring your friends in."
          />
        </div>
      </section>
    </main>
  );
}

// ======================================================
// FEATURE COMPONENT
// ======================================================

function Feature({ icon, title, description }) {
  return (
    <div className="group border-white/5 px-6 py-8 transition duration-300 hover:bg-white/[0.03] sm:border-r last:border-r-0">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-300 transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/20">
        {icon}
      </div>

      <h2 className="text-sm font-bold text-white">{title}</h2>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export default Home;
