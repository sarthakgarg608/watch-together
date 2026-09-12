import { useNavigate } from "react-router-dom";

function RoomHeader({
  room,
  onInvite,
  onLeave,
}) {
  const navigate = useNavigate();

  const roomName = room?.name || "Watch Room";
  const roomCode = room?.roomCode || "------";

  const handleLeave = () => {
    if (onLeave) {
      onLeave();
      return;
    }

    navigate("/dashboard");
  };

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#05060d]/95 px-3 backdrop-blur-xl sm:px-5">

      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="hidden items-center gap-2 sm:flex"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-black shadow-lg shadow-violet-500/20">
            ▶
          </div>

          <span className="hidden text-sm font-bold md:block">
            Watch Together
          </span>
        </button>

        <div className="hidden h-7 w-px bg-white/10 sm:block" />

        {/* Room info */}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white sm:text-base">
            {roomName}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              Room
            </span>

            <button
              onClick={() => navigator.clipboard?.writeText(roomCode)}
              className="font-mono text-xs font-bold tracking-[0.18em] text-violet-300 transition hover:text-violet-200"
              title="Copy room code"
            >
              {roomCode}
            </button>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Invite */}
        <button
          onClick={onInvite}
          className="hidden items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:border-violet-500/40 hover:bg-violet-500/20 sm:flex"
        >
          <span>↗</span>
          Invite
        </button>

        {/* Leave */}
        <button
          onClick={handleLeave}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20"
        >
          <span className="sm:hidden">Exit</span>
          <span className="hidden sm:inline">Leave Room</span>
        </button>
      </div>
    </header>
  );
}

export default RoomHeader;