// RoomPage.jsx
// ------------------------------------------------------
// Main watch-room page.
//
// Handles:
// - Room information
// - Movie selection
// - Video player
// - Playback controls
// - Participants
// - Invite panel
// - Group chat
// ------------------------------------------------------

import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RoomLayout from "../../components/layout/RoomLayout";
import RoomHeader from "../../components/room/RoomHeader";
import ParticipantsList from "../../components/room/ParticipantsList";
import InvitePanel from "../../components/room/InvitePanel";
import ChatPanel from "../../components/chat/ChatPanel";

import MovieSelector from "../../components/video/MovieSelector";
import VideoPlayer from "../../components/video/VideoPlayer";
import PlaybackControls from "../../components/video/PlaybackControls";

import { useRoom } from "../../context/RoomContext";

function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const fullscreenHandlerRef = useRef(null);

  // ====================================================
  // ROOM CONTEXT
  // ====================================================

  const {
    // Room
    room,
    setRoom,

    // Movie
    selectedMovie,
    setSelectedMovie,

    // Participants
    participants,
    setParticipants,

    // Playback
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,

    // Room cleanup
    resetRoom,
  } = useRoom();

  // ====================================================
  // INITIAL ROOM DATA
  // ====================================================

  useEffect(() => {
    /*
      At the moment there is no backend.

      Therefore we create temporary room data
      so the UI can be tested.

      Later this will be replaced with:
        GET /api/v1/rooms/:roomCode
    */

    if (!room) {
      setRoom({
        roomCode: roomCode || "DEMO123",
        name: "Friday Night Watch",
        description: "Movie night with friends",
        accessType: "private",
      });
    }

    /*
      Temporary participants for UI testing.

      Later these will come from the backend/WebSocket.
    */

    if (!participants?.length) {
      setParticipants([
        {
          id: "current-user",
          name: "You",
          role: "host",
          status: "active",
        },
        {
          id: "demo-user-1",
          name: "Alex",
          role: "member",
          status: "active",
        },
        {
          id: "demo-user-2",
          name: "Sam",
          role: "member",
          status: "active",
        },
      ]);
    }
  }, [
    room,
    participants,
    roomCode,
    setRoom,
    setParticipants,
  ]);

  // ====================================================
  // PLAYBACK
  // ====================================================

  const handlePlayPause = () => {
    setIsPlaying((current) => !current);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  // ====================================================
  // MOVIE SELECTION
  // ====================================================

  const handleMovieSelect = (movie) => {
    /*
      setSelectedMovie already handles:

      - Selecting movie
      - Stopping playback
      - Resetting current time
      - Resetting duration
    */

    setSelectedMovie(movie);
  };

  // ====================================================
  // INVITE
  // ====================================================

  const handleInvite = async () => {
    const inviteUrl = `${window.location.origin}/join/${roomCode}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  // ====================================================
  // LEAVE ROOM
  // ====================================================

  const handleLeave = () => {
    /*
      Clear all room-related state before
      returning to the dashboard.
    */

    resetRoom();

    navigate("/dashboard");
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <RoomLayout
      // ------------------------------------------------
      // HEADER
      // ------------------------------------------------
      header={
        <div className="relative">
          <RoomHeader
            room={room}
            onInvite={handleInvite}
            onLeave={handleLeave}
          />

          {/* Movie selector */}
          <div className="absolute left-3 top-[72px] z-30 sm:left-5">
            <MovieSelector
              selectedMovie={selectedMovie}
              onSelect={handleMovieSelect}
            />
          </div>
        </div>
      }

      // ------------------------------------------------
      // VIDEO
      // ------------------------------------------------
      video={
        <VideoPlayer
          movie={selectedMovie}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          onDurationChange={setDuration}
          onPlayStateChange={setIsPlaying}
        />
      }

      // ------------------------------------------------
      // PLAYBACK CONTROLS
      // ------------------------------------------------
      controls={
        <PlaybackControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />
      }

      // ------------------------------------------------
      // SIDEBAR
      // ------------------------------------------------
      sidebar={
        <div className="flex h-full min-h-0 flex-col">

          {/* Participants */}
          <ParticipantsList
            participants={participants || []}
          />

          {/* Invite */}
          <InvitePanel
            roomCode={room?.roomCode || roomCode}
          />

          {/* Chat */}
          <ChatPanel />

        </div>
      }
    />
  );
}

export default RoomPage;