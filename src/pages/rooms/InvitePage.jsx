import { useNavigate, useParams } from "react-router-dom";

function InvitePage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/rooms/${roomCode}`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040611] px-4 text-white">

      {/* Background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />

      {/* Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl shadow-2xl shadow-violet-500/20">
          ▶
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
          Watch Together
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          You’re invited
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
          Someone invited you to a private watch room. Join the room and
          watch together in real time.
        </p>

        {/* Room code */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Room code
          </p>

          <p className="mt-2 font-mono text-2xl font-black tracking-[0.3em] text-violet-300">
            {roomCode || "------"}
          </p>
        </div>

        {/* Join */}
        <button
          onClick={handleJoin}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-4 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition hover:scale-[1.01] hover:shadow-violet-500/30 active:scale-[0.99]"
        >
          Join Watch Room
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-xs font-semibold text-slate-500 transition hover:text-white"
        >
          Go back home
        </button>
      </div>
    </div>
  );
}

export default InvitePage;