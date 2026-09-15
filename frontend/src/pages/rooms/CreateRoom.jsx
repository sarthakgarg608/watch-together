import { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";

import { useRoom } from "../../context/RoomContext";

function CreateRoom() {
  const navigate = useNavigate();

  const {
    createRoom,
    loading,
  } = useRoom();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxParticipants: 5,
    accessType: "private",
  });

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      const room =
        await createRoom({
          name: formData.name,
          description:
            formData.description,

          maxParticipants:
            Number(
              formData.maxParticipants
            ),

          accessType:
            formData.accessType,
        });

      navigate(
        `/rooms/${room.roomCode}`
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to create room."
      );
    }
  }

  return (
    <main>
      <h1>Create a Room</h1>

      <p>
        Create a private watch party
        and invite your friends.
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
          <label htmlFor="name">
            Room Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="maxParticipants">
            Maximum Participants
          </label>

          <select
            id="maxParticipants"
            name="maxParticipants"
            value={
              formData.maxParticipants
            }
            onChange={handleChange}
          >
            <option value={2}>
              2
            </option>

            <option value={3}>
              3
            </option>

            <option value={4}>
              4
            </option>

            <option value={5}>
              5
            </option>

            <option value={6}>
              6
            </option>

            <option value={7}>
              7
            </option>

            <option value={8}>
              8
            </option>

            <option value={9}>
              9
            </option>

            <option value={10}>
              10
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="accessType">
            Room Access
          </label>

          <select
            id="accessType"
            name="accessType"
            value={
              formData.accessType
            }
            onChange={handleChange}
          >
            <option value="private">
              Private
            </option>

            <option value="public">
              Public
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Room..."
            : "Create Room"}
        </button>
      </form>
    </main>
  );
}

export default CreateRoom;