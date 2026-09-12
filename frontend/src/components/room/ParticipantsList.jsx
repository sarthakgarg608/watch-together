function ParticipantsList({ participants = [] }) {
  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <section className="border-b border-white/[0.08]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <h2 className="text-sm font-bold text-white">
            Participants
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {participants.length}{" "}
            {participants.length === 1 ? "person" : "people"} watching
          </p>
        </div>

        <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-emerald-500/10 px-2 text-xs font-bold text-emerald-400">
          {participants.length}
        </div>
      </div>

      {/* Participants */}
      <div className="max-h-48 space-y-1 overflow-y-auto px-2 pb-3">

        {participants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-500">
              👥
            </div>

            <p className="text-xs text-slate-500">
              No participants yet
            </p>
          </div>
        ) : (
          participants.map((participant, index) => {
            const name = participant?.name || `Guest ${index + 1}`;
            const isHost = participant?.role === "host";

            return (
              <div
                key={participant?.id || index}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.04]"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-xs font-bold shadow-lg">
                    {getInitial(name)}
                  </div>

                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#070912] bg-emerald-400" />
                </div>

                {/* Name */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-200">
                    {name}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    {isHost ? "Host" : "Watching"}
                  </p>
                </div>

                {isHost && (
                  <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-300">
                    Host
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ParticipantsList;