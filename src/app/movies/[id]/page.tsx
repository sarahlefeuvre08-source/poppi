import { notFound } from "next/navigation";

import { MovieDetailsPageContent } from "@/components/movies/movie-details-page";
import { getMovieById } from "@/data/movies";
import { getMovieSource } from "@/lib/movie-navigation";

export default async function MovieDetailsPage({ params, searchParams }: PageProps<"/movies/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const movie = getMovieById(id);
  if (!movie) notFound();
  return <MovieDetailsPageContent movie={movie} source={getMovieSource(query.from)} />;
}
