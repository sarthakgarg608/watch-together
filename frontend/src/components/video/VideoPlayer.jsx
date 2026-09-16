import {
  useEffect,
  useRef,
  useState,
} from "react";

function VideoPlayer({
  movie,
  isPlaying,
  currentTime,
  onTimeUpdate,
  onDurationChange,
  onPlayStateChange,
  onFullscreenChange,
  registerFullscreenHandler,
}) {
  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hasError, setHasError] = useState(false);

  const videoSource = movie?.videoUrl || null;

  /*
   * Reset video state whenever the selected movie changes.
   */
  useEffect(() => {
    setHasError(false);

    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }, [videoSource]);

  /*
   * Synchronize play/pause state with the actual video.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !movie) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.warn("Video could not start:", error);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, movie, videoSource]);

  /*
   * Synchronize current playback position.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !movie) return;

    const nextTime = Number(currentTime) || 0;

    if (
      Number.isFinite(nextTime) &&
      Math.abs(video.currentTime - nextTime) > 0.5
    ) {
      video.currentTime = nextTime;
    }
  }, [currentTime, movie]);

  /*
   * Tell the parent component how to enter/exit fullscreen.
   *
   * PlaybackControls lives outside this component,
   * so the fullscreen function is exposed through the parent.
   */
  useEffect(() => {
    if (!registerFullscreenHandler) return;

    registerFullscreenHandler(async () => {
      const video = videoRef.current;

      if (!video) return;

      try {
        if (!document.fullscreenElement) {
          await video.requestFullscreen?.();
          onFullscreenChange?.(true);
        } else {
          await document.exitFullscreen?.();
          onFullscreenChange?.(false);
        }
      } catch (error) {
        console.error("Fullscreen failed:", error);
      }
    });

    return () => {
      registerFullscreenHandler(null);
    };
  }, [
    registerFullscreenHandler,
    onFullscreenChange,
  ]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setHasError(false);

    if (Number.isFinite(video.duration)) {
      onDurationChange?.(video.duration);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) return;

    onTimeUpdate?.(video.currentTime);
  };

  const handlePlay = () => {
    onPlayStateChange?.(true);
  };

  const handlePause = () => {
    onPlayStateChange?.(false);
  };

  const handleEnded = () => {
    onPlayStateChange?.(false);
    onTimeUpdate?.(0);
  };

  const handleError = () => {
    setHasError(true);
    onPlayStateChange?.(false);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        await video.requestFullscreen?.();
        onFullscreenChange?.(true);
      } else {
        await document.exitFullscreen?.();
        onFullscreenChange?.(false);
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  const handleDoubleClick = () => {
    void toggleFullscreen();
  };

  const handleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    const nextMuted = !isMuted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    const video = videoRef.current;

    if (!video) return;

    video.volume = nextVolume;

    if (nextVolume > 0) {
      video.muted = false;
      setIsMuted(false);
    }

    if (nextVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    }

    setVolume(nextVolume);
  };

  return (
    <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-2xl shadow-black/40 sm:min-h-[420px] lg:min-h-[520px]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

      {/* ------------------------------------------------ */}
      {/* No Movie Selected */}
      {/* ------------------------------------------------ */}

      {!movie && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05060d]/80 px-6 text-center backdrop-blur-sm">
          <div className="animate-[fadeIn_0.4s_ease-out]">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/15 bg-violet-500/[0.07] text-3xl shadow-2xl shadow-violet-500/10">
              ▶
            </div>

            <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Choose something to watch
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500 sm:text-sm">
              Select a movie above and everyone in the room
              will be ready to watch together.
            </p>

            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

              <span className="text-[10px] font-medium text-slate-500">
                Waiting for movie selection
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* Actual Video */}
      {/* ------------------------------------------------ */}

      {movie && (
        <>
          <video
            ref={videoRef}
            src={videoSource || undefined}
            className="relative z-10 h-full w-full object-contain"
            playsInline
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            onDoubleClick={handleDoubleClick}
          />

          {/* ------------------------------------------------ */}
          {/* Video Error */}
          {/* ------------------------------------------------ */}

          {hasError && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#05060d]/95 px-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.07] text-xl font-bold text-red-400">
                  !
                </div>

                <h3 className="text-base font-bold text-white sm:text-lg">
                  Unable to load this video
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  The selected movie does not have a playable
                  video source. Please try another movie.
                </p>
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* Movie Information */}
          {/* ------------------------------------------------ */}

          {!hasError && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-20 max-w-[65%]">
              <div className="rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                  <p className="truncate text-xs font-semibold text-white sm:text-sm">
                    {movie.title || "Now Watching"}
                  </p>
                </div>

                {movie.year && (
                  <p className="mt-1 pl-3.5 text-[10px] text-slate-400">
                    {movie.year}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* Volume */}
          {/* ------------------------------------------------ */}

          {!hasError && (
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={handleMute}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-sm shadow-lg backdrop-blur-xl transition duration-200 hover:bg-white/10 hover:scale-105"
                title={
                  isMuted
                    ? "Unmute"
                    : "Mute"
                }
                aria-label={
                  isMuted
                    ? "Unmute video"
                    : "Mute video"
                }
              >
                {isMuted
                  ? "🔇"
                  : "🔊"}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={
                  isMuted
                    ? 0
                    : volume
                }
                onChange={
                  handleVolumeChange
                }
                className="hidden w-20 cursor-pointer accent-violet-500 sm:block"
                aria-label="Volume"
              />
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* Fullscreen Hint */}
          {/* ------------------------------------------------ */}

          {!hasError && (
            <div className="pointer-events-none absolute right-4 top-4 z-20 hidden rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px] text-slate-400 shadow-lg backdrop-blur-md sm:block">
              Double-click for fullscreen
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
