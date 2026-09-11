// RoomHeader.jsx
// ------------------------------------------------------
// Header for the watch room.
// ------------------------------------------------------

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useRoom } from "../../context/RoomContext";

function RoomHeader() {
  const navigate = useNavigate();

  const {
    room,
    setRoom,
    setSelectedMovie,
    setParticipants,
  } = useRoom();

  const handleLeaveRoom = () => {
    setRoom(null);
    setSelectedMovie(null);
    setParticipants([]);

    navigate("/dashboard");
  };

  if (!room) {
    return null;
  }

  return (
    <header className="room-header">

      <div>

        <Link to="/dashboard">
          ← Dashboard
        </Link>

        <h1>
          {room.name}
        </h1>

        <p>
          Room Code:{" "}
          <strong>
            {room.roomCode}
          </strong>
        </p>

      </div>

      <button
        type="button"
        onClick={handleLeaveRoom}
      >
        Leave Room
      </button>

    </header>
  );
}

export default RoomHeader;