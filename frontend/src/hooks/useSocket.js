// useSocket.js
// ------------------------------------------------------
// Custom React hook for managing the Socket.IO
// connection lifecycle.
//
// IMPORTANT:
// Backend is not created yet.
//
// This hook prepares the frontend so that later:
// RoomPage
//    ↓
// useSocket()
//    ↓
// socket.connect()
//    ↓
// Socket.IO backend
//
// The hook also makes sure that the socket is properly
// disconnected when the component is unmounted.
// ------------------------------------------------------

import {
  useEffect,
  useState,
} from "react";

import socket from "../services/socket";

function useSocket() {
  // Tracks whether the socket is currently connected.
  const [
    isConnected,
    setIsConnected,
  ] = useState(socket.connected);

  useEffect(() => {
    // ==================================================
    // CONNECTION HANDLER
    // ==================================================

    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      setIsConnected(true);
    };

    // ==================================================
    // DISCONNECTION HANDLER
    // ==================================================

    const handleDisconnect = (reason) => {
      console.log(
        "Socket disconnected:",
        reason
      );

      setIsConnected(false);
    };

    // ==================================================
    // CONNECTION ERROR
    // ==================================================

    const handleConnectError = (error) => {
      console.error(
        "Socket connection error:",
        error.message
      );

      setIsConnected(false);
    };

    // Register event listeners.
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

    // Connect manually.
    socket.connect();

    // ==================================================
    // CLEANUP
    // ==================================================

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

      // Disconnect when the component using this
      // hook is removed.
      socket.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
  };
}

export default useSocket;