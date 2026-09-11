// VolumeControl.jsx
// ------------------------------------------------------
// Controls video volume.
// Volume is also stored in RoomContext.
// ------------------------------------------------------

import { useEffect } from "react";
import { useRoom } from "../../context/RoomContext";

function VolumeControl({ videoRef }) {
  const {
    playbackState,
    setPlaybackState,
  } = useRoom();

  const volume = playbackState.volume;

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.volume = volume;
  }, [videoRef, volume]);

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);

    setPlaybackState((previousState) => ({
      ...previousState,
      volume: newVolume,
    }));
  };

  return (
    <div className="volume-control">
      <label htmlFor="volume">
        Volume
      </label>

      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        aria-label="Volume"
      />
    </div>
  );
}

export default VolumeControl;