// VideoPlayer.jsx
// ------------------------------------------------------
// Main video player.
//
// Playback state is now controlled through RoomContext.
//
// Current:
// - Play
// - Pause
// - Seek
// - Current time
// - Duration
//
// Future:
// These actions will emit Socket.IO events so that
// every participant sees synchronized playback.
// ------------------------------------------------------

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRoom } from "../../context/RoomContext";

function VideoPlayer() {
  const videoRef = useRef(null);

  const {
    selectedMovie,

    isPlaying,
    setIsPlaying,

    currentTime,
    setCurrentTime,

    duration,
    setDuration,
  } = useRoom();

  const [error, setError] =
    useState("");

  // ====================================================
  // RESET VIDEO WHEN MOVIE CHANGES
  // ====================================================

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();

    video.currentTime = 0;

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  }, [
    selectedMovie,
    setIsPlaying,
    setCurrentTime,
    setDuration,
  ]);

  // ====================================================
  // PLAY / PAUSE
  // ====================================================

  const handlePlay = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      await video.play();

      setIsPlaying(true);
    } catch (error) {
      console.error(
        "Video play failed:",
        error
      );

      setError(
        "Unable to play this video."
      );

      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();

    setIsPlaying(false);
  };

  // ====================================================
  // VIDEO TIME UPDATE
  // ====================================================

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setCurrentTime(
      video.currentTime
    );
  };

  // ====================================================
  // VIDEO METADATA
  // ====================================================

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (
      Number.isFinite(video.duration)
    ) {
      setDuration(
        video.duration
      );
    }
  };

  // ====================================================
  // NATIVE PLAY EVENT
  // ====================================================

  const handlePlayEvent = () => {
    setIsPlaying(true);
  };

  // ====================================================
  // NATIVE PAUSE EVENT
  // ====================================================

  const handlePauseEvent = () => {
    setIsPlaying(false);
  };

  // ====================================================
  // VIDEO ERROR
  // ====================================================

  const handleVideoError = () => {
    setError(
      "Unable to load the video."
    );

    setIsPlaying(false);
  };

  // ====================================================
  // SEEK
  // ====================================================

  const handleSeek = (event) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const newTime =
      Number(event.target.value);

    video.currentTime = newTime;

    setCurrentTime(newTime);
  };

  // ====================================================
  // NO MOVIE
  // ====================================================

  if (!selectedMovie) {
    return (
      <section className="video-player empty">

        <h2>
          No Movie Selected
        </h2>

        <p>
          Select a movie to start watching.
        </p>

      </section>
    );
  }

  // ====================================================
  // VIDEO PLAYER
  // ====================================================

  return (
    <section className="video-player">

      <div className="video-header">

        <h2>
          {selectedMovie.title}
        </h2>

        <span>
          {selectedMovie.year}
        </span>

      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <video
        ref={videoRef}
        src={selectedMovie.videoUrl}
        onTimeUpdate={
          handleTimeUpdate
        }
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onPlay={
          handlePlayEvent
        }
        onPause={
          handlePauseEvent
        }
        onError={
          handleVideoError
        }
        playsInline
      />

      {/* ================= CONTROLS ================= */}

      <div className="video-controls">

        <button
          type="button"
          onClick={
            isPlaying
              ? handlePause
              : handlePlay
          }
        >
          {isPlaying
            ? "Pause"
            : "Play"}
        </button>

        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
          aria-label="Video progress"
        />

        <span>
          {Math.floor(currentTime)}
          {" / "}
          {Math.floor(duration)}
          {" seconds"}
        </span>

      </div>

    </section>
  );
}

export default VideoPlayer;