"use client";

import { MovieActions } from "@/components/movies/movie-actions";
import { MovieMetadata } from "@/components/movies/movie-metadata";
import { MoviePoster } from "@/components/movies/movie-poster";
import { MovieDetailsLink } from "@/components/navigation/movie-details-link";
import type { Movie } from "@/types/movie";
import { useI18n } from "@/i18n/provider";

type TodayMovieProps = {
  movie: Movie;
};

export function TodayMovie({ movie }: TodayMovieProps) {
  const { t } = useI18n();
  return (
    <section aria-labelledby="today-movie-heading">
      <div className="mb-3">
        <h2
          id="today-movie-heading"
          className="text-[1.4rem] font-bold tracking-[-0.035em]"
        >
          {t("home.todayTitle")}
        </h2>
        <p className="mt-1 max-w-sm text-sm leading-[1.3] text-text-secondary">
          {t("home.todayReason")}
        </p>
      </div>

      <MovieDetailsLink
        movieId={movie.id}
        source="/"
        ariaLabel={t("movie.viewDetails", { title: movie.title })}
        className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.38)]">
          <MoviePoster
            title={movie.title}
            src={movie.posterSrc}
            priority
            landscape
          />
        </div>

        <h3 className="today-movie-title mt-3 text-[1.7rem] leading-none font-bold tracking-[-0.04em]">
          {movie.title}
        </h3>
        <div className="mt-3">
          <MovieMetadata movie={movie} />
        </div>
      </MovieDetailsLink>

      <div className="mt-4">
        <MovieActions
          movieId={movie.id}
          title={movie.title}
          animateStateChange
        />
      </div>
    </section>
  );
}
