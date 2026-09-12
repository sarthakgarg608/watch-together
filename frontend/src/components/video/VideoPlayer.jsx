import { useEffect, useRef, useState } from "react";

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

  const videoSource =
    movie?.videoUrl ||
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

  /*
   * Synchronize play/pause state with the actual video.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.warn("Video could not start:", error);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoSource]);

  /*
   * Synchronize current playback position.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  /*
   * Tell the parent component how to enter fullscreen.
   *
   * PlaybackControls lives outside this component,
   * so we expose the function through the parent.
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
  }, [registerFullscreenHandler, onFullscreenChange]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setHasError(false);
    onDurationChange?.(video.duration);
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

  const handleDoubleClick = async () => {
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

    setVolume(nextVolume);
  };

  return (
    <div className="relative flex h-full min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-2xl shadow-black/40 sm:min-h-[420px] lg:min-h-[520px]">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

      <video
        ref={videoRef}
        src={videoSource}
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

      {/* No movie selected */}
      {!movie && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#05060d]/75 backdrop-blur-sm">
          <div className="px-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl shadow-xl">
              ▶
            </div>

            <h3 className="text-lg font-bold text-white">
              Choose something to watch
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Select a movie from the selector above to start watching.
            </p>
          </div>
        </div>
      )}

      {/* Video loading error */}
      {movie && hasError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05060d]/90 px-6 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-xl font-bold text-red-400">
              !
            </div>

            <h3 className="text-base font-bold text-white">
              Unable to load this video
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Please try another video source.
            </p>
          </div>
        </div>
      )}

      {/* Movie information */}
      {movie && !hasError && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 max-w-[65%]">
          <div className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-xl">
            <p className="truncate text-xs font-semibold text-white sm:text-sm">
              {movie.title || "Now Watching"}
            </p>

            {movie.year && (
              <p className="mt-0.5 text-[10px] text-slate-400">
                {movie.year}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Volume */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={handleMute}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-sm backdrop-blur-xl transition hover:bg-white/10"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="hidden w-20 accent-violet-500 sm:block"
          aria-label="Volume"
        />
      </div>

      {/* Fullscreen hint */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 hidden rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px] text-slate-400 backdrop-blur-md sm:block">
        Double-click for fullscreen
      </div>
    </div>
  );
}

export default VideoPlayer;