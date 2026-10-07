"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

import type { MovieSource } from "@/lib/movie-navigation";

type MovieNavigationContextValue = {
  source: MovieSource | null;
  movieId: string | null;
  setMovieNavigation: (movieId: string, source: MovieSource) => void;
};

const MovieNavigationContext =
  createContext<MovieNavigationContextValue | null>(null);

export function MovieNavigationProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<MovieSource | null>(null);
  const [movieId, setMovieId] = useState<string | null>(null);

  return (
    <MovieNavigationContext.Provider
      value={{
        source,
        movieId,
        setMovieNavigation: (nextMovieId, nextSource) => {
          setMovieId(nextMovieId);
          setSource(nextSource);
        },
      }}
    >
      {children}
    </MovieNavigationContext.Provider>
  );
}

export function useMovieNavigation() {
  const context = useContext(MovieNavigationContext);
  if (!context) {
    throw new Error(
      "useMovieNavigation must be used within MovieNavigationProvider",
    );
  }
  return context;
}
