// JoinRoom.jsx
// ------------------------------------------------------
// Allows users to join a room using a room code.
// ------------------------------------------------------

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import {
  useRoom,
} from "../../context/RoomContext";

import roomService from "../../services/roomService";

function JoinRoom() {
  const navigate = useNavigate();

  const {
    setRoom,
    setParticipants,
  } = useRoom();

  const [roomCode, setRoomCode] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const code =
      roomCode.trim().toUpperCase();

    if (!code) {
      setError(
        "Room code is required."
      );
      return;
    }

    if (code.length < 4) {
      setError(
        "Please enter a valid room code."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await roomService.joinRoom(code);

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          "Unable to join room."
        );
      }

      setRoom(response.data);

      setParticipants([
        {
          id: "current-user",
          name: "You",
          role: "participant",
          status: "active",
        },
      ]);

      navigate(
        `/rooms/${response.data.roomCode}`
      );

    } catch (error) {
      console.error(
        "Join room failed:",
        error
      );

      setError(
        "Unable to join the room."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="join-room-page">

      <PageHeader
        title="Join Room"
        description="Enter the room code shared by your friend."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        <Input
          id="room-code"
          label="Room Code"
          value={roomCode}
          onChange={(event) =>
            setRoomCode(
              event.target.value
            )
          }
          placeholder="DEMO123"
          maxLength={20}
          required
          autoComplete="off"
          error={error}
        />

        <Button
          type="submit"
          loading={isLoading}
        >
          Join Room
        </Button>

      </form>

    </PageContainer>
  );
}

export default JoinRoom;