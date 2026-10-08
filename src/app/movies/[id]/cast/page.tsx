import { notFound } from "next/navigation";

import { CastPage } from "@/components/movies/cast-page";
import { getMovieById } from "@/data/movies";
import { getMovieSource } from "@/lib/movie-navigation";

export default async function FullCastPage({ params, searchParams }: PageProps<"/movies/[id]/cast">) {
  const { id } = await params;
  const query = await searchParams;
  const movie = getMovieById(id);
  if (!movie?.actors?.length) notFound();
  return <CastPage movie={{ ...movie, actors: movie.actors }} source={getMovieSource(query.from)} />;
}
