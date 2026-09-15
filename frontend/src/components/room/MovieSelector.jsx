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
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        <p className="text-xs text-slate-500">
          The host controls movie selection.
        </p>

        {selectedMovie && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={
                selectedMovie.posterUrl
              }
              alt={
                selectedMovie.title
              }
              className="h-14 w-10 rounded-lg object-cover"
            />

            <div>
              <p className="text-xs font-semibold text-white">
                {selectedMovie.title}
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Currently selected
              </p>
            </div>
          </div>
        )}
      </section>
    );
  }

  // --------------------------------------------------
  // Host View
  // --------------------------------------------------

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">
            Choose a Movie
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Select what everyone in the room will watch.
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search movies..."
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-violet-500/40 sm:w-48"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-[10px] text-red-400"
        >
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                className={`group overflow-hidden rounded-xl border text-left transition ${
                  isSelected
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-violet-500/30 hover:bg-white/[0.04]"
                }`}
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                  <img
                    src={
                      movie.posterUrl
                    }
                    alt={
                      movie.title
                    }
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-violet-950/50">
                      <span className="rounded-full bg-violet-500 px-3 py-1.5 text-[10px] font-bold text-white">
                        Selected
                      </span>
                    </div>
                  )}

                  {isSelecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="truncate text-xs font-semibold text-white">
                    {movie.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {isSelected
                      ? "Currently playing"
                      : "Click to select"}
                  </p>
                </div>
              </button>
            );
          }
        )}
      </div>

      {filteredMovies.length ===
        0 && (
        <div className="py-8 text-center">
          <p className="text-xs text-slate-500">
            No movies found.
          </p>
        </div>
      )}
    </section>
  );
}

export default MovieSelector;

