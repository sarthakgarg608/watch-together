import { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";

import { useRoom } from "../../context/RoomContext";

function JoinRoom() {
  const navigate = useNavigate();

  const {
    joinRoom,
    loading,
  } = useRoom();

  const [roomCode, setRoomCode] =
    useState("");

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const value =
      event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    setRoomCode(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (roomCode.length !== 6) {
      setError(
        "Please enter a valid 6-character room code."
      );

      return;
    }

    try {
      const room =
        await joinRoom(roomCode);

      navigate(
        `/rooms/${room.roomCode}`
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to join room."
      );
    }
  }

  return (
    <main>
      <h1>Join a Room</h1>

      <p>
        Enter the room code shared
        by your friend.
      </p>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="roomCode">
            Room Code
          </label>

          <input
            id="roomCode"
            name="roomCode"
            type="text"
            value={roomCode}
            onChange={handleChange}
            placeholder="ABC123"
            maxLength={6}
            autoComplete="off"
            required
          />
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            roomCode.length !== 6
          }
        >
          {loading
            ? "Joining Room..."
            : "Join Room"}
        </button>
      </form>
    </main>
  );
}

export default JoinRoom;