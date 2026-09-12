// CreateRoom.jsx
// ------------------------------------------------------
// Creates a new watch room.
//
// Backend:
// - Uses roomService.createRoom()
// - Keeps existing room creation flow
//
// UI:
// - Premium cinematic design
// - Glassmorphism
// - Room preview panel
// - Access type cards
// - Responsive layout
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

function CreateRoom() {
  const navigate = useNavigate();

  const {
    setRoom,
    setParticipants,
  } = useRoom();

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [accessType, setAccessType] =
    useState("private");

  const [maxParticipants, setMaxParticipants] =
    useState(5);

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();

    if (!cleanName) {
      setError(
        "Room name is required."
      );
      return;
    }

    if (
      Number(maxParticipants) < 2 ||
      Number(maxParticipants) > 20
    ) {
      setError(
        "Participants must be between 2 and 20."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response =
        await roomService.createRoom({
          name: cleanName,
          description:
            description.trim(),
          accessType,
          maxParticipants:
            Number(maxParticipants),
        });

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          "Room creation failed."
        );
      }

      const createdRoom =
        response.data;

      setRoom(createdRoom);

      setParticipants([
        {
          id: "current-user",
          name: "You",
          role: "host",
          status: "active",
        },
      ]);

      navigate(
        `/rooms/${createdRoom.roomCode}`
      );

    } catch (error) {
      console.error(
        "Create room failed:",
        error
      );

      setError(
        "Unable to create room."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6 lg:py-14">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-[-150px] top-[-100px] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="absolute right-[-150px] top-1/3 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[140px]" />

      </div>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-10 max-w-2xl">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Watch Party
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Create your room
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Set up your watch room, invite your friends,
            and enjoy the movie together.
          </p>

        </div>


        {/* ==================================================
            TWO COLUMN LAYOUT
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ==================================================
              FORM CARD
          ================================================== */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >

              {/* Error */}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}


              {/* Room name */}

              <Input
                id="room-name"
                label="Room Name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Friday Movie Night"
                required
                maxLength={100}
              />


              {/* Description */}

              <div className="space-y-2">

                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-200"
                >
                  Description
                  <span className="ml-1 text-slate-600">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Movie night with friends..."
                  maxLength={500}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 hover:border-white/20 focus:border-violet-500 focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
                />

                <div className="text-right text-xs text-slate-600">
                  {description.length}/500
                </div>

              </div>


              {/* Access type */}

              <div className="space-y-3">

                <label className="block text-sm font-medium text-slate-200">
                  Who can join?
                </label>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Private */}

                  <button
                    type="button"
                    onClick={() =>
                      setAccessType("private")
                    }
                    className={`rounded-2xl border p-4 text-left transition duration-300 ${
                      accessType === "private"
                        ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-950/20"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
                        🔒
                      </div>

                      <div
                        className={`h-4 w-4 rounded-full border ${
                          accessType === "private"
                            ? "border-violet-400 bg-violet-500 ring-4 ring-violet-500/10"
                            : "border-slate-600"
                        }`}
                      />

                    </div>

                    <p className="font-semibold">
                      Private
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Only people with your room invite
                      can join.
                    </p>

                  </button>


                  {/* Public */}

                  <button
                    type="button"
                    onClick={() =>
                      setAccessType("public")
                    }
                    className={`rounded-2xl border p-4 text-left transition duration-300 ${
                      accessType === "public"
                        ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-950/20"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-lg">
                        🌎
                      </div>

                      <div
                        className={`h-4 w-4 rounded-full border ${
                          accessType === "public"
                            ? "border-violet-400 bg-violet-500 ring-4 ring-violet-500/10"
                            : "border-slate-600"
                        }`}
                      />

                    </div>

                    <p className="font-semibold">
                      Public
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Anyone with the room code can
                      join.
                    </p>

                  </button>

                </div>

              </div>


              {/* Participants */}

              <Input
                id="max-participants"
                label="Maximum Participants"
                type="number"
                value={maxParticipants}
                onChange={(event) =>
                  setMaxParticipants(
                    event.target.value
                  )
                }
                min="2"
                max="20"
                required
              />


              {/* Submit */}

              <div className="pt-2">

                <Button
                  type="submit"
                  loading={isLoading}
                >
                  Create Room
                </Button>

              </div>

            </form>

          </div>


          {/* ==================================================
              PREVIEW CARD
          ================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl">

              {/* Preview */}

              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-950 via-slate-950 to-fuchsia-950">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),transparent_60%)]" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-3xl shadow-2xl backdrop-blur-xl">
                  🎬
                </div>

              </div>


              {/* Preview details */}

              <div className="p-6">

                <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                  Room Preview
                </p>

                <h2 className="mt-3 truncate text-xl font-bold">
                  {name.trim() ||
                    "Your Movie Night"}
                </h2>

                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {description.trim() ||
                    "Your room description will appear here."}
                </p>


                {/* Details */}

                <div className="mt-6 space-y-3 border-t border-white/5 pt-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Access
                    </span>

                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium capitalize text-violet-300">
                      {accessType}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Capacity
                    </span>

                    <span className="text-sm font-medium text-slate-300">
                      {maxParticipants || 0} people
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </PageContainer>
  );
}

export default CreateRoom;