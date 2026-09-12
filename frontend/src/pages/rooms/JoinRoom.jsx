// JoinRoom.jsx
// ------------------------------------------------------
// Join an existing watch room.
//
// UI:
// - Premium cinematic design
// - Large room-code input
// - Live preview
// - Responsive layout
//
// Backend integration:
// - Uses existing roomService.joinRoom()
// - Keeps RoomContext updated
// ------------------------------------------------------

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { useRoom } from "../../context/RoomContext";

import roomService from "../../services/roomService";

function JoinRoom() {
  const navigate = useNavigate();

  const {
    setRoom,
    setParticipants,
  } = useRoom();

  const [roomCode, setRoomCode] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanRoomCode =
      roomCode.trim().toUpperCase();

    if (!cleanRoomCode) {
      setError(
        "Room code is required."
      );
      return;
    }

    if (cleanRoomCode.length < 4) {
      setError(
        "Please enter a valid room code."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await roomService.joinRoom(
          cleanRoomCode
        );

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          "Unable to join room."
        );
      }

      const joinedRoom =
        response.data;

      setRoom(joinedRoom);

      /*
       * The backend will eventually return
       * the actual participant list.
       *
       * For now we initialise the local
       * participant state safely.
       */
      setParticipants(
        joinedRoom.participants || []
      );

      navigate(
        `/rooms/${joinedRoom.roomCode}`
      );

    } catch (error) {
      console.error(
        "Join room failed:",
        error
      );

      setError(
        error.message ||
        "Unable to join this room. Check the room code and try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomCodeChange = (
    event
  ) => {
    const value =
      event.target.value
        .toUpperCase()
        .replace(/\s/g, "");

    setRoomCode(value);
  };

  return (
    <PageContainer className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6 lg:py-16">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-[-180px] top-[-100px] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute right-[-160px] top-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[130px]" />

      </div>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mx-auto mb-10 max-w-2xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Watch Party
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Join a room
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
            Enter the room code shared by your
            friend and jump into the watch party.
          </p>

        </div>


        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1fr_340px]">

          {/* ==================================================
              FORM
          ================================================== */}

          <div className="p-6 sm:p-10">

            <div className="mb-8">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-xl">
                🔗
              </div>

              <h2 className="text-2xl font-bold">
                Enter room code
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ask the host for the unique code
                of their watch room.
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >

              {/* Error */}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300"
                >
                  {error}
                </div>
              )}


              {/* Room code */}

              <div className="space-y-2">

                <label
                  htmlFor="room-code"
                  className="block text-sm font-medium text-slate-200"
                >
                  Room Code
                </label>

                <input
                  id="room-code"
                  type="text"
                  value={roomCode}
                  onChange={
                    handleRoomCodeChange
                  }
                  placeholder="ABC123"
                  maxLength={20}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-5 text-center text-2xl font-black tracking-[0.3em] text-white outline-none transition duration-300 placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-700 hover:border-white/20 focus:border-violet-500 focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10 sm:text-3xl"
                />

              </div>


              {/* Join button */}

              <Button
                type="submit"
                loading={isLoading}
              >
                Join Watch Room
              </Button>


              {/* Helper */}

              <p className="text-center text-xs leading-5 text-slate-600">
                Room codes are shared by the host.
                Make sure you enter it exactly as
                provided.
              </p>

            </form>

          </div>


          {/* ==================================================
              SIDE PREVIEW
          ================================================== */}

          <aside className="relative hidden overflow-hidden border-l border-white/10 bg-gradient-to-br from-violet-950/40 via-slate-950 to-fuchsia-950/30 lg:block">

            {/* Glow */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_65%)]" />


            <div className="relative flex h-full min-h-[430px] flex-col justify-between p-8">

              {/* Top */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Ready to watch?
                </p>

                <h3 className="mt-4 text-2xl font-black leading-tight">
                  Your friends are waiting.
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Join the room and watch movies
                  together in real time.
                </p>

              </div>


              {/* Center */}

              <div className="flex flex-col items-center py-10">

                <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">

                  <div className="absolute inset-3 rounded-[1.5rem] border border-violet-500/10" />

                  <span className="text-5xl">
                    🎬
                  </span>

                </div>

                <p className="mt-5 text-xs text-slate-600">
                  Synchronized watching
                </p>

              </div>


              {/* Bottom */}

              <div className="space-y-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-xs">
                    ✓
                  </div>

                  <span className="text-sm text-slate-400">
                    Watch together
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-xs">
                    ✓
                  </div>

                  <span className="text-sm text-slate-400">
                    Chat with friends
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-xs">
                    ✓
                  </div>

                  <span className="text-sm text-slate-400">
                    Stay synchronized
                  </span>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </PageContainer>
  );
}

export default JoinRoom;