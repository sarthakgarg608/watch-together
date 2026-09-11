// RoomContext.jsx
// ------------------------------------------------------
// Central room state.
//
// Handles:
// - Room
// - Movie
// - Participants
// - Playback
// - Socket connection status
// ------------------------------------------------------

import {
  createContext,
  useContext,
  useState,
} from "react";

import useSocket from "../hooks/useSocket";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);

  const [
    selectedMovie,
    setSelectedMovieState,
  ] = useState(null);

  const [
    participants,
    setParticipants,
  ] = useState([]);

  // Playback state
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

  // Socket state
  const {
    socket,
    isConnected,
  } = useSocket();

  // Change movie and reset playback.
  const setSelectedMovie = (movie) => {
    setSelectedMovieState(movie);

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const value = {
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

    resetPlayback,

    // Socket
    socket,
    isConnected,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context =
    useContext(RoomContext);

  if (!context) {
    throw new Error(
      "useRoom must be used inside RoomProvider"
    );
  }

  return context;
}