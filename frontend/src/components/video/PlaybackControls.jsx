function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

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
    Number.isFinite(duration) && duration > 0 ? duration : 0;

  const safeCurrentTime = Math.min(
    Math.max(Number(currentTime) || 0, 0),
    safeDuration || Number(currentTime) || 0
  );

  const progress =
    safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;

  const handleProgressChange = (event) => {
    onSeek?.(Number(event.target.value));
  };

  const handleSkip = (amount) => {
    const nextTime = Math.max(
      0,
      Math.min(
        safeCurrentTime + amount,
        safeDuration || Number.MAX_SAFE_INTEGER
      )
    );

    onSeek?.(nextTime);
  };

  return (
    <div className="shrink-0 border-t border-white/[0.08] bg-[#05060d]/95 px-3 py-3 backdrop-blur-xl sm:px-5">
      {/* Progress */}
      <div className="mb-3 flex items-center gap-2 sm:gap-3">
        <span className="w-10 text-right font-mono text-[10px] text-slate-500">
          {formatTime(safeCurrentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={safeDuration}
          step="0.1"
          value={safeCurrentTime}
          onChange={handleProgressChange}
          disabled={!safeDuration}
          className="h-1.5 min-w-0 flex-1 cursor-pointer accent-violet-500 disabled:cursor-not-allowed disabled:opacity-30"
          style={{
            background: `linear-gradient(to right, rgb(139 92 246) ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
          }}
          aria-label="Video progress"
        />

        <span className="w-10 font-mono text-[10px] text-slate-500">
          {formatTime(safeDuration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => handleSkip(-10)}
            disabled={!safeDuration}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
            title="Back 10 seconds"
          >
            ↶
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold shadow-lg shadow-violet-500/20 transition hover:scale-105"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(10)}
            disabled={!safeDuration}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
            title="Forward 10 seconds"
          >
            ↷
          </button>
        </div>

        {/* Sync status */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.06] px-3 py-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-[10px] font-semibold text-emerald-300">
            Ready to sync
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="hidden h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.08] hover:text-white sm:flex"
          >
            ⚙ Settings
          </button>

          <button
            type="button"
            onClick={onFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            title="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaybackControls;