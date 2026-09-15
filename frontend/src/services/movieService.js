
// --------------------------------------------------
// Temporary Movie Catalog
// --------------------------------------------------
//
// This is intentionally local for the MVP.
//
// Later, this can be replaced with a movie API
// without changing the room/movie architecture.
//

const movies = [
  {
    movieId: "movie-001",
    title: "Interstellar",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    movieId: "movie-002",
    title: "The Dark Knight",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    movieId: "movie-003",
    title: "Inception",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    movieId: "movie-004",
    title: "Avengers: Endgame",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

function getMovies() {
  return movies;
}

function getMovieById(movieId) {
  return movies.find(
    (movie) =>
      movie.movieId === movieId
  );
}

const movieService = {
  getMovies,
  getMovieById,
};

export default movieService;

