import { useState } from "react";

const movies = [
  {
    id: "movie-1",
    title: "Nature Escape",
    year: 2024,
    genre: "Documentary",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "movie-2",
    title: "Night Adventure",
    year: 2025,
    genre: "Adventure",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "movie-3",
    title: "The Journey",
    year: 2026,
    genre: "Drama",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

function MovieSelector({ selectedMovie, onSelect }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (movie) => {
    onSelect?.(movie);
    setOpen(false);
  };

  return (
    <div className="relative z-40">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#080a13]/90 px-2.5 py-2 shadow-2xl backdrop-blur-xl transition hover:border-violet-500/30 hover:bg-[#0b0d18]"
      >
        {selectedMovie ? (
          <img
            src={selectedMovie.image}
            alt=""
            className="h-9 w-9 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            ▶
          </div>
        )}

        <div className="hidden min-w-0 text-left sm:block">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">
            Watching
          </p>

          <p className="max-w-32 truncate text-xs font-bold text-white">
            {selectedMovie?.title || "Select movie"}
          </p>
        </div>

        <span
          className={`px-1 text-xs text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[-1] cursor-default bg-transparent"
            aria-label="Close movie selector"
          />

          <div className="absolute left-0 top-[calc(100%+8px)] w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#080a13]/98 shadow-2xl shadow-black/50 backdrop-blur-2xl">
            <div className="border-b border-white/[0.08] px-4 py-3">
              <p className="text-sm font-bold text-white">
                Choose what to watch
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Everyone in the room will eventually see the same movie.
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {movies.map((movie) => {
                const isSelected = selectedMovie?.id === movie.id;

                return (
                  <button
                    type="button"
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                      isSelected
                        ? "bg-violet-500/10 ring-1 ring-violet-500/20"
                        : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-12 w-20 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white">
                        {movie.title}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {movie.year} · {movie.genre}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-xs text-violet-300">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MovieSelector;