"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useMovieNavigation } from "@/components/providers/movie-navigation-provider";
import {
  getMovieDetailsHref,
  type MovieSource,
} from "@/lib/movie-navigation";

type MovieDetailsLinkProps = {
  movieId: string;
  source: MovieSource;
  children: ReactNode;
  className: string;
  ariaLabel: string;
};

export function MovieDetailsLink({
  movieId,
  source,
  children,
  className,
  ariaLabel,
}: MovieDetailsLinkProps) {
  const { setMovieNavigation } = useMovieNavigation();

  return (
    <Link
      href={getMovieDetailsHref(movieId, source)}
      data-movie-id={movieId}
      aria-label={ariaLabel}
      onClick={() => setMovieNavigation(movieId, source)}
      className={className}
    >
      {children}
    </Link>
  );
}
