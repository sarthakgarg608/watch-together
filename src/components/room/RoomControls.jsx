// RoomControls.jsx
// ------------------------------------------------------
// Controls available inside the watch room.
// More controls will be added as video synchronization
// and calling features are implemented.
// ------------------------------------------------------

function RoomControls() {
  const handlePlay = () => {
    // Later: emit playback event through Socket.IO.
    console.log("Play");
  };

  const handlePause = () => {
    // Later: emit playback event through Socket.IO.
    console.log("Pause");
  };

  return (
    <div className="room-controls">
      <button type="button" onClick={handlePlay}>
        Play
      </button>

      <button type="button" onClick={handlePause}>
        Pause
      </button>

      <button type="button">
        Mute
      </button>

      <button type="button">
        Fullscreen
      </button>
    </div>
  );
}

export default RoomControls;