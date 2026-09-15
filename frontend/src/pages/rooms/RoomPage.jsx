import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useRoom } from "../../context/RoomContext";

import { useAuth } from "../../context/AuthContext";

import VideoPlayer from "../../components/video/VideoPlayer";
import PlaybackControls from "../../components/video/PlaybackControls";
import ChatPanel from "../../components/chat/ChatPanel";
import MovieSelector from "../../components/room/MovieSelector";

function RoomPage() {
  const { roomCode } = useParams();

  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const {
    room,
    selectedMovie,
    participants,

    playbackState,
    playbackError,

    loading,

    isConnected,
    connectionError,
    roomJoined,

    loadRoom,
    leaveRoom,

    playVideo,
    pauseVideo,
    seekVideo,
  } = useRoom();

  const [error, setError] = useState("");

  const [duration, setDuration] = useState(0);

  /*
   * Fullscreen handler is exposed by VideoPlayer
   * and consumed by PlaybackControls.
   */
  const fullscreenHandlerRef = useRef(null);

  /*
   * Used to distinguish:
   *
   * 1. Local user interaction
   * 2. Remote Socket.IO synchronization
   *
   * This prevents video events from creating
   * unnecessary playback loops.
   */
  const isRemoteUpdateRef = useRef(false);

  // --------------------------------------------------
  // Load Room
  // --------------------------------------------------

  useEffect(() => {
    if (!roomCode || !accessToken) {
      return;
    }

    async function loadRoomData() {
      try {
        setError("");

        await loadRoom(roomCode);
      } catch (error) {
        setError(error.message || "Unable to load this room.");
      }
    }

    loadRoomData();
  }, [roomCode, accessToken]);

  // --------------------------------------------------
  // Leave Room
  // --------------------------------------------------

  async function handleLeaveRoom() {
    try {
      await leaveRoom();

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Unable to leave the room.");
    }
  }

  // --------------------------------------------------
  // Play / Pause
  // --------------------------------------------------

  function handlePlayPause() {
    /*
     * Only the host is allowed to control
     * playback on the backend.
     *
     * The backend will reject non-host users.
     */
    if (!room || !selectedMovie) {
      return;
    }

    const currentPosition = playbackState.currentPosition || 0;

    if (playbackState.isPlaying) {
      pauseVideo(currentPosition);
    } else {
      playVideo(currentPosition);
    }
  }

  // --------------------------------------------------
  // Seek
  // --------------------------------------------------

  function handleSeek(nextPosition) {
    if (!room || !selectedMovie) {
      return;
    }

    seekVideo(nextPosition, playbackState.isPlaying);
  }

  // --------------------------------------------------
  // Video Time Update
  // --------------------------------------------------

  function handleTimeUpdate(currentTime) {
    /*
     * We intentionally do NOT send every
     * timeupdate event through Socket.IO.
     *
     * HTML video can generate many timeupdate
     * events per second.
     *
     * Playback synchronization happens only
     * on play / pause / seek.
     */
    if (!Number.isFinite(currentTime)) {
      return;
    }
  }

  // --------------------------------------------------
  // Video Play State Change
  // --------------------------------------------------

  function handlePlayStateChange(isPlaying) {
    /*
     * When playback changes because of a remote
     * Socket.IO update, don't emit another event.
     */
    if (isRemoteUpdateRef.current) {
      return;
    }

    /*
     * We intentionally don't emit from here.
     *
     * PlaybackControls is the source of explicit
     * host playback commands.
     */
    void isPlaying;
  }

  // --------------------------------------------------
  // Fullscreen
  // --------------------------------------------------

  function handleFullscreen() {
    fullscreenHandlerRef.current?.();
  }

  // --------------------------------------------------
  // Register Fullscreen Handler
  // --------------------------------------------------

  function registerFullscreenHandler(handler) {
    fullscreenHandlerRef.current = handler;
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading && !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05060d] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

          <p className="text-sm text-slate-400">Loading room...</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error && !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05060d] px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">Unable to open room</h1>

          <p className="mt-3 text-sm text-slate-400">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!room) {
    return null;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#05060d] px-3 py-4 text-white sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* ---------------------------------------- */}
        {/* Room Header */}
        {/* ---------------------------------------- */}

        <header className="mb-4 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold sm:text-2xl">
                {room.name}
              </h1>

              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-violet-300">
                {room.roomCode}
              </span>
            </div>

            {room.description && (
              <p className="mt-1 text-sm text-slate-500">{room.description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLeaveRoom}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
          >
            Leave Room
          </button>
        </header>

        {/* ---------------------------------------- */}
        {/* Connection Status */}
        {/* ---------------------------------------- */}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />

            <span className="text-xs text-slate-400">
              {isConnected
                ? roomJoined
                  ? "Live"
                  : "Connected"
                : "Connecting..."}
            </span>
          </div>

          {connectionError && (
            <span className="text-xs text-amber-400">{connectionError}</span>
          )}

          {playbackError && (
            <span className="text-xs text-red-400">{playbackError}</span>
          )}
        </div>
        {/* Movie Selector */}
        <MovieSelector />

        {/* ---------------------------------------- */}
        {/* Main Room Layout */}
        {/* ---------------------------------------- */}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* -------------------------------------- */}
          {/* Video Area */}
          {/* -------------------------------------- */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            {/* Movie Title */}
            <div className="border-b border-white/[0.08] px-4 py-3 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Now Watching
                  </p>

                  <h2 className="mt-1 truncate text-base font-bold text-white sm:text-lg">
                    {selectedMovie?.title || "No movie selected"}
                  </h2>
                </div>

                {selectedMovie && (
                  <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-slate-500 sm:block">
                    Synchronized playback
                  </span>
                )}
              </div>
            </div>

            {/* Video */}
            <VideoPlayer
              movie={selectedMovie}
              isPlaying={playbackState.isPlaying}
              currentTime={playbackState.currentPosition}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={setDuration}
              onPlayStateChange={handlePlayStateChange}
              registerFullscreenHandler={registerFullscreenHandler}
            />

            {/* Controls */}
            <PlaybackControls
              isPlaying={playbackState.isPlaying}
              currentTime={playbackState.currentPosition}
              duration={duration}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onFullscreen={handleFullscreen}
            />
          </section>

          {/* -------------------------------------- */}
          {/* Sidebar */}
          {/* -------------------------------------- */}

          <aside className="flex min-h-0 flex-col gap-4">
            {/* Participants */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">Participants</h2>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {participants.length} member
                    {participants.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                  {Array.isArray(participants) ? participants.length : 0}
                </span>
              </div>

              <div className="space-y-2">
                {participants.map((participant) => {
                  const participantUser = participant.user || participant;

                  const participantId =
                    participantUser._id || participantUser.userId;

                  const participantName = participantUser.name || "User";

                  const isOnline = presence.some(
                    (onlineUser) => onlineUser.userId === String(participantId),
                  );

                  return (
                    <div
                      key={participantId}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                    >
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 text-xs font-bold text-violet-200">
                        {participantName.charAt(0).toUpperCase()}

                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0c14] ${
                            isOnline ? "bg-emerald-400" : "bg-slate-600"
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-200">
                          {participantName}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {participant.role === "host"
                            ? "Host"
                            : isOnline
                              ? "Online"
                              : "Offline"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Chat */}
            <section className="min-h-[420px] flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">
              <ChatPanel />
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default RoomPage;
