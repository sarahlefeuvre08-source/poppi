"use client";

import { BackButton } from "@/components/navigation/back-button";
import { useMovieNavigation } from "@/components/providers/movie-navigation-provider";
import type { MovieSource } from "@/lib/movie-navigation";

export function MovieDetailsBackButton({
  fallbackSource,
  movieId,
}: {
  fallbackSource: MovieSource;
  movieId: string;
}) {
  const navigation = useMovieNavigation();
  const source = navigation.movieId === movieId ? navigation.source : null;
  return <BackButton href={source ?? fallbackSource} />;
}
