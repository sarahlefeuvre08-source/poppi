import type { Movie } from "@/types/movie";

type MovieMetadataProps = {
  movie: Pick<
    Movie,
    "runtime" | "year" | "genres" | "imdbRating" | "director"
  >;
};

export function MovieMetadata({ movie }: MovieMetadataProps) {
  return (
    <div className="space-y-3 text-text-primary">
      <p className="text-base leading-5 text-text-secondary">
        {movie.runtime} <span className="px-1 text-white/45">·</span>{" "}
        {movie.year} <span className="px-1 text-white/45">·</span>{" "}
        {movie.genres.join(", ")}
      </p>
      <p className="text-sm leading-5 text-text-secondary">
        Directed by <span className="font-medium text-white">{movie.director}</span>
      </p>
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        <span className="rounded-sm bg-[#f5c518] px-1 py-0.5 font-black tracking-[-0.06em] text-ink">
          IMDb
        </span>
        <span>
          {movie.imdbRating.toFixed(1)} <span className="text-[#f5c518]">★</span>
        </span>
      </div>
    </div>
  );
}
