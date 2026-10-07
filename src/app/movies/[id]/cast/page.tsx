import Image from "next/image";
import { notFound } from "next/navigation";

import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { getMovieById } from "@/data/movies";
import {
  getActorAnchor,
  getMovieDetailsHref,
  getMovieSource,
} from "@/lib/movie-navigation";

export default async function FullCastPlaceholder({
  params,
  searchParams,
}: PageProps<"/movies/[id]/cast">) {
  const { id } = await params;
  const query = await searchParams;
  const source = getMovieSource(query.from);
  const movie = getMovieById(id);

  if (!movie?.actors?.length) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5 pb-5">
      <SettingsPageHeader
        backHref={getMovieDetailsHref(movie.id, source)}
        title="Actors"
        description={movie.title}
      />

      <main aria-label={`${movie.title} cast`} className="flex flex-col">
        {movie.actors.map((actor, index) => (
          <article
            id={getActorAnchor(actor.name)}
            key={actor.name}
            className={`flex scroll-mt-5 items-center gap-4 py-4 ${index > 0 ? "border-t border-white/10" : ""}`}
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface">
              <Image
                src={actor.imageSrc}
                alt={actor.name}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white">
                {actor.name}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {actor.character}
              </p>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
