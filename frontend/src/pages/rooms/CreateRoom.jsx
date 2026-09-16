import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRoom } from "../../context/RoomContext";

function CreateRoom() {
  const navigate = useNavigate();

  const {
    createRoom,
    loading,
  } = useRoom();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxParticipants: 5,
    accessType: "private",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      const room = await createRoom({
        name: formData.name,
        description: formData.description,
        maxParticipants: Number(
          formData.maxParticipants
        ),
        accessType: formData.accessType,
      });

      navigate(`/rooms/${room.roomCode}`);
    } catch (error) {
      setError(
        error.message ||
          "Unable to create room."
      );
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl shadow-lg shadow-cyan-500/5">
            🎬
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create a Room
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Create your watch party, customize the
            room, and invite your friends to watch
            together.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300"
            >
              <span className="mt-0.5">
                ⚠
              </span>

              <p>{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* Room name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Room Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                maxLength={100}
                required
                placeholder="e.g. Friday Movie Night"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-white/20 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Give your watch party a memorable
                name.
              </p>
            </div>

            {/* Description */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-200"
                >
                  Description
                </label>

                <span className="text-xs text-slate-500">
                  {formData.description.length}/500
                </span>
              </div>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                placeholder="Tell your friends what you're planning to watch..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-white/20 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {/* Settings */}
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Maximum participants */}
              <div>
                <label
                  htmlFor="maxParticipants"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Maximum Participants
                </label>

                <div className="relative">
                  <select
                    id="maxParticipants"
                    name="maxParticipants"
                    value={
                      formData.maxParticipants
                    }
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 pr-10 text-sm text-white outline-none transition duration-200 hover:border-white/20 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                  >
                    <option
                      value={2}
                      className="bg-slate-900"
                    >
                      2 people
                    </option>

                    <option
                      value={3}
                      className="bg-slate-900"
                    >
                      3 people
                    </option>

                    <option
                      value={4}
                      className="bg-slate-900"
                    >
                      4 people
                    </option>

                    <option
                      value={5}
                      className="bg-slate-900"
                    >
                      5 people
                    </option>

                    <option
                      value={6}
                      className="bg-slate-900"
                    >
                      6 people
                    </option>

                    <option
                      value={7}
                      className="bg-slate-900"
                    >
                      7 people
                    </option>

                    <option
                      value={8}
                      className="bg-slate-900"
                    >
                      8 people
                    </option>

                    <option
                      value={9}
                      className="bg-slate-900"
                    >
                      9 people
                    </option>

                    <option
                      value={10}
                      className="bg-slate-900"
                    >
                      10 people
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Choose how many people can join.
                </p>
              </div>

              {/* Access type */}
              <div>
                <label
                  htmlFor="accessType"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Room Access
                </label>

                <div className="relative">
                  <select
                    id="accessType"
                    name="accessType"
                    value={formData.accessType}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 pr-10 text-sm text-white outline-none transition duration-200 hover:border-white/20 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/10"
                  >
                    <option
                      value="private"
                      className="bg-slate-900"
                    >
                      Private
                    </option>

                    <option
                      value="public"
                      className="bg-slate-900"
                    >
                      Public
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Private rooms require an invite.
                </p>
              </div>
            </div>

            {/* Room info */}
            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 text-cyan-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                    <path
                      strokeLinecap="round"
                      d="M12 11v5"
                    />
                    <path
                      strokeLinecap="round"
                      d="M12 8h.01"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Ready to watch together?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    After creating the room, you'll
                    be taken directly to your watch
                    party where you can invite your
                    friends.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-300 transition duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition duration-200 hover:bg-slate-200 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Creating Room...
                  </>
                ) : (
                  <>
                    Create Room

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13 6 6 6-6 6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs text-slate-600">
          You can invite your friends after the
          room has been created.
        </p>
      </div>
    </main>
  );
}

export default CreateRoom;

