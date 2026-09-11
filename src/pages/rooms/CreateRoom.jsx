// CreateRoom.jsx
// ------------------------------------------------------
// Creates a new watch room.
//
// Currently uses mock roomService.
// Backend will be connected later.
// ------------------------------------------------------

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { useRoom } from "../../context/RoomContext";

import roomService from "../../services/roomService";

function CreateRoom() {
  const navigate = useNavigate();

  const {
    setRoom,
    setParticipants,
  } = useRoom();

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [accessType, setAccessType] =
    useState("private");

  const [maxParticipants, setMaxParticipants] =
    useState(5);

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();

    if (!cleanName) {
      setError(
        "Room name is required."
      );
      return;
    }

    if (
      Number(maxParticipants) < 2 ||
      Number(maxParticipants) > 20
    ) {
      setError(
        "Participants must be between 2 and 20."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await roomService.createRoom({
          name: cleanName,
          description:
            description.trim(),
          accessType,
          maxParticipants:
            Number(maxParticipants),
        });

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          "Room creation failed."
        );
      }

      const createdRoom =
        response.data;

      setRoom(createdRoom);

      setParticipants([
        {
          id: "current-user",
          name: "You",
          role: "host",
          status: "active",
        },
      ]);

      navigate(
        `/rooms/${createdRoom.roomCode}`
      );

    } catch (error) {
      console.error(
        "Create room failed:",
        error
      );

      setError(
        "Unable to create room."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="create-room-page">

      <PageHeader
        title="Create Room"
        description="Create a private watch room for your friends."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <Input
          id="room-name"
          label="Room Name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Movie Night"
          required
          maxLength={100}
        />

        <div className="form-field">

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Movie night with friends"
            maxLength={500}
          />

        </div>

        <div className="form-field">

          <label htmlFor="access-type">
            Access Type
          </label>

          <select
            id="access-type"
            value={accessType}
            onChange={(event) =>
              setAccessType(
                event.target.value
              )
            }
          >
            <option value="private">
              Private
            </option>

            <option value="public">
              Public
            </option>
          </select>

        </div>

        <Input
          id="max-participants"
          label="Maximum Participants"
          type="number"
          value={maxParticipants}
          onChange={(event) =>
            setMaxParticipants(
              event.target.value
            )
          }
          min="2"
          max="20"
          required
        />

        <Button
          type="submit"
          loading={isLoading}
        >
          Create Room
        </Button>

      </form>

    </PageContainer>
  );
}

export default CreateRoom;