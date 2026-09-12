import { useState } from "react";

function InvitePanel({ roomCode }) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/join/${roomCode || ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  return (
    <section className="border-b border-white/[0.08] p-4">

      <div className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] to-fuchsia-500/[0.04] p-4">

        {/* Title */}
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            ↗
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Invite friends
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Share this link and watch together.
            </p>
          </div>
        </div>

        {/* Link */}
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 p-1.5">

          <div className="min-w-0 flex-1 truncate px-2 text-xs text-slate-400">
            {inviteUrl}
          </div>

          <button
            onClick={handleCopy}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition ${
              copied
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-violet-500 text-white hover:bg-violet-400"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Room code */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-slate-600">
            Room code
          </span>

          <span className="font-mono text-xs font-bold tracking-[0.2em] text-violet-300">
            {roomCode || "------"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default InvitePanel;