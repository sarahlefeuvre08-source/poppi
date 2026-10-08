"use client";

import Image from "next/image";
import Link from "next/link";

import { MovieActions } from "@/components/movies/movie-actions";
import { MovieMetadata } from "@/components/movies/movie-metadata";
import { MoviePoster } from "@/components/movies/movie-poster";
import { MovieDetailsBackButton } from "@/components/navigation/movie-details-back-button";
import { useI18n } from "@/i18n/provider";
import { getMovieCastHref, type MovieSource } from "@/lib/movie-navigation";
import type { Movie } from "@/types/movie";

export function MovieDetailsPageContent({ movie, source }: { movie: Movie; source: MovieSource }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-5 pb-5">
      <header><MovieDetailsBackButton fallbackSource={source} movieId={movie.id} /></header>
      <article>
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_55px_rgba(0,0,0,0.38)]">
          <MoviePoster title={movie.title} src={movie.posterSrc} priority landscape />
        </div>
        <h1 className="mt-4 text-[1.8rem] leading-none font-bold tracking-[-0.04em]">{movie.title}</h1>
        <div className="mt-3"><MovieMetadata movie={movie} /></div>
        <div className="mt-4"><MovieActions movieId={movie.id} title={movie.title} /></div>
      </article>
      {movie.synopsis && (
        <section aria-labelledby="synopsis-heading">
          <h2 id="synopsis-heading" className="text-lg font-bold">{t("movie.synopsis")}</h2>
          <p className="mt-1.5 text-sm leading-[1.35] text-white/90">{movie.synopsis}</p>
        </section>
      )}
      {movie.actors && movie.actors.length > 0 && (
        <section aria-labelledby="actors-heading">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="actors-heading" className="text-lg font-bold">{t("movie.actors")}</h2>
            <Link href={getMovieCastHref(movie.id, source)} className="secondary-text-action shrink-0 rounded-sm text-xs font-medium">
              <span aria-hidden="true">→</span> {t("movie.seeAll")}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {movie.actors.slice(0, 3).map((actor) => (
              <article key={actor.name} className="min-w-0 text-center">
                <div className="relative mx-auto aspect-square w-full max-w-28 overflow-hidden rounded-full bg-surface">
                  <Image src={actor.imageSrc} alt={actor.name} fill sizes="(max-width: 416px) calc((100vw - 4rem) / 3), 112px" className="object-cover object-top" />
                </div>
                <h3 className="mt-2 text-sm leading-4 font-semibold">{actor.name}</h3>
                <p className="mt-1 text-xs text-text-secondary">{actor.character}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      <section aria-labelledby="watch-heading">
        <h2 id="watch-heading" className="text-lg font-bold">{t("movie.whereToWatch")}</h2>
        <button type="button" className="mt-3 flex min-h-14 w-full items-center justify-center rounded-full bg-accent px-6 text-base font-bold text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Prime Video</button>
      </section>
    </div>
  );
}
