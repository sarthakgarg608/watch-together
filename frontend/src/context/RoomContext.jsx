// RoomContext.jsx
// ------------------------------------------------------
// Central room state.
//
// Handles:
// - Room information
// - Selected movie
// - Participants
// - Playback synchronization state
// - Socket connection status
// - Room reset / cleanup
// ------------------------------------------------------

import {
  createContext,
  useContext,
  useState,
} from "react";

import useSocket from "../hooks/useSocket";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  // ====================================================
  // ROOM STATE
  // ====================================================

  const [room, setRoom] = useState(null);

  // ====================================================
  // MOVIE STATE
  // ====================================================

  const [
    selectedMovie,
    setSelectedMovieState,
  ] = useState(null);

  /*
    Change the selected movie.

    Whenever a new movie is selected:
    - Stop playback
    - Reset current time
    - Reset duration
  */
  const setSelectedMovie = (movie) => {
    setSelectedMovieState(movie);

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  // ====================================================
  // PARTICIPANTS STATE
  // ====================================================

  const [
    participants,
    setParticipants,
  ] = useState([]);

  // ====================================================
  // PLAYBACK STATE
  // ====================================================

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(0);

  const [
    duration,
    setDuration,
  ] = useState(0);

  /*
    Reset only playback information.

    Useful when:
    - Movie changes
    - User leaves video
    - Room state is synchronized
  */
  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  // ====================================================
  // ROOM RESET
  // ====================================================

  /*
    Completely clear the current room.

    Useful when the user leaves a room.
  */
  const resetRoom = () => {
    setRoom(null);
    setSelectedMovieState(null);
    setParticipants([]);
    resetPlayback();
  };

  // ====================================================
  // SOCKET
  // ====================================================

  const {
    socket,
    isConnected,
  } = useSocket();

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = {
    // --------------------------------------------------
    // Room
    // --------------------------------------------------

    room,
    setRoom,

    // Completely clear room state
    resetRoom,

    // --------------------------------------------------
    // Movie
    // --------------------------------------------------

    selectedMovie,
    setSelectedMovie,

    // --------------------------------------------------
    // Participants
    // --------------------------------------------------

    participants,
    setParticipants,

    // --------------------------------------------------
    // Playback
    // --------------------------------------------------

    isPlaying,
    setIsPlaying,

    currentTime,
    setCurrentTime,

    duration,
    setDuration,

    resetPlayback,

    // --------------------------------------------------
    // Socket
    // --------------------------------------------------

    socket,
    isConnected,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useRoom() {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error(
      "useRoom must be used inside RoomProvider"
    );
  }

  return context;
}