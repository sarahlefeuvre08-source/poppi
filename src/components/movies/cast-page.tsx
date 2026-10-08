"use client";

import Image from "next/image";

import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { useI18n } from "@/i18n/provider";
import { getActorAnchor, getMovieDetailsHref, type MovieSource } from "@/lib/movie-navigation";
import type { Movie } from "@/types/movie";

export function CastPage({ movie, source }: { movie: Movie & { actors: NonNullable<Movie["actors"]> }; source: MovieSource }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-5 pb-5">
      <SettingsPageHeader backHref={getMovieDetailsHref(movie.id, source)} title={t("movie.actors")} description={movie.title} />
      <main aria-label={t("movie.castAria", { title: movie.title })} className="flex flex-col">
        {movie.actors.map((actor, index) => (
          <article id={getActorAnchor(actor.name)} key={actor.name} className={`flex scroll-mt-5 items-center gap-4 py-4 ${index > 0 ? "border-t border-white/10" : ""}`}>
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface">
              <Image src={actor.imageSrc} alt={actor.name} fill sizes="80px" className="object-cover object-top" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white">{actor.name}</h2>
              <p className="mt-1 text-sm text-text-secondary">{actor.character}</p>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
