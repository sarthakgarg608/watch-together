// RoomCard.jsx
// Reusable component used to display a watch room.

import { Link } from "react-router-dom";

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div>
        <h3>{room.name}</h3>

        {room.description && (
          <p>{room.description}</p>
        )}

        <p>
          Participants: {room.participants ?? 0}
        </p>
      </div>

      <Link to={`/rooms/${room.roomCode}`}>
        Open Room
      </Link>
    </article>
  );
}

export default RoomCard;