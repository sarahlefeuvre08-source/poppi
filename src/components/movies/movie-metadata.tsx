"use client";

import type { Movie } from "@/types/movie";
import { useI18n } from "@/i18n/provider";

type MovieMetadataProps = {
  movie: Pick<
    Movie,
    "runtimeMinutes" | "year" | "genres" | "imdbRating" | "director"
  >;
};

export function MovieMetadata({ movie }: MovieMetadataProps) {
  const { formatGenre, formatMovieRuntime, t } = useI18n();
  return (
    <div className="space-y-3 text-text-primary">
      <p className="text-base leading-5 text-text-secondary">
        {formatMovieRuntime(movie.runtimeMinutes)} <span className="px-1 text-white/45">·</span>{" "}
        {movie.year} <span className="px-1 text-white/45">·</span>{" "}
        {movie.genres.map(formatGenre).join(", ")}
      </p>
      <p className="text-sm leading-5 text-text-secondary">
        {t("movie.directedBy")} <span className="font-medium text-white">{movie.director}</span>
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
