"use client";

import { BookmarkIcon } from "@/components/icons/bookmark-icon";
import { useMovieLibrary } from "@/components/providers/movie-library-provider";

type MovieActionsProps = {
  animateStateChange?: boolean;
  movieId: string;
  title: string;
};

export function MovieActions({
  animateStateChange = false,
  movieId,
  title,
}: MovieActionsProps) {
  const { isInWatchlist, isWatched, toggleWatched, toggleWatchlist } =
    useMovieLibrary();
  const watched = isWatched(movieId);
  const inWatchlist = isInWatchlist(movieId);

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        aria-pressed={watched}
        aria-label={watched ? `Remove ${title} from watched` : `Mark ${title} as watched`}
        onClick={() => toggleWatched(movieId)}
        className={`poppi-control flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold ${animateStateChange ? "watched-toggle" : ""} ${watched ? "border-accent bg-accent text-white" : "border-white bg-white text-ink"}`}
      >
        {watched ? (
          <svg
            key="watched-icon"
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${animateStateChange ? "watched-toggle__content" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : (
          <svg
            key="unwatched-icon"
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${animateStateChange ? "watched-toggle__content" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        )}
        <span
          key={watched ? "watched-label" : "unwatched-label"}
          className={animateStateChange ? "watched-toggle__content" : ""}
        >
          {watched ? "Watched" : "Mark as watched"}
        </span>
      </button>
      <button
        type="button"
        aria-label={
          inWatchlist
            ? `Remove ${title} from watchlist`
            : `Add ${title} to watchlist`
        }
        aria-pressed={inWatchlist}
        onClick={() => toggleWatchlist(movieId)}
        className={`bookmark-control poppi-control grid h-10 w-10 shrink-0 place-items-center rounded-full border-[0.5px] text-white ${inWatchlist ? "border-accent bg-accent" : "border-white/25 bg-surface"}`}
      >
        <BookmarkIcon filled={inWatchlist} />
      </button>
    </div>
  );
}
