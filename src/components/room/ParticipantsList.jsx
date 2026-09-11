// ParticipantsList.jsx
// ------------------------------------------------------
// Displays users currently present in the room.
//
// Later this list will be updated through Socket.IO.
// ------------------------------------------------------

import { useRoom } from "../../context/RoomContext";

function ParticipantsList() {
  const {
    participants,
  } = useRoom();

  return (
    <section className="participants-list">

      <h2>
        Participants
      </h2>

      {participants.length === 0 ? (
        <p>
          No participants yet.
        </p>
      ) : (
        <ul>

          {participants.map(
            (participant) => (
              <li
                key={participant.id}
              >
                <span>
                  {participant.name}
                </span>

                <span>
                  {participant.role}
                </span>
              </li>
            )
          )}

        </ul>
      )}

    </section>
  );
}

export default ParticipantsList;