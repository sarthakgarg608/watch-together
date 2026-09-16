import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useRoom,
} from "../../context/RoomContext";

import MovieSelector from "../../components/room/MovieSelector";
import VideoPlayer from "../../components/video/VideoPlayer";
import PlaybackControls from "../../components/video/PlaybackControls";
import ChatPanel from "../../components/chat/ChatPanel";

function RoomPage() {
  const {
    roomCode,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    accessToken,
  } = useAuth();

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
    presence,
    loadRoom,
    leaveRoom,
    playVideo,
    pauseVideo,
    seekVideo,
  } = useRoom();

  const [
    error,
    setError,
  ] = useState("");

  const [
    duration,
    setDuration,
  ] = useState(0);

  const fullscreenHandlerRef =
    useRef(null);

  const isRemoteUpdateRef =
    useRef(false);

  // --------------------------------------------------
  // Load Room
  // --------------------------------------------------

  useEffect(() => {
    if (
      roomCode &&
      accessToken
    ) {
      loadRoom(
        roomCode,
        accessToken
      ).catch((error) => {
        setError(
          error.message ||
            "Unable to load room."
        );
      });
    }
  }, [
    roomCode,
    accessToken,
    loadRoom,
  ]);

  // --------------------------------------------------
  // Leave Room
  // --------------------------------------------------

  async function handleLeaveRoom() {
    try {
      await leaveRoom();
      navigate(
        "/dashboard",
        { replace: true }
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to leave room."
      );
    }
  }

  // --------------------------------------------------
  // Playback Controls
  // --------------------------------------------------

  function handlePlayPause() {
    if (!selectedMovie) {
      return;
    }

    if (
      playbackState?.isPlaying
    ) {
      pauseVideo(
        playbackState.currentPosition
      );
    } else {
      playVideo(
        playbackState?.currentPosition ||
          0
      );
    }
  }

  function handleSeek(
    position
  ) {
    if (!selectedMovie) {
      return;
    }

    seekVideo(position);
  }

  // --------------------------------------------------
  // Video Events
  // --------------------------------------------------

  function handleTimeUpdate() {
    /*
     * Local time updates intentionally do not emit
     * socket events on every video frame.
     *
     * Playback synchronization is handled through
     * explicit play / pause / seek events.
     */
  }

  function handlePlayStateChange(
    isPlaying
  ) {
    if (
      isRemoteUpdateRef.current
    ) {
      return;
    }

    /*
     * VideoPlayer reports local browser state.
     * The authoritative room state is managed by
     * RoomContext / Socket.IO.
     */
  }

  function handleDurationChange(
    value
  ) {
    setDuration(
      Number(value) || 0
    );
  }

  function registerFullscreenHandler(
    handler
  ) {
    fullscreenHandlerRef.current =
      handler;
  }

  function handleFullscreen() {
    fullscreenHandlerRef.current?.();
  }

  // --------------------------------------------------
  // Error State
  // --------------------------------------------------

  const roomError =
    error ||
    playbackError ||
    connectionError;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (
    loading &&
    !room
  ) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060b] px-6">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
          </div>

          <h2 className="mt-5 text-sm font-bold text-white">
            Joining room...
          </h2>

          <p className="mt-1.5 text-xs text-slate-500">
            Preparing your watch party
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Room Error
  // --------------------------------------------------

  if (
    !room &&
    roomError
  ) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060b] px-6">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.06] text-xl">
            !
          </div>

          <h2 className="mt-5 text-lg font-bold text-white">
            Unable to open room
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {roomError}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="mt-6 rounded-xl bg-violet-500 px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-violet-400 active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Participant Helpers
  // --------------------------------------------------

  function isParticipantOnline(
    participant
  ) {
    const participantId =
      participant.user?._id ||
      participant.user?.userId ||
      participant.userId ||
      participant._id;

    if (
      !Array.isArray(
        presence
      )
    ) {
      return false;
    }

    return presence.some(
      (onlineUser) => {
        const onlineUserId =
          onlineUser.userId ||
          onlineUser._id ||
          onlineUser.user?._id;

        return (
          String(
            onlineUserId
          ) ===
          String(
            participantId
          )
        );
      }
    );
  }

  function getParticipantName(
    participant
  ) {
    return (
      participant.user?.name ||
      participant.name ||
      "User"
    );
  }

  function getParticipantId(
    participant
  ) {
    return (
      participant.user?._id ||
      participant.user?.userId ||
      participant.userId ||
      participant._id
    );
  }

  function getInitial(
    name
  ) {
    return (
      name
        ?.charAt(0)
        .toUpperCase() ||
      "U"
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060b] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/[0.07] blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-600/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1800px] px-3 py-3 sm:px-5 sm:py-5 lg:px-7">

        {/* ========================================== */}
        {/* Room Header */}
        {/* ========================================== */}

        <header className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 shadow-xl backdrop-blur-xl sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-lg">
                🎬
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-sm font-bold text-white sm:text-base">
                    {room?.name ||
                      "Watch Room"}
                  </h1>

                  <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] font-semibold tracking-widest text-slate-400">
                    {room?.roomCode ||
                      roomCode}
                  </span>
                </div>

                {room?.description && (
                  <p className="mt-1 max-w-xl truncate text-[10px] text-slate-600 sm:text-xs">
                    {room.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">

              {/* Socket status */}
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                  isConnected
                    ? "border-emerald-500/10 bg-emerald-500/[0.05]"
                    : "border-amber-500/10 bg-amber-500/[0.05]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isConnected
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                      : "animate-pulse bg-amber-400"
                  }`}
                />

                <span
                  className={`hidden text-[9px] font-semibold sm:block ${
                    isConnected
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }`}
                >
                  {isConnected
                    ? "Connected"
                    : "Connecting"}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleLeaveRoom
                }
                className="rounded-xl border border-red-500/10 bg-red-500/[0.04] px-3 py-2 text-[10px] font-semibold text-red-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.08] hover:text-red-300 active:scale-95"
              >
                Leave
              </button>
            </div>
          </div>
        </header>

        {/* ========================================== */}
        {/* Main Room Grid */}
        {/* ========================================== */}

        <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">

          {/* ======================================== */}
          {/* Left Content */}
          {/* ======================================== */}

          <section className="min-w-0 space-y-4">

            {/* Movie Selector */}
            <MovieSelector />

            {/* Video Card */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-2xl">

              <div className="relative">
                <VideoPlayer
                  movie={
                    selectedMovie
                  }
                  playbackState={
                    playbackState
                  }
                  onTimeUpdate={
                    handleTimeUpdate
                  }
                  onPlayStateChange={
                    handlePlayStateChange
                  }
                  onDurationChange={
                    handleDurationChange
                  }
                  registerFullscreenHandler={
                    registerFullscreenHandler
                  }
                />
              </div>

              {/* Playback Controls */}
              <div className="border-t border-white/[0.06] bg-black/20">
                <PlaybackControls
                  isPlaying={
                    playbackState?.isPlaying
                  }
                  currentTime={
                    playbackState?.currentPosition ||
                    0
                  }
                  duration={
                    duration
                  }
                  onPlayPause={
                    handlePlayPause
                  }
                  onSeek={
                    handleSeek
                  }
                  onFullscreen={
                    handleFullscreen
                  }
                />
              </div>
            </section>

            {/* ====================================== */}
            {/* Participants */}
            {/* ====================================== */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 shadow-xl sm:p-5">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Watching Together
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    People currently in this room
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1">
                  <span className="text-[10px] font-bold text-slate-300">
                    {participants?.length ||
                      0}
                  </span>

                  <span className="text-[9px] text-slate-600">
                    members
                  </span>
                </div>
              </div>

              {participants?.length ? (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {participants.map(
                    (
                      participant
                    ) => {
                      const name =
                        getParticipantName(
                          participant
                        );

                      const participantId =
                        getParticipantId(
                          participant
                        );

                      const online =
                        isParticipantOnline(
                          participant
                        );

                      const isHost =
                        String(
                          participant.role
                        ).toLowerCase() ===
                        "host";

                      return (
                        <div
                          key={
                            participantId
                          }
                          className="group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
                        >
                          <div className="relative shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/10 bg-violet-500/[0.08] text-[10px] font-bold text-violet-300">
                              {getInitial(
                                name
                              )}
                            </div>

                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#090a10] ${
                                online
                                  ? "bg-emerald-400"
                                  : "bg-slate-700"
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold text-slate-300">
                              {name}
                            </p>

                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span
                                className={`text-[8px] ${
                                  online
                                    ? "text-emerald-400"
                                    : "text-slate-600"
                                }`}
                              >
                                {online
                                  ? "Online"
                                  : "Offline"}
                              </span>

                              {isHost && (
                                <>
                                  <span className="text-slate-700">
                                    ·
                                  </span>

                                  <span className="text-[8px] text-violet-400">
                                    Host
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/[0.07] py-8 text-center">
                  <p className="text-[10px] text-slate-600">
                    No participants found.
                  </p>
                </div>
              )}
            </section>
          </section>

          {/* ======================================== */}
          {/* Chat */}
          {/* ======================================== */}

          <aside className="min-w-0 xl:sticky xl:top-5 xl:h-[calc(100vh-40px)]">
            <div className="h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-2xl">
              <ChatPanel />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default RoomPage;

