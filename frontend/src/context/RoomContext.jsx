import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import roomService from "../services/roomService";
import playbackService from "../services/playbackService";
import useSocket from "../hooks/useSocket";

const RoomContext = createContext(null);

function RoomProvider({ children }) {
  const { accessToken, user } = useAuth();

  const [room, setRoom] = useState(null);

  const [selectedMovie, setSelectedMovie] =
    useState(null);

  const [participants, setParticipants] =
    useState([]);

  const [playbackState, setPlaybackState] =
    useState({
      isPlaying: false,
      currentPosition: 0,
    });

  const [loading, setLoading] =
    useState(false);

  const [playbackError, setPlaybackError] =
    useState(null);

  // --------------------------------------------------
  // Socket
  // --------------------------------------------------

  const {
    socket,
    isConnected,
    connectionError,
    roomJoined,
    presence,
    connect,
    joinRoom: joinSocketRoom,
    leaveRoom: leaveSocketRoom,
    disconnect,
  } = useSocket(
    accessToken,
    room?.roomCode
  );

  // --------------------------------------------------
  // Create Room
  // --------------------------------------------------

  async function createRoom(roomData) {
    if (!accessToken) {
      throw new Error(
        "Authentication required."
      );
    }

    setLoading(true);

    try {
      const response =
        await roomService.createRoom(
          roomData,
          accessToken
        );

      const createdRoom =
        response.data?.room ||
        response.data;

      if (!createdRoom) {
        throw new Error(
          "Invalid room response."
        );
      }

      setRoom(createdRoom);

      setSelectedMovie(
        createdRoom.selectedMovie ||
          null
      );

      if (
        Array.isArray(
          createdRoom.members
        )
      ) {
        setParticipants(
          createdRoom.members
        );
      }

      return createdRoom;
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Join Room
  // --------------------------------------------------

  async function joinRoom(roomCode) {
    if (!accessToken) {
      throw new Error(
        "Authentication required."
      );
    }

    setLoading(true);

    try {
      const response =
        await roomService.joinRoom(
          roomCode,
          accessToken
        );

      const joinedRoom =
        response.data?.room ||
        response.data;

      if (!joinedRoom) {
        throw new Error(
          "Invalid room response."
        );
      }

      setRoom(joinedRoom);

      setSelectedMovie(
        joinedRoom.selectedMovie ||
          null
      );

      if (
        Array.isArray(
          joinedRoom.members
        )
      ) {
        setParticipants(
          joinedRoom.members
        );
      }

      return joinedRoom;
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Load Room
  // --------------------------------------------------

  async function loadRoom(roomCode) {
    if (!accessToken) {
      throw new Error(
        "Authentication required."
      );
    }

    setLoading(true);

    try {
      const response =
        await roomService.getRoom(
          roomCode,
          accessToken
        );

      const roomData =
        response.data?.room ||
        response.data;

      if (!roomData) {
        throw new Error(
          "Invalid room response."
        );
      }

      setRoom(roomData);

      setSelectedMovie(
        roomData.selectedMovie ||
          null
      );

      if (
        Array.isArray(
          roomData.members
        )
      ) {
        setParticipants(
          roomData.members
        );
      }

      return roomData;
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Load Initial Playback State
  // --------------------------------------------------

  async function loadPlaybackState(
    roomCode
  ) {
    if (!accessToken || !roomCode) {
      return;
    }

    try {
      const response =
        await playbackService.getPlaybackState(
          roomCode,
          accessToken
        );

      const data =
        response.data?.playback ||
        response.data;

      if (!data) {
        return;
      }

      setPlaybackState({
        isPlaying:
          Boolean(data.isPlaying),

        currentPosition:
          Number(
            data.currentPosition ?? 0
          ),
      });
    } catch (error) {
      console.warn(
        "Unable to load playback state:",
        error.message
      );
    }
  }

  // --------------------------------------------------
  // Connect + Join Socket Room
  // --------------------------------------------------

  useEffect(() => {
    if (
      !room?.roomCode ||
      !accessToken
    ) {
      return;
    }

    connect();

    return () => {
      leaveSocketRoom();
      disconnect();
    };
  }, [
    room?.roomCode,
    accessToken,
    connect,
    leaveSocketRoom,
    disconnect,
  ]);

  // --------------------------------------------------
  // Load Playback After Room Is Loaded
  // --------------------------------------------------

  useEffect(() => {
    if (
      !room?.roomCode ||
      !accessToken
    ) {
      return;
    }

    loadPlaybackState(
      room.roomCode
    );
  }, [
    room?.roomCode,
    accessToken,
  ]);

  // --------------------------------------------------
  // Playback + Room Socket Events
  // --------------------------------------------------

  useEffect(() => {
    if (!socket) {
      return;
    }

    // ----------------------------------------------
    // Playback Updated
    // ----------------------------------------------

    function handlePlaybackUpdated(
      data
    ) {
      if (!data) {
        return;
      }

      setPlaybackError(null);

      setPlaybackState({
        isPlaying:
          Boolean(data.isPlaying),

        currentPosition:
          Number(
            data.position ?? 0
          ),
      });
    }

    // ----------------------------------------------
    // Playback Sync
    // ----------------------------------------------

    function handlePlaybackSync(
      data
    ) {
      if (!data) {
        return;
      }

      setPlaybackError(null);

      setPlaybackState({
        isPlaying:
          Boolean(data.isPlaying),

        currentPosition:
          Number(
            data.position ?? 0
          ),
      });
    }

    // ----------------------------------------------
    // Playback Error
    // ----------------------------------------------

    function handlePlaybackError(
      data
    ) {
      setPlaybackError(
        data?.message ||
          "Playback synchronization failed."
      );
    }

    // ----------------------------------------------
    // Generic Socket Error
    // ----------------------------------------------

    function handleSocketError(
      data
    ) {
      if (
        data?.event?.startsWith(
          "playback:"
        )
      ) {
        setPlaybackError(
          data.message ||
            "Playback synchronization failed."
        );
      }
    }

    // ----------------------------------------------
    // Movie Updated
    // ----------------------------------------------

    function handleMovieUpdated(
      data
    ) {
      if (!data?.selectedMovie) {
        return;
      }

      setSelectedMovie(
        data.selectedMovie
      );

      setPlaybackState({
        isPlaying: false,
        currentPosition: 0,
      });

      setPlaybackError(null);
    }

    // ----------------------------------------------
    // Register Events
    // ----------------------------------------------

    socket.on(
      "playback:updated",
      handlePlaybackUpdated
    );

    socket.on(
      "playback:sync",
      handlePlaybackSync
    );

    socket.on(
      "playback:error",
      handlePlaybackError
    );

    socket.on(
      "socket:error",
      handleSocketError
    );

    socket.on(
      "room:movie-updated",
      handleMovieUpdated
    );

    // ----------------------------------------------
    // Cleanup
    // ----------------------------------------------

    return () => {
      socket.off(
        "playback:updated",
        handlePlaybackUpdated
      );

      socket.off(
        "playback:sync",
        handlePlaybackSync
      );

      socket.off(
        "playback:error",
        handlePlaybackError
      );

      socket.off(
        "socket:error",
        handleSocketError
      );

      socket.off(
        "room:movie-updated",
        handleMovieUpdated
      );
    };
  }, [socket]);

  // --------------------------------------------------
  // Request Initial Socket Playback Sync
  // --------------------------------------------------

  useEffect(() => {
    if (
      !socket ||
      !roomJoined
    ) {
      return;
    }

    setPlaybackError(null);

    socket.emit(
      "playback:sync-request"
    );
  }, [
    socket,
    roomJoined,
  ]);

  // --------------------------------------------------
  // Play
  // --------------------------------------------------

  function playVideo(position) {
    if (
      !socket ||
      !socket.connected
    ) {
      return;
    }

    if (
      typeof position !== "number" ||
      !Number.isFinite(position) ||
      position < 0
    ) {
      return;
    }

    socket.emit(
      "playback:play",
      {
        position,
      }
    );
  }

  // --------------------------------------------------
  // Pause
  // --------------------------------------------------

  function pauseVideo(position) {
    if (
      !socket ||
      !socket.connected
    ) {
      return;
    }

    if (
      typeof position !== "number" ||
      !Number.isFinite(position) ||
      position < 0
    ) {
      return;
    }

    socket.emit(
      "playback:pause",
      {
        position,
      }
    );
  }

  // --------------------------------------------------
  // Seek
  // --------------------------------------------------

  function seekVideo(
    position,
    isPlaying
  ) {
    if (
      !socket ||
      !socket.connected
    ) {
      return;
    }

    if (
      typeof position !== "number" ||
      !Number.isFinite(position) ||
      position < 0
    ) {
      return;
    }

    socket.emit(
      "playback:seek",
      {
        position,
        isPlaying,
      }
    );
  }

  // --------------------------------------------------
  // Leave Room
  // --------------------------------------------------

  async function leaveRoom() {
    if (!accessToken) {
      throw new Error(
        "Authentication required."
      );
    }

    if (!room?.roomCode) {
      return;
    }

    try {
      await roomService.leaveRoom(
        room.roomCode,
        accessToken
      );
    } finally {
      leaveSocketRoom();
      clearRoom();
      disconnect();
    }
  }

  // --------------------------------------------------
  // Select Movie
  // --------------------------------------------------

  async function selectMovie(
    movieData
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication required."
      );
    }

    if (!room?.roomCode) {
      throw new Error(
        "You are not inside a room."
      );
    }

    const response =
      await roomService.selectMovie(
        room.roomCode,
        movieData,
        accessToken
      );

    const updatedRoom =
      response.data?.room ||
      response.data;

    if (updatedRoom) {
      setRoom(updatedRoom);

      setSelectedMovie(
        updatedRoom.selectedMovie ||
          movieData
      );

      /*
       * Movie selection resets playback
       * on the backend.
       */
      setPlaybackState({
        isPlaying: false,
        currentPosition: 0,
      });
    } else {
      setSelectedMovie(
        movieData
      );

      setPlaybackState({
        isPlaying: false,
        currentPosition: 0,
      });
    }

    return response;
  }

  // --------------------------------------------------
  // Clear Room
  // --------------------------------------------------

  function clearRoom() {
    setRoom(null);

    setSelectedMovie(null);

    setParticipants([]);

    setPlaybackState({
      isPlaying: false,
      currentPosition: 0,
    });

    setPlaybackError(null);
  }

  // --------------------------------------------------
  // Context
  // --------------------------------------------------

  const value = {
    // User
    user,

    // Room
    room,
    selectedMovie,
    participants,

    // Playback
    playbackState,
    playbackError,

    // Loading
    loading,

    // Socket
    socket,
    isConnected,
    connectionError,
    roomJoined,
    presence,

    // Room actions
    createRoom,
    joinRoom,
    loadRoom,
    leaveRoom,
    selectMovie,

    // Playback actions
    playVideo,
    pauseVideo,
    seekVideo,
    loadPlaybackState,

    // Socket actions
    joinSocketRoom,
    leaveSocketRoom,

    // State setters
    setRoom,
    setSelectedMovie,
    setParticipants,
    setPlaybackState,

    // Utility
    clearRoom,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

function useRoom() {
  const context =
    useContext(RoomContext);

  if (!context) {
    throw new Error(
      "useRoom must be used inside RoomProvider."
    );
  }

  return context;
}

export {
  RoomProvider,
  useRoom,
};