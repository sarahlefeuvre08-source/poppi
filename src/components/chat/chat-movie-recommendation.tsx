"use client";

import Image from "next/image";

import { BookmarkIcon } from "@/components/icons/bookmark-icon";
import { MovieDetailsLink } from "@/components/navigation/movie-details-link";
import { useMovieLibrary } from "@/components/providers/movie-library-provider";
import { useI18n } from "@/i18n/provider";
import type { Movie } from "@/types/movie";

export function ChatMovieRecommendation({ movie }: { movie: Movie }) {
  const { isInWatchlist, toggleWatchlist } = useMovieLibrary();
  const isSaved = isInWatchlist(movie.id);
  const { formatGenre, formatMovieRuntime, t } = useI18n();

  return (
    <article className="mt-3 overflow-hidden rounded-[1.4rem] border border-white/12 bg-[#202020]/95 shadow-xl">
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-start gap-2 p-2.5 min-[360px]:grid-cols-[6.4rem_minmax(0,1fr)] min-[360px]:gap-3 min-[360px]:p-3">
        <div className="relative aspect-[2/3] w-full self-start overflow-hidden rounded-xl bg-black/20 min-[360px]:aspect-[3/4]">
          <Image
            src={movie.posterSrc}
            alt={t("movie.posterAlt", { title: movie.title })}
            fill
            sizes="102px"
            className="object-contain min-[360px]:object-cover"
          />
        </div>
        <div className="min-w-0 py-0.5 min-[360px]:py-1">
          <h3 className="break-words text-base leading-tight font-bold min-[360px]:text-lg">
            {movie.title}
          </h3>
          <p className="mt-1.5 text-xs text-white/75 min-[360px]:mt-2 min-[360px]:text-sm">
            {formatMovieRuntime(movie.runtimeMinutes)} <span className="px-1 text-white/40">|</span>{" "}
            {movie.year}
          </p>
          <p className="mt-1 break-words text-xs text-white/75 min-[360px]:text-sm">
            {movie.genres.map(formatGenre).join(", ")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold min-[360px]:mt-3 min-[360px]:gap-2">
            <span className="rounded-sm bg-[#f5c518] px-1 py-0.5 font-black tracking-[-0.06em] text-ink">
              IMDb
            </span>
            <span>{movie.imdbRating.toFixed(1)} ★</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-2.5 pb-2.5 min-[360px]:px-3 min-[360px]:pb-3">
        <MovieDetailsLink
          movieId={movie.id}
          source="/poppi"
          ariaLabel={t("movie.viewDetails", { title: movie.title })}
          className="poppi-control flex min-h-11 flex-1 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-white focus-visible:outline-white"
        >
          {t("common.movieDetails")}
        </MovieDetailsLink>
        <button
          type="button"
          aria-label={
            isSaved
              ? t("movie.removeWatchlistAria", { title: movie.title })
              : t("movie.addWatchlistAria", { title: movie.title })
          }
          aria-pressed={isSaved}
          onClick={() => toggleWatchlist(movie.id)}
          className={`bookmark-control poppi-control grid h-11 w-11 shrink-0 place-items-center rounded-full border-[0.5px] ${isSaved ? "border-accent bg-accent text-white" : "border-white/30 bg-white/5 text-white"}`}
        >
          <BookmarkIcon filled={isSaved} />
        </button>
      </div>
    </article>
  );
}
