// ProgressBar.jsx
// ------------------------------------------------------
// Handles video seeking.
// Current position is stored in RoomContext.
// ------------------------------------------------------

import { useRoom } from "../../context/RoomContext";

function ProgressBar({
  videoRef,
  currentTime,
  duration,
}) {
  const { setPlaybackState } = useRoom();

  const handleSeek = (event) => {
    if (!videoRef.current) return;

    const newTime = Number(event.target.value);

    videoRef.current.currentTime = newTime;

    setPlaybackState((previousState) => ({
      ...previousState,
      currentTime: newTime,
    }));
  };

  const safeDuration =
    Number.isFinite(duration) && duration > 0
      ? duration
      : 0;

  const safeCurrentTime =
    Number.isFinite(currentTime) && currentTime >= 0
      ? Math.min(currentTime, safeDuration)
      : 0;

  return (
    <input
      type="range"
      min="0"
      max={safeDuration}
      value={safeCurrentTime}
      onChange={handleSeek}
      step="0.1"
      disabled={safeDuration === 0}
      aria-label="Video progress"
    />
  );
}

export default ProgressBar;