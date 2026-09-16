import {
  Link,
} from "react-router-dom";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060b] text-white">

      {/* ========================================== */}
      {/* Background */}
      {/* ========================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[140px]" />

        <div className="absolute -left-48 top-[35%] h-[450px] w-[450px] rounded-full bg-indigo-600/[0.06] blur-[130px]" />

        <div className="absolute -right-48 top-[55%] h-[450px] w-[450px] rounded-full bg-fuchsia-600/[0.05] blur-[130px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize:
              "60px 60px",
          }}
        />
      </div>

      {/* ========================================== */}
      {/* Navigation */}
      {/* ========================================== */}

      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-base shadow-lg shadow-violet-500/5 transition-transform duration-200 group-hover:scale-105">
            🎬
          </div>

          <span className="text-sm font-black tracking-tight text-white sm:text-base">
            Watch
            <span className="text-violet-400">
              Together
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-xl px-3.5 py-2 text-[11px] font-semibold text-slate-400 transition-colors duration-200 hover:text-white sm:px-4"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-[11px] font-bold text-violet-300 transition-all duration-200 hover:border-violet-400/30 hover:bg-violet-500/15 hover:text-violet-200 sm:px-4"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ========================================== */}
      {/* Hero */}
      {/* ========================================== */}

      <main className="relative z-10">

        <section className="mx-auto flex min-h-[calc(100vh-78px)] w-full max-w-7xl items-center justify-center px-5 pb-20 pt-10 sm:px-6 sm:pt-16 lg:px-8">

          <div className="w-full text-center">

            {/* Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 shadow-xl backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Watch together, wherever you are
              </span>
            </div>

            {/* Heading */}
            <h1 className="mx-auto mt-7 max-w-5xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Movies are better
              <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                together.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7 lg:text-lg">
              Create a private watch room, invite your
              friends, and watch movies in sync with
              real-time playback, chat, and presence.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-violet-500/20 transition-all duration-200 hover:bg-violet-400 hover:shadow-violet-500/30 active:scale-[0.98]"
              >
                Start Watching
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-6 py-3.5 text-xs font-bold text-slate-300 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white active:scale-[0.98]"
              >
                I already have an account
              </Link>
            </div>

            {/* ==================================== */}
            {/* Product Preview */}
            {/* ==================================== */}

            <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">

              {/* Glow behind preview */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[100px]" />

              <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#090a11] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:p-3">

                {/* Browser top bar */}
                <div className="flex h-8 items-center gap-1.5 px-2 sm:h-9">
                  <span className="h-2 w-2 rounded-full bg-red-400/50" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/50" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/50" />

                  <div className="mx-auto hidden h-5 w-1/3 rounded-md border border-white/[0.04] bg-white/[0.02] sm:block" />
                </div>

                {/* App preview */}
                <div className="grid min-h-[270px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#05060b] sm:min-h-[390px] sm:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px]">

                  {/* Video */}
                  <div className="flex min-w-0 flex-col">
                    <div className="relative flex min-h-[210px] flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#11121c] via-[#080910] to-[#0a0911] sm:min-h-0">

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_45%)]" />

                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-2xl sm:h-16 sm:w-16">
                        <span className="ml-0.5 text-xl">
                          ▶
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                          <div className="h-full w-[38%] rounded-full bg-violet-500" />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-slate-500">
                            24:18
                          </span>

                          <span className="text-[8px] text-slate-600">
                            1:42:36
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex h-12 items-center gap-3 border-t border-white/[0.06] px-3 sm:h-14 sm:px-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-[9px]">
                        ▶
                      </div>

                      <span className="text-[8px] text-slate-600">
                        10s
                      </span>

                      <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.05] px-2 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[7px] font-semibold text-emerald-300">
                          Synced
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Preview */}
                  <div className="hidden border-l border-white/[0.06] bg-white/[0.015] sm:flex sm:flex-col">

                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-white">
                          Room Chat
                        </span>

                        <span className="flex items-center gap-1 text-[7px] text-emerald-400">
                          <span className="h-1 w-1 rounded-full bg-emerald-400" />
                          Live
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 p-3">
                      <div className="flex gap-2">
                        <div className="h-5 w-5 shrink-0 rounded-full bg-violet-500/15" />

                        <div>
                          <span className="text-[7px] text-violet-300">
                            Alex
                          </span>

                          <div className="mt-1 rounded-lg rounded-tl-sm bg-white/[0.04] px-2 py-1.5">
                            <p className="text-[7px] text-slate-400">
                              This scene is so good 😂
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="rounded-lg rounded-br-sm bg-violet-500 px-2.5 py-1.5">
                          <p className="text-[7px] text-white">
                            I know right!
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="h-5 w-5 shrink-0 rounded-full bg-indigo-500/15" />

                        <div>
                          <span className="text-[7px] text-indigo-300">
                            Sam
                          </span>

                          <div className="mt-1 rounded-lg rounded-tl-sm bg-white/[0.04] px-2 py-1.5">
                            <p className="text-[7px] text-slate-400">
                              Don't pause 😭
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="m-2 h-7 rounded-lg border border-white/[0.06] bg-white/[0.02]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* Features */}
        {/* ========================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-400">
              Built for shared moments
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Everything you need to watch together
            </h2>

            <p className="mt-3 text-xs leading-6 text-slate-600 sm:text-sm">
              A simple watch-party experience focused on
              staying in sync and staying connected.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.04]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-violet-300">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />
                  <path d="M12 8v4l3 2" />
                </svg>
              </div>

              <h3 className="mt-5 text-sm font-bold text-white">
                Stay in sync
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Play, pause, and seek together with
                real-time playback synchronization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:bg-white/[0.04]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/15 bg-indigo-500/10 text-indigo-300">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle
                    cx="10"
                    cy="7"
                    r="4"
                  />
                  <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <h3 className="mt-5 text-sm font-bold text-white">
                Invite your friends
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Share a room code or invitation and bring
                your group into the same watch party.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-white/[0.04]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-300">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  <path d="M8 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M16 10h.01" />
                </svg>
              </div>

              <h3 className="mt-5 text-sm font-bold text-white">
                Chat in real time
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                React to scenes, talk with your friends,
                and keep the conversation inside the room.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* Final CTA */}
        {/* ========================================== */}

        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-violet-500/10 bg-violet-500/[0.035] px-6 py-12 text-center sm:px-10 sm:py-16">

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.08] blur-[90px]" />

            <div className="relative">
              <span className="text-2xl">
                🍿
              </span>

              <h2 className="mx-auto mt-4 max-w-xl text-2xl font-black tracking-tight text-white sm:text-3xl">
                Your next movie night starts here.
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-xs leading-6 text-slate-600 sm:text-sm">
                Create your room, invite your friends,
                and make distance feel a little smaller.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-violet-500/20 transition-all duration-200 hover:bg-violet-400 hover:shadow-violet-500/30 active:scale-[0.98]"
              >
                Create Your Room
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* Footer */}
        {/* ========================================== */}

        <footer className="border-t border-white/[0.05]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
            <p className="text-[10px] text-slate-700">
              © {new Date().getFullYear()} Watch Together
            </p>

            <p className="text-[10px] text-slate-700">
              Watch together. Stay connected.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default Home;

