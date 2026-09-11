// MovieSelector.jsx
// ------------------------------------------------------
// Allows the user to select a movie.
//
// When movie changes:
// - selectedMovie changes
// - playback automatically resets
// - currentTime becomes 0
// - duration becomes 0
// - video pauses
//
// Later this selection will be synchronized through
// Socket.IO so all participants get the same movie.
// ------------------------------------------------------

import { useRoom } from "../../context/RoomContext";

const MOVIES = [
  {
    id: "movie-1",
    title: "Inception",
    year: 2010,
    duration: "2h 28m",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
  },

  {
    id: "movie-2",
    title: "Big Buck Bunny",
    year: 2008,
    duration: "9m",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
  },

  {
    id: "movie-3",
    title: "Watch Together Demo",
    year: 2026,
    duration: "Demo",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

function MovieSelector() {
  const {
    selectedMovie,
    setSelectedMovie,
  } = useRoom();

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <section className="movie-selector">

      <h2>
        Select Movie
      </h2>

      <div className="movie-list">

        {MOVIES.map((movie) => {

          const isSelected =
            selectedMovie?.id === movie.id;

          return (
            <button
              key={movie.id}
              type="button"
              onClick={() =>
                handleMovieSelect(movie)
              }
              aria-pressed={
                isSelected
              }
              data-selected={
                isSelected
              }
            >

              <strong>
                {movie.title}
              </strong>

              <span>
                {movie.year}
              </span>

              <span>
                {movie.duration}
              </span>

            </button>
          );
        })}

      </div>

      {!selectedMovie && (
        <p>
          Select a movie to start watching.
        </p>
      )}

    </section>
  );
}

export default MovieSelector;