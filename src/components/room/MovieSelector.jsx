// MovieSelector.jsx
// ------------------------------------------------------
// Allows the user to select a movie.
//
// Currently movies are temporary frontend data.
// Later they will come from our backend/API.
// ------------------------------------------------------

function MovieSelector({ onMovieSelect }) {
  const movies = [
    {
      id: 1,
      title: "Sample Movie",
      videoUrl:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: "",
    },
  ];

  return (
    <section className="movie-selector">
      <h2>Select Movie</h2>

      <div className="movie-list">
        {movies.map((movie) => (
          <article key={movie.id}>
            <div className="movie-thumbnail">
              {movie.thumbnail ? (
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                />
              ) : (
                <span>Movie</span>
              )}
            </div>

            <h3>{movie.title}</h3>

            <button
              type="button"
              onClick={() => onMovieSelect(movie)}
            >
              Select
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MovieSelector;