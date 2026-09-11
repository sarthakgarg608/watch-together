// RoomHeader.jsx
// ------------------------------------------------------
// Header displayed at the top of a watch room.
//
// Current:
// - Room name
// - Room code
// - Connection indicator
//
// Later:
// - Socket.IO connection status
// - Host controls
// - Leave room
// ------------------------------------------------------

import { useRoom } from "../../context/RoomContext";

function RoomHeader() {
  const {
    room,
    isConnected,
  } = useRoom();

  if (!room) {
    return null;
  }

  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">

      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-white sm:text-xl">
          {room.name || "Watch Room"}
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Room code:{" "}
          <span className="font-semibold tracking-wider text-slate-200">
            {room.roomCode}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected
              ? "bg-emerald-400"
              : "bg-red-400"
          }`}
        />

        <span className="text-slate-300">
          {isConnected
            ? "Connected"
            : "Disconnected"}
        </span>

      </div>

    </header>
  );
}

export default RoomHeader;