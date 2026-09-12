// VideoControls.jsx
// ------------------------------------------------------
// Controls for video playback.
// ------------------------------------------------------

import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";

function VideoControls({
  videoRef,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
}) {
  return (
    <div className="video-controls">
      <button
        type="button"
        onClick={onTogglePlay}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <ProgressBar
        videoRef={videoRef}
        currentTime={currentTime}
        duration={duration}
      />

      <VolumeControl videoRef={videoRef} />

      <button
        type="button"
        onClick={() => videoRef.current?.requestFullscreen()}
      >
        Fullscreen
      </button>
    </div>
  );
}

export default VideoControls;