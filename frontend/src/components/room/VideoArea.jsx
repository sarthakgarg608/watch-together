// VideoArea.jsx
// ------------------------------------------------------
// Main video player area.
// Actual video playback + synchronization will be
// connected later with the backend and Socket.IO.
// ------------------------------------------------------

function VideoArea() {
  return (
    <section className="video-area">
      <div className="video-placeholder">
        <h2>Video Player</h2>

        <p>
          Your movie/video will appear here.
        </p>
      </div>
    </section>
  );
}

export default VideoArea;