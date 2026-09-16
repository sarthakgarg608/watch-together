function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );
  const remainingSeconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onFullscreen,
}) {
  const safeDuration =
    Number.isFinite(duration) && duration > 0
      ? duration
      : 0;

  const safeCurrentTime = Math.min(
    Math.max(Number(currentTime) || 0, 0),
    safeDuration || Number(currentTime) || 0
  );

  const progress =
    safeDuration > 0
      ? Math.min(
          (safeCurrentTime / safeDuration) * 100,
          100
        )
      : 0;

  const handleProgressChange = (
    event
  ) => {
    onSeek?.(
      Number(event.target.value)
    );
  };

  const handleSkip = (amount) => {
    const nextTime = Math.max(
      0,
      Math.min(
        safeCurrentTime + amount,
        safeDuration ||
          Number.MAX_SAFE_INTEGER
      )
    );

    onSeek?.(nextTime);
  };

  return (
    <div className="shrink-0 border-t border-white/[0.08] bg-[#05060d]/95 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4">
      {/* ------------------------------------------ */}
      {/* Progress */}
      {/* ------------------------------------------ */}

      <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
        <span className="w-10 shrink-0 text-right font-mono text-[10px] font-medium tabular-nums text-slate-500 sm:w-12 sm:text-[11px]">
          {formatTime(
            safeCurrentTime
          )}
        </span>

        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            type="range"
            min="0"
            max={safeDuration}
            step="0.1"
            value={safeCurrentTime}
            onChange={
              handleProgressChange
            }
            disabled={!safeDuration}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-violet-500 disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              background: `linear-gradient(to right, rgb(139 92 246) ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
            }}
            aria-label="Video progress"
          />
        </div>

        <span className="w-10 shrink-0 font-mono text-[10px] font-medium tabular-nums text-slate-500 sm:w-12 sm:text-[11px]">
          {formatTime(
            safeDuration
          )}
        </span>
      </div>

      {/* ------------------------------------------ */}
      {/* Main Controls */}
      {/* ------------------------------------------ */}

      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Back 10 */}
          <button
            type="button"
            onClick={() =>
              handleSkip(-10)
            }
            disabled={!safeDuration}
            className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
            title="Back 10 seconds"
            aria-label="Back 10 seconds"
          >
            <span className="relative text-[13px] font-semibold transition-transform duration-200 group-hover:-translate-x-0.5">
              ↶
            </span>

            <span className="sr-only">
              10 seconds
            </span>
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={onPlayPause}
            className="group flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-105 hover:shadow-violet-500/30 active:scale-95 sm:h-12 sm:w-12"
            title={
              isPlaying
                ? "Pause"
                : "Play"
            }
            aria-label={
              isPlaying
                ? "Pause video"
                : "Play video"
            }
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {isPlaying
                ? "Ⅱ"
                : "▶"}
            </span>
          </button>

          {/* Forward 10 */}
          <button
            type="button"
            onClick={() =>
              handleSkip(10)
            }
            disabled={!safeDuration}
            className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
            title="Forward 10 seconds"
            aria-label="Forward 10 seconds"
          >
            <span className="relative text-[13px] font-semibold transition-transform duration-200 group-hover:translate-x-0.5">
              ↷
            </span>

            <span className="sr-only">
              10 seconds
            </span>
          </button>
        </div>

        {/* Center sync status */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.05] px-3 py-1.5 md:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[10px] font-semibold text-emerald-300">
            Synced
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Settings */}
          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold text-slate-400 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white sm:flex"
            title="Player settings"
            aria-label="Player settings"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4V19a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1A2 2 0 0 1 2.9 14.7l.1-.1A2 2 0 0 0 1.6 11H1.5a2 2 0 0 1 0-4h.1A2 2 0 0 0 3 3.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A2 2 0 0 0 9.2 0h.2a2 2 0 0 1 4 0v.1a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0 1.4 3.4h.1a2 2 0 0 1 0 4H21a2 2 0 0 0-1.6 3.3Z"
              />
            </svg>

            Settings
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={onFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white sm:h-10 sm:w-10"
            title="Fullscreen"
            aria-label="Enter fullscreen"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v3" />
              <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaybackControls;

