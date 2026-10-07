"use client";

import Image from "next/image";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { MovieCollectionCard } from "@/components/movies/movie-collection-card";
import { useMovieSearch } from "@/components/providers/movie-search-provider";
import { MovieSearchInput } from "@/components/search/movie-search-input";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { movieCatalog } from "@/data/movies";

export function MovieSearchPage() {
  const { query, setQuery, scrollPosition, setScrollPosition, resetSearch } =
    useMovieSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialScrollPositionRef = useRef(scrollPosition);
  const normalizedQuery = useDeferredValue(query.trim().toLocaleLowerCase());

  const results = useMemo(
    () =>
      normalizedQuery
        ? movieCatalog.filter((movie) =>
            movie.title.toLocaleLowerCase().includes(normalizedQuery),
          )
        : [],
    [normalizedQuery],
  );

  useEffect(() => {
    if (!query) inputRef.current?.focus();
  }, [query]);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      window.scrollTo(0, initialScrollPositionRef.current),
    );

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const rememberScrollPosition = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", rememberScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", rememberScrollPosition);
    };
  }, [setScrollPosition]);

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col gap-5 pb-5">
      <SettingsPageHeader
        backHref="/"
        backOnClick={resetSearch}
        title="Search"
      />

      <MovieSearchInput
        id="global-movie-search"
        inputRef={inputRef}
        label="Search for a movie"
        query={query}
        onQueryChange={setQuery}
        inputClassName={`h-14 w-full rounded-[1.4rem] border bg-[#292929]/90 py-3 pr-14 pl-5 text-base text-white outline-none backdrop-blur-md placeholder:text-white/80 ${query ? "border-accent ring-2 ring-accent" : "border-white/30 focus:border-accent/70"}`}
      />

      {!normalizedQuery ? (
        <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <div className="relative h-28 w-28">
            <Image
              src="/assets/poppi.png"
              alt="Poppi"
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
          <p className="mt-5 text-lg font-medium text-white/95">
            Start typing to find a movie.
          </p>
        </section>
      ) : results.length > 0 ? (
        <section
          aria-label={`${results.length} search ${results.length === 1 ? "result" : "results"}`}
          className="grid grid-cols-2 gap-x-4 gap-y-6"
        >
          {results.map((movie) => (
            <MovieCollectionCard
              key={movie.id}
              movie={movie}
              source="/search"
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <p className="text-lg font-semibold">No movies found.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Try a different movie title.
          </p>
        </section>
      )}
    </div>
  );
}
