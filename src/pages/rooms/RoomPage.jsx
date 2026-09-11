// RoomPage.jsx
// ------------------------------------------------------
// Main watch-room page.
//
// Responsibilities:
// - Load room
// - Store room in RoomContext
// - Display movie selector
// - Display video player
// - Display participants
// - Display invite panel
// - Display chat
// ------------------------------------------------------

import {
  useEffect,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useRoom,
} from "../../context/RoomContext";

import roomService from "../../services/roomService";

import RoomLayout from "../../components/layout/RoomLayout";

import RoomHeader from "../../components/room/RoomHeader";
import ParticipantsList from "../../components/room/ParticipantsList";
import InvitePanel from "../../components/room/InvitePanel";

import MovieSelector from "../../components/video/MovieSelector";
import VideoPlayer from "../../components/video/VideoPlayer";

import ChatPanel from "../../components/chat/ChatPanel";

import Loading from "../../components/common/Loading";

function RoomPage() {
  const {
    roomCode,
  } = useParams();

  const navigate = useNavigate();

  const {
    room,
    setRoom,
    setParticipants,
  } = useRoom();

  // ====================================================
  // LOAD ROOM
  // ====================================================

  useEffect(() => {
    let isMounted = true;

    const loadRoom = async () => {
      try {
        const response =
          await roomService.getRoom(
            roomCode
          );

        if (
          !isMounted ||
          !response?.success ||
          !response?.data
        ) {
          return;
        }

        setRoom(
          response.data
        );

        // Temporary participant.
        // Backend + Socket.IO will replace this.
        setParticipants([
          {
            id: "current-user",
            name: "You",
            role: "host",
            status: "active",
          },
        ]);

      } catch (error) {
        console.error(
          "Failed to load room:",
          error
        );

        if (isMounted) {
          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );
        }

      }
    };

    loadRoom();

    return () => {
      isMounted = false;
    };

  }, [
    roomCode,
    navigate,
    setRoom,
    setParticipants,
  ]);

  // ====================================================
  // LOADING
  // ====================================================

  if (!room) {
    return (
      <Loading
        message="Loading room..."
      />
    );
  }

  // ====================================================
  // ROOM UI
  // ====================================================

  return (
    <RoomLayout

      header={
        <RoomHeader />
      }

      sidebar={
        <>
          <ParticipantsList />

          <InvitePanel />

          <ChatPanel />
        </>
      }

    >

      <MovieSelector />

      <VideoPlayer />

    </RoomLayout>
  );
}

export default RoomPage;