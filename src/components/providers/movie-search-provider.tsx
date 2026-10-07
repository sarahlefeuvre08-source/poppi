"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type MovieSearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  resetSearch: () => void;
};

const MovieSearchContext = createContext<MovieSearchContextValue | null>(null);

export function MovieSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      scrollPosition,
      setScrollPosition,
      resetSearch: () => {
        setQuery("");
        setScrollPosition(0);
      },
    }),
    [query, scrollPosition],
  );

  return (
    <MovieSearchContext.Provider value={value}>
      {children}
    </MovieSearchContext.Provider>
  );
}

export function useMovieSearch() {
  const context = useContext(MovieSearchContext);
  if (!context) {
    throw new Error("useMovieSearch must be used within MovieSearchProvider");
  }
  return context;
}
