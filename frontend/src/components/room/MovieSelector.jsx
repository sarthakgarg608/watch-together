import {
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useRoom,
} from "../../context/RoomContext";

import movieService from "../../services/movieService";

function MovieSelector() {
  const {
    user,
  } = useAuth();

  const {
    room,
    selectedMovie,
    selectMovie,
    loading,
  } = useRoom();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectingMovieId,
    setSelectingMovieId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const movies =
    movieService.getMovies();

  // --------------------------------------------------
  // Check Host
  // --------------------------------------------------

  const isHost =
    String(room?.host?._id || room?.host) ===
    String(user?._id);

  // --------------------------------------------------
  // Filter Movies
  // --------------------------------------------------

  const filteredMovies =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return movies;
      }

      return movies.filter(
        (movie) =>
          movie.title
            .toLowerCase()
            .includes(query)
      );
    }, [
      movies,
      search,
    ]);

  // --------------------------------------------------
  // Select Movie
  // --------------------------------------------------

  async function handleSelectMovie(
    movie
  ) {
    if (!isHost) {
      setError(
        "Only the room host can select a movie."
      );

      return;
    }

    setSelectingMovieId(
      movie.movieId
    );

    setError("");

    try {
      await selectMovie(
        movie
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to select movie."
      );
    } finally {
      setSelectingMovieId(
        null
      );
    }
  }

  // --------------------------------------------------
  // Non-host View
  // --------------------------------------------------

  if (!isHost) {
    return (
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-xl shadow-black/10">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-sm">
            🎬
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Now Watching
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-500">
              The host controls movie selection.
            </p>
          </div>
        </div>

        <div className="p-4">
          {selectedMovie ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
              <img
                src={
                  selectedMovie.posterUrl
                }
                alt={
                  selectedMovie.title
                }
                className="h-16 w-11 rounded-lg object-cover shadow-lg"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {selectedMovie.title}
                </p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <p className="text-[10px] font-medium text-emerald-300">
                    Selected by host
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] px-4 py-6 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-lg">
                🍿
              </div>

              <p className="text-xs font-medium text-slate-400">
                Waiting for the host
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                A movie will appear here once selected.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // --------------------------------------------------
  // Host View
  // --------------------------------------------------

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-xl shadow-black/10">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-base">
              🎬
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white sm:text-base">
                  Choose a Movie
                </h2>

                <span className="rounded-full border border-violet-500/15 bg-violet-500/10 px-2 py-0.5 text-[9px] font-semibold text-violet-300">
                  HOST
                </span>
              </div>

              <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                Pick what everyone in the room will watch.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-64">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path
                d="m20 20-4-4"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search movies..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-violet-500/40 focus:bg-white/[0.045] focus:ring-2 focus:ring-violet-500/5"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pt-3 sm:px-5">
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.06] px-3 py-2.5"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[10px] font-bold text-red-400">
              !
            </span>

            <p className="text-[10px] text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Selected Movie */}
      {selectedMovie && (
        <div className="px-4 pt-4 sm:px-5">
          <div className="relative overflow-hidden rounded-xl border border-violet-500/15 bg-gradient-to-r from-violet-500/[0.08] to-fuchsia-500/[0.04] p-3">
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedMovie.posterUrl
                }
                alt={
                  selectedMovie.title
                }
                className="h-14 w-10 rounded-lg object-cover shadow-lg"
              />

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-violet-300">
                  Selected Movie
                </p>

                <p className="mt-1 truncate text-xs font-bold text-white sm:text-sm">
                  {selectedMovie.title}
                </p>
              </div>

              <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/[0.06] px-2.5 py-1.5 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[9px] font-semibold text-emerald-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="p-4 sm:p-5">
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map(
              (movie) => {
                const isSelected =
                  selectedMovie?.movieId ===
                  movie.movieId;

                const isSelecting =
                  selectingMovieId ===
                  movie.movieId;

                return (
                  <button
                    key={
                      movie.movieId
                    }
                    type="button"
                    onClick={() =>
                      handleSelectMovie(
                        movie
                      )
                    }
                    disabled={
                      loading ||
                      selectingMovieId !==
                        null
                    }
                    className={`group relative overflow-hidden rounded-xl border text-left outline-none transition-all duration-300 ${
                      isSelected
                        ? "border-violet-500/50 bg-violet-500/[0.08] shadow-lg shadow-violet-500/10"
                        : "border-white/[0.07] bg-white/[0.02] hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-black/20"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                      <img
                        src={
                          movie.posterUrl
                        }
                        alt={
                          movie.title
                        }
                        className={`h-full w-full object-cover transition duration-500 ${
                          isSelected
                            ? "scale-[1.02]"
                            : "group-hover:scale-105"
                        }`}
                      />

                      {/* Gradient */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Selected badge */}
                      {isSelected && (
                        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-500/90 px-2 py-1 shadow-lg backdrop-blur-md">
                          <span className="text-[9px] font-bold text-white">
                            ✓
                          </span>

                          <span className="text-[9px] font-bold text-white">
                            Selected
                          </span>
                        </div>
                      )}

                      {/* Hover overlay */}
                      {!isSelected &&
                        !isSelecting && (
                          <div className="absolute inset-0 flex items-center justify-center bg-violet-950/0 transition duration-300 group-hover:bg-violet-950/40">
                            <span className="flex h-10 w-10 scale-75 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                              ▶
                            </span>
                          </div>
                        )}

                      {/* Loading */}
                      {isSelecting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />

                            <span className="text-[9px] font-medium text-white">
                              Selecting...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-3">
                      <p className="truncate text-[11px] font-semibold text-white sm:text-xs">
                        {movie.title}
                      </p>

                      <p
                        className={`mt-1 text-[9px] ${
                          isSelected
                            ? "text-violet-300"
                            : "text-slate-600"
                        }`}
                      >
                        {isSelected
                          ? "Currently selected"
                          : "Click to watch"}
                      </p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-xl">
              🔎
            </div>

            <p className="text-sm font-semibold text-slate-300">
              No movies found
            </p>

            <p className="mt-1 text-[10px] text-slate-600">
              Try searching with a different movie title.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-2.5 sm:px-5">
        <p className="text-[9px] text-slate-600">
          Selecting a movie will update the room for everyone.
        </p>
      </div>
    </section>
  );
}

export default MovieSelector;

