// RoomInfo.jsx
// ------------------------------------------------------
// Displays basic information about the current room.
// ------------------------------------------------------

function RoomInfo({ room }) {
  if (!room) {
    return null;
  }

  return (
    <section className="room-info">

      <h2>Room Information</h2>

      <div>
        <strong>Name:</strong>
        <span>{room.name}</span>
      </div>

      <div>
        <strong>Room Code:</strong>
        <span>{room.roomCode}</span>
      </div>

      <div>
        <strong>Access:</strong>
        <span>{room.accessType}</span>
      </div>

      <div>
        <strong>Maximum Participants:</strong>
        <span>{room.maxParticipants}</span>
      </div>

      {room.description && (
        <div>
          <strong>Description:</strong>
          <span>{room.description}</span>
        </div>
      )}

    </section>
  );
}

export default RoomInfo;