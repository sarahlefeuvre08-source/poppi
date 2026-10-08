"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { ToggleSwitch } from "@/components/controls/toggle-switch";
import { MovieFilterSheet } from "@/components/filters/movie-filter-sheet";
import { QuickGenrePopover } from "@/components/filters/quick-genre-popover";
import { MainPageHeader } from "@/components/layout/main-page-header";
import { MovieCollectionCard } from "@/components/movies/movie-collection-card";
import { useMovieLibrary } from "@/components/providers/movie-library-provider";
import { MovieSearchInput } from "@/components/search/movie-search-input";
import type { MovieSource } from "@/lib/movie-navigation";
import type { Movie } from "@/types/movie";
import { useI18n } from "@/i18n/provider";
import {
  emptyMovieFilters,
  filterMovies,
  type MovieFilters,
} from "@/types/movie-filters";

type MovieCollectionPageProps = {
  movies: Movie[];
  collectionLabel: string;
  enableFavorites?: boolean;
  watchlistOnly?: boolean;
  watchedOnly?: boolean;
  source: MovieSource;
};

export function MovieCollectionPage({
  movies: initialMovies,
  collectionLabel,
  enableFavorites = false,
  watchlistOnly = false,
  watchedOnly = false,
  source,
}: MovieCollectionPageProps) {
  const {
    isFavorite,
    isInWatchlist,
    isWatched,
    toggleFavorite,
  } = useMovieLibrary();
  const [query, setQuery] = useState("");
  const [appliedFilters, setAppliedFilters] =
    useState<MovieFilters>(emptyMovieFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isGenrePopoverOpen, setIsGenrePopoverOpen] = useState(false);
  const genreButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const localizedTitle = watchlistOnly
    ? t("collection.toWatchTitle")
    : t("collection.watchedTitle");
  const localizedDescription = watchlistOnly
    ? t("collection.toWatchDescription")
    : t("collection.watchedDescription");

  const collectionMovies = useMemo(
    () =>
      initialMovies
        .filter(
          (movie) =>
            (!watchlistOnly || isInWatchlist(movie.id)) &&
            (!watchedOnly || isWatched(movie.id)),
        )
        .map((movie) => ({ ...movie, favorite: isFavorite(movie.id) })),
    [
      initialMovies,
      isFavorite,
      isInWatchlist,
      isWatched,
      watchedOnly,
      watchlistOnly,
    ],
  );

  const visibleMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return filterMovies(collectionMovies, appliedFilters).filter((movie) =>
      movie.title.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [appliedFilters, collectionMovies, query]);

  const hasActiveFilters =
    appliedFilters.favoritesOnly ||
    appliedFilters.genres.length > 0 ||
    appliedFilters.fromYear !== null ||
    appliedFilters.toYear !== null ||
    appliedFilters.country !== null ||
    appliedFilters.duration !== "any";
  const isFilteredEmptyState =
    query.trim().length > 0 || hasActiveFilters || collectionMovies.length > 0;

  return (
    <div className="flex flex-col gap-5 pb-5">
      <MainPageHeader title={localizedTitle} description={localizedDescription} />

      <MovieSearchInput
        id={`${collectionLabel}-search`}
        inputRef={searchInputRef}
        label={watchlistOnly ? t("collection.searchToWatch") : t("collection.searchWatched")}
        clearLabel={watchlistOnly ? t("collection.clearToWatchSearch") : t("collection.clearWatchedSearch")}
        query={query}
        onQueryChange={setQuery}
        inputClassName="h-14 w-full rounded-[1.4rem] border border-white/20 bg-white/10 py-3 pr-14 pl-5 text-base text-white outline-none backdrop-blur-md placeholder:text-white/80 focus:border-accent/70"
      />

      <div
        aria-label={watchlistOnly ? t("collection.toWatchFiltersAria") : t("collection.watchedFiltersAria")}
        className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {enableFavorites && (
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-base font-semibold">{t("common.favorites")}</span>
            <ToggleSwitch
              ariaLabel={t("collection.showFavorites")}
              checked={appliedFilters.favoritesOnly}
              onCheckedChange={(favoritesOnly) =>
                setAppliedFilters((current) => ({
                  ...current,
                  favoritesOnly,
                }))
              }
            />
          </div>
        )}

        <button
          ref={genreButtonRef}
          type="button"
          aria-expanded={isGenrePopoverOpen}
          onClick={() => setIsGenrePopoverOpen((current) => !current)}
          className="secondary-control poppi-control flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/35 bg-black/20 px-4 text-sm font-medium backdrop-blur-md"
        >
          <span
            aria-hidden="true"
            className="grid h-4 w-4 shrink-0 place-items-center"
          >
            <svg
              viewBox="0 0 16 16"
              className={`h-4 w-4 transition-transform duration-150 ${isGenrePopoverOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </span>
          {t("common.genre")}
        </button>
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="secondary-control poppi-control flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/35 bg-black/20 px-4 text-sm font-medium backdrop-blur-md"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 7h16M7 12h10M10 17h4" />
          </svg>
          {t("common.filters")}
        </button>
      </div>

      {visibleMovies.length > 0 ? (
        <section
          aria-label={watchlistOnly ? t("collection.toWatchMoviesAria") : t("collection.watchedMoviesAria")}
          className="grid grid-cols-2 gap-x-4 gap-y-6"
        >
          {visibleMovies.map((movie) => (
            <MovieCollectionCard
              key={movie.id}
              movie={movie}
              source={source}
              showFavoriteControl={enableFavorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center px-6 pt-8 pb-16 text-center">
          <div className="relative h-28 w-28">
            <Image
              src="/assets/poppi.png"
              alt={t("common.poppiAlt")}
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
          <p className="mt-5 text-lg font-semibold">
            {isFilteredEmptyState ? t("common.noMovies") : t("collection.nothingHere")}
          </p>
          <p className="mt-2 text-sm leading-5 text-text-secondary">
            {isFilteredEmptyState
              ? t("collection.tryFilters")
              : watchlistOnly
                ? t("collection.emptyWatchlist")
                : t("collection.emptyWatched")}
          </p>
        </section>
      )}

      {isGenrePopoverOpen && (
        <QuickGenrePopover
          anchorRef={genreButtonRef}
          selectedGenres={appliedFilters.genres}
          onClose={() => setIsGenrePopoverOpen(false)}
          onChange={(genres) =>
            setAppliedFilters((current) => ({ ...current, genres }))
          }
        />
      )}

      {isFilterSheetOpen && (
        <MovieFilterSheet
          movies={collectionMovies}
          appliedFilters={appliedFilters}
          enableFavorites={enableFavorites}
          onClose={() => setIsFilterSheetOpen(false)}
          onApply={setAppliedFilters}
        />
      )}
    </div>
  );
}
