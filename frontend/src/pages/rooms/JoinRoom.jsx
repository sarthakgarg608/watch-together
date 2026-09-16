import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRoom } from "../../context/RoomContext";

function JoinRoom() {
  const navigate = useNavigate();

  const {
    joinRoom,
    loading,
  } = useRoom();

  const [roomCode, setRoomCode] =
    useState("");

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const value =
      event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    setRoomCode(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (roomCode.length !== 6) {
      setError(
        "Please enter a valid 6-character room code."
      );

      return;
    }

    try {
      const room =
        await joinRoom(roomCode);

      navigate(
        `/rooms/${room.roomCode}`
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to join room."
      );
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[75vh] max-w-xl items-center justify-center">

        {/* Main card */}
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-10">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl shadow-lg shadow-cyan-500/5">
              🍿
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join a Room
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
              Enter the room code shared by your
              friend and join the watch party.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300"
            >
              <span className="mt-0.5">
                ⚠
              </span>

              <p>{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Room code */}
            <div>
              <label
                htmlFor="roomCode"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Room Code
              </label>

              <input
                id="roomCode"
                name="roomCode"
                type="text"
                value={roomCode}
                onChange={handleChange}
                placeholder="ABC123"
                maxLength={6}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-center text-xl font-bold tracking-[0.35em] text-white uppercase outline-none transition duration-200 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
              />

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Enter the 6-character code
                  shared by your friend.
                </p>

                <span className="text-xs font-medium text-slate-600">
                  {roomCode.length}/6
                </span>
              </div>
            </div>

            {/* Code preview */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7h3a3 3 0 013 3v4a3 3 0 01-3 3h-3"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17H6a3 3 0 01-3-3v-4a3 3 0 013-3h3"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h8"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Have a room code?
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    You're just one step away.
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex h-10 w-9 items-center justify-center rounded-lg border text-sm font-bold transition duration-200 sm:h-11 sm:w-10 ${
                      roomCode[index]
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/[0.03] text-slate-700"
                    }`}
                  >
                    {roomCode[index] || "•"}
                  </div>
                ))}
              </div>
            </div>

            {/* Join button */}
            <button
              type="submit"
              disabled={
                loading ||
                roomCode.length !== 6
              }
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition duration-200 hover:bg-slate-200 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>

                  Joining Room...
                </>
              ) : (
                <>
                  Join Room

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m13 6 6 6-6 6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Create room alternative */}
          <div className="mt-7 border-t border-white/5 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have a room code?
            </p>

            <Link
              to="/rooms/create"
              className="mt-2 inline-flex text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Create your own room
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default JoinRoom;

