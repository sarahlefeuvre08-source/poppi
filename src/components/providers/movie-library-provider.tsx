"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { movieCatalog } from "@/data/movies";

type MovieLibraryContextValue = {
  isWatched: (movieId: string) => boolean;
  toggleWatched: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  toggleWatchlist: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
  toggleFavorite: (movieId: string) => void;
};

type MovieLibraryState = {
  watchedIds: Set<string>;
  watchlistIds: Set<string>;
  favoriteIds: Set<string>;
};

type StoredMovieLibrary = {
  watchedIds: string[];
  watchlistIds: string[];
  favoriteIds: string[];
};

const storageKey = "poppi-movie-library-v1";

const MovieLibraryContext = createContext<MovieLibraryContextValue | null>(null);

function createDefaultLibrary(): MovieLibraryState {
  const watchedIds = new Set(
    movieCatalog.filter((movie) => movie.watched).map((movie) => movie.id),
  );

  return {
    watchedIds,
    watchlistIds: new Set(
      movieCatalog
        .filter((movie) => movie.inWatchlist && !watchedIds.has(movie.id))
        .map((movie) => movie.id),
    ),
    favoriteIds: new Set(
      movieCatalog
        .filter((movie) => movie.favorite && watchedIds.has(movie.id))
        .map((movie) => movie.id),
    ),
  };
}

function normalizeLibrary(library: MovieLibraryState): MovieLibraryState {
  return {
    watchedIds: library.watchedIds,
    watchlistIds: new Set(
      [...library.watchlistIds].filter((id) => !library.watchedIds.has(id)),
    ),
    favoriteIds: new Set(
      [...library.favoriteIds].filter((id) => library.watchedIds.has(id)),
    ),
  };
}

function persistLibrary(library: MovieLibraryState) {
  const stored: StoredMovieLibrary = {
    watchedIds: [...library.watchedIds],
    watchlistIds: [...library.watchlistIds],
    favoriteIds: [...library.favoriteIds],
  };
  window.localStorage.setItem(storageKey, JSON.stringify(stored));
}

function readStoredLibrary(): MovieLibraryState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return createDefaultLibrary();

    const parsed = JSON.parse(stored) as Partial<StoredMovieLibrary>;
    return normalizeLibrary({
      watchedIds: new Set(parsed.watchedIds ?? []),
      watchlistIds: new Set(parsed.watchlistIds ?? []),
      favoriteIds: new Set(parsed.favoriteIds ?? []),
    });
  } catch {
    return createDefaultLibrary();
  }
}

export function MovieLibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<MovieLibraryState>(createDefaultLibrary);

  useEffect(() => {
    const storedLibrary = readStoredLibrary();
    persistLibrary(storedLibrary);
    // Loading after hydration keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLibrary(storedLibrary);
  }, []);

  const value = useMemo<MovieLibraryContextValue>(
    () => ({
      isWatched: (movieId) => library.watchedIds.has(movieId),
      toggleWatched: (movieId) => {
        setLibrary((current) => {
          const watchedIds = new Set(current.watchedIds);
          const watchlistIds = new Set(current.watchlistIds);
          const favoriteIds = new Set(current.favoriteIds);

          if (watchedIds.has(movieId)) {
            watchedIds.delete(movieId);
            favoriteIds.delete(movieId);
          } else {
            watchedIds.add(movieId);
            watchlistIds.delete(movieId);
          }

          const next = { watchedIds, watchlistIds, favoriteIds };
          persistLibrary(next);
          return next;
        });
      },
      isInWatchlist: (movieId) => library.watchlistIds.has(movieId),
      toggleWatchlist: (movieId) => {
        setLibrary((current) => {
          if (current.watchedIds.has(movieId)) return current;

          const watchlistIds = new Set(current.watchlistIds);
          if (watchlistIds.has(movieId)) watchlistIds.delete(movieId);
          else watchlistIds.add(movieId);
          const next = { ...current, watchlistIds };
          persistLibrary(next);
          return next;
        });
      },
      isFavorite: (movieId) => library.favoriteIds.has(movieId),
      toggleFavorite: (movieId) => {
        setLibrary((current) => {
          if (!current.watchedIds.has(movieId)) return current;

          const favoriteIds = new Set(current.favoriteIds);
          if (favoriteIds.has(movieId)) favoriteIds.delete(movieId);
          else favoriteIds.add(movieId);
          const next = { ...current, favoriteIds };
          persistLibrary(next);
          return next;
        });
      },
    }),
    [library],
  );

  return (
    <MovieLibraryContext.Provider value={value}>
      {children}
    </MovieLibraryContext.Provider>
  );
}

export function useMovieLibrary() {
  const context = useContext(MovieLibraryContext);
  if (!context) {
    throw new Error("useMovieLibrary must be used within MovieLibraryProvider");
  }
  return context;
}
