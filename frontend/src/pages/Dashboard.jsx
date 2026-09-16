import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useRoom,
} from "../context/RoomContext";

function Dashboard() {
  const {
    user,
  } = useAuth();

  const {
    room,
    loadRoom,
  } = useRoom();

  const [
    recentRooms,
    setRecentRooms,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
   * The dashboard currently does not have a
   * dedicated "my rooms" API in the existing
   * frontend architecture.
   *
   * Therefore, we only show the current room
   * when one already exists in RoomContext.
   *
   * This keeps the UI ready for a future
   * recent-rooms endpoint without inventing
   * backend functionality.
   */
  useEffect(() => {
    if (room) {
      setRecentRooms([room]);
    } else {
      setRecentRooms([]);
    }
  }, [room]);

  const displayName =
    user?.name ||
    "there";

  const firstName =
    displayName
      .split(" ")[0];

  function getRoomParticipantCount(
    currentRoom
  ) {
    return (
      currentRoom?.participants?.length ||
      currentRoom?.members?.length ||
      0
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060b] text-white">

      {/* ========================================== */}
      {/* Background */}
      {/* ========================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/[0.08] blur-[140px]" />

        <div className="absolute -right-48 top-[30%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.06] blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[35%] h-[450px] w-[450px] rounded-full bg-fuchsia-600/[0.035] blur-[140px]" />
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* ======================================== */}
        {/* Welcome */}
        {/* ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">

          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-[80px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/[0.07] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300">
                Watch Together
              </span>
            </div>

            <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Welcome back,
              <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {firstName}.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Create a room, invite your friends, and
              enjoy your favorite movies together in
              real time.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/rooms/create"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/15 transition-all duration-200 hover:bg-violet-400 hover:shadow-violet-500/25 active:scale-[0.98]"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>

                Create a Room
              </Link>

              <Link
                to="/rooms/join"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-xs font-bold text-slate-300 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white active:scale-[0.98]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>

                Join a Room
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* Quick Actions */}
        {/* ======================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Create */}
          <Link
            to="/rooms/create"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.04]"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/[0.06] blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-violet-300">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </div>

              <h2 className="mt-4 text-sm font-bold text-white">
                Create a Room
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                Start a new watch party and invite your
                friends.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-400 transition-all duration-200 group-hover:gap-2">
                Create room
                <span>→</span>
              </span>
            </div>
          </Link>

          {/* Join */}
          <Link
            to="/rooms/join"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:bg-white/[0.04]"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/[0.06] blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
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
                  <path d="M8 12h8" />
                  <path d="m12 8 4 4-4 4" />
                  <path d="M4 5v14" />
                </svg>
              </div>

              <h2 className="mt-4 text-sm font-bold text-white">
                Join a Room
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                Enter a room code and start watching
                with others.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-400 transition-all duration-200 group-hover:gap-2">
                Join room
                <span>→</span>
              </span>
            </div>
          </Link>

          {/* How it works */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:col-span-2 lg:col-span-1">
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
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
                <path d="M12 8v4l3 2" />
              </svg>
            </div>

            <h2 className="mt-4 text-sm font-bold text-white">
              How it works
            </h2>

            <div className="mt-3 space-y-2">
              <p className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="text-emerald-400">
                  01
                </span>
                Create or join a room
              </p>

              <p className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="text-emerald-400">
                  02
                </span>
                Invite your friends
              </p>

              <p className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="text-emerald-400">
                  03
                </span>
                Watch together in sync
              </p>
            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* Current Room */}
        {/* ======================================== */}

        <section className="mt-8">

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-400">
                Your Activity
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Current Room
              </h2>
            </div>
          </div>

          {recentRooms.length > 0 ? (
            <div className="mt-4">
              {recentRooms.map(
                (
                  currentRoom
                ) => (
                  <Link
                    key={
                      currentRoom._id ||
                      currentRoom.roomCode
                    }
                    to={`/rooms/${
                      currentRoom.roomCode
                    }`}
                    className="group relative block overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-xl">
                          🎬
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-bold text-white">
                              {
                                currentRoom.name
                              }
                            </h3>

                            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[8px] tracking-widest text-slate-500">
                              {
                                currentRoom.roomCode
                              }
                            </span>
                          </div>

                          <p className="mt-1 text-[10px] text-slate-600">
                            {getRoomParticipantCount(
                              currentRoom
                            )}{" "}
                            participant
                            {getRoomParticipantCount(
                              currentRoom
                            ) === 1
                              ? ""
                              : "s"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-emerald-500/10 bg-emerald-500/[0.05] px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
                          Active
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition-all duration-200 group-hover:border-violet-500/20 group-hover:bg-violet-500/10 group-hover:text-violet-300">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-lg">
                🍿
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-300">
                No active room
              </h3>

              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-600">
                Create a room or join your friends using
                a room code to start watching together.
              </p>
            </div>
          )}
        </section>

        {/* ======================================== */}
        {/* Footer Hint */}
        {/* ======================================== */}

        <section className="mt-8 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-slate-600">
              Signed in as{" "}
              <span className="font-medium text-slate-400">
                {user?.email ||
                  "your account"}
              </span>
            </p>

            <p className="text-[10px] text-slate-700">
              Watch together. Stay connected.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;

