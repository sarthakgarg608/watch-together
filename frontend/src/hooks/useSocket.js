
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  connectSocket,
  disconnectSocket,
  joinSocketRoom,
  leaveSocketRoom,
  socket,
} from "../services/socket";

function useSocket(
  accessToken,
  roomCode
) {
  const [isConnected, setIsConnected] =
    useState(socket.connected);

  const [connectionError, setConnectionError] =
    useState(null);

  const [roomJoined, setRoomJoined] =
    useState(false);

  const [presence, setPresence] =
    useState([]);

  // --------------------------------------------------
  // Socket Event Listeners
  // --------------------------------------------------

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true);
      setConnectionError(null);

      /*
       * Socket may connect after the roomCode
       * has already been set.
       *
       * Therefore join the room immediately
       * after connection.
       */
      if (roomCode) {
        joinSocketRoom(roomCode);
      }
    }

    function handleDisconnect() {
      setIsConnected(false);
      setRoomJoined(false);
    }

    function handleConnectError(error) {
      setIsConnected(false);
      setRoomJoined(false);

      setConnectionError(
        error?.message ||
          "Socket connection failed."
      );
    }

    // ------------------------------------------------
    // Room Joined
    // ------------------------------------------------

    function handleRoomJoined(data) {
      setRoomJoined(true);
      setConnectionError(null);

      if (Array.isArray(data?.presence)) {
        setPresence(data.presence);
      }
    }

    // ------------------------------------------------
    // Room Error
    // ------------------------------------------------

    function handleRoomError(data) {
      setRoomJoined(false);

      setConnectionError(
        data?.message ||
          "Unable to join the room."
      );
    }

    // ------------------------------------------------
    // User Joined
    // ------------------------------------------------

    function handleUserJoined(data) {
      if (Array.isArray(data?.presence)) {
        setPresence(data.presence);
      }
    }

    // ------------------------------------------------
    // User Left
    // ------------------------------------------------

    function handleUserLeft(data) {
      if (Array.isArray(data?.presence)) {
        setPresence(data.presence);
      }
    }

    // ------------------------------------------------
    // Register Listeners
    // ------------------------------------------------

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "room:joined",
      handleRoomJoined
    );

    socket.on(
      "room:error",
      handleRoomError
    );

    socket.on(
      "room:user-joined",
      handleUserJoined
    );

    socket.on(
      "room:user-left",
      handleUserLeft
    );

    // ------------------------------------------------
    // Cleanup Listeners
    // ------------------------------------------------

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "room:joined",
        handleRoomJoined
      );

      socket.off(
        "room:error",
        handleRoomError
      );

      socket.off(
        "room:user-joined",
        handleUserJoined
      );

      socket.off(
        "room:user-left",
        handleUserLeft
      );
    };
  }, [roomCode]);

  // --------------------------------------------------
  // Connect
  // --------------------------------------------------

  const connect = useCallback(() => {
    if (!accessToken) {
      return;
    }

    connectSocket(accessToken);
  }, [accessToken]);

  // --------------------------------------------------
  // Join Room Manually
  // --------------------------------------------------

  const joinRoom = useCallback(() => {
    if (
      !roomCode ||
      !socket.connected
    ) {
      return;
    }

    joinSocketRoom(roomCode);
  }, [roomCode]);

  // --------------------------------------------------
  // Leave Room
  // --------------------------------------------------

  const leaveRoom = useCallback(() => {
    leaveSocketRoom();

    setRoomJoined(false);
    setPresence([]);
  }, []);

  // --------------------------------------------------
  // Disconnect
  // --------------------------------------------------

  const disconnect = useCallback(() => {
    disconnectSocket();

    setRoomJoined(false);
    setPresence([]);
  }, []);

  return {
    socket,

    isConnected,

    connectionError,

    roomJoined,

    presence,

    connect,

    joinRoom,

    leaveRoom,

    disconnect,
  };
}

export default useSocket;

