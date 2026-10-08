"use client";

import { useMemo, useState } from "react";

import { FilterSelect } from "@/components/controls/filter-select";
import { ToggleSwitch } from "@/components/controls/toggle-switch";
import { DurationOptionGroup } from "@/components/filters/duration-option-group";
import { PlusIcon } from "@/components/icons/plus-icon";
import { RemoveIcon } from "@/components/icons/remove-icon";
import { BottomSheet } from "@/components/overlays/bottom-sheet";
import { countryOptions, genreOptions } from "@/data/filter-options";
import { useI18n } from "@/i18n/provider";
import type { Movie } from "@/types/movie";
import type { CountryId, GenreId } from "@/types/metadata";
import {
  emptyMovieFilters,
  filterMovies,
  type MovieFilters,
} from "@/types/movie-filters";

type MovieFilterSheetProps = {
  movies: Movie[];
  appliedFilters: MovieFilters;
  enableFavorites: boolean;
  onApply: (filters: MovieFilters) => void;
  onClose: () => void;
};

const currentYear = new Date().getFullYear();
const yearOptions = Array.from(
  { length: currentYear - 1900 + 1 },
  (_, index) => currentYear - index,
);

export function MovieFilterSheet({
  movies,
  appliedFilters,
  enableFavorites,
  onApply,
  onClose,
}: MovieFilterSheetProps) {
  const [draft, setDraft] = useState<MovieFilters>(appliedFilters);
  const [isGenrePickerOpen, setIsGenrePickerOpen] = useState(false);
  const { formatCountry, formatGenre, t } = useI18n();

  const resultCount = useMemo(
    () => filterMovies(movies, draft).length,
    [draft, movies],
  );

  function toggleGenre(genre: GenreId) {
    setDraft((current) => ({
      ...current,
      genres: current.genres.includes(genre)
        ? current.genres.filter((selectedGenre) => selectedGenre !== genre)
        : [...current.genres, genre],
    }));
  }

  function setFromYear(value: string) {
    const fromYear = value === "any" ? null : Number(value);
    setDraft((current) => ({
      ...current,
      fromYear,
      toYear:
        fromYear !== null &&
        current.toYear !== null &&
        fromYear > current.toYear
          ? null
          : current.toYear,
    }));
  }

  function setToYear(value: string) {
    const toYear = value === "any" ? null : Number(value);
    setDraft((current) => ({
      ...current,
      toYear,
      fromYear:
        toYear !== null &&
        current.fromYear !== null &&
        toYear < current.fromYear
          ? null
          : current.fromYear,
    }));
  }

  return (
    <BottomSheet
      ariaLabelledBy="filter-sheet-title"
      closeLabel={t("filters.close")}
      onClose={onClose}
      className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[2rem] bg-[#252525] text-white shadow-[0_-20px_60px_rgba(0,0,0,0.45)] min-[361px]:max-h-[calc(100dvh-0.75rem)]"
    >
      <>
        <div data-bottom-sheet-drag-region className="mx-auto mt-2 h-1 w-36 shrink-0 touch-none rounded-full bg-white/70" />

        <div className="flex min-h-0 flex-1 flex-col">
          <header data-bottom-sheet-drag-region className="flex shrink-0 touch-none items-center justify-between gap-4 px-4 pt-5 pb-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                data-bottom-sheet-close
                aria-label={t("filters.close")}
                className="secondary-control poppi-control grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <h2 id="filter-sheet-title" className="text-lg font-bold">
                {t("common.filters")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDraft(emptyMovieFilters)}
              className="secondary-text-link rounded-sm text-sm text-white/90 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("filters.clearAll")}
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
            <div className="space-y-6 py-2">
              {enableFavorites && (
                <fieldset>
                  <legend className="mb-3 text-base font-semibold">
                    {t("common.favorites")}
                  </legend>
                  <div className="flex w-fit items-center gap-1 text-sm">
                    <ToggleSwitch
                      ariaLabel={t("filters.favoritesOnly")}
                      checked={draft.favoritesOnly}
                      onCheckedChange={(favoritesOnly) =>
                        setDraft((current) => ({
                          ...current,
                          favoritesOnly,
                        }))
                      }
                    />
                    {t("filters.favoritesOnly")}
                  </div>
                </fieldset>
              )}

              <fieldset>
                <legend className="mb-3 text-base font-semibold">{t("common.genre")}</legend>
                {draft.genres.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {draft.genres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className="poppi-control flex min-h-8 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium"
                      >
                        <RemoveIcon />
                        {formatGenre(genre)}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  aria-expanded={isGenrePickerOpen}
                  onClick={() => setIsGenrePickerOpen((current) => !current)}
                  className="poppi-control flex min-h-8 items-center gap-2 rounded-full border border-white/55 px-4 text-sm"
                >
                  <PlusIcon />
                  {t("filters.selectGenres")}
                </button>
                {isGenrePickerOpen && (
                  <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/15 p-3">
                    {genreOptions.map((genre) => {
                      const isSelected = draft.genres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleGenre(genre)}
                          className={`poppi-control rounded-full border px-3 py-1.5 text-xs ${isSelected ? "border-accent bg-accent text-white" : "border-white/30 bg-transparent text-white"}`}
                        >
                          {formatGenre(genre)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-base font-semibold">
                  {t("filters.releaseYear")}
                </legend>
                <div className="grid grid-cols-1 gap-3 min-[351px]:grid-cols-2 min-[390px]:gap-5">
                  <label className="text-sm">
                    <span className="mb-1 block">{t("filters.from")}</span>
                    <FilterSelect
                      value={draft.fromYear ?? "any"}
                      onChange={(event) => setFromYear(event.target.value)}
                    >
                      <option value="any" className="bg-[#252525]">
                        {t("filters.any")}
                      </option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year} className="bg-[#252525]">
                          {year}
                        </option>
                      ))}
                    </FilterSelect>
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block">{t("filters.to")}</span>
                    <FilterSelect
                      value={draft.toYear ?? "any"}
                      onChange={(event) => setToYear(event.target.value)}
                    >
                      <option value="any" className="bg-[#252525]">
                        {t("filters.any")}
                      </option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year} className="bg-[#252525]">
                          {year}
                        </option>
                      ))}
                    </FilterSelect>
                  </label>
                </div>
              </fieldset>

              <label className="block">
                <span className="mb-3 block text-base font-semibold">{t("filters.country")}</span>
                <FilterSelect
                  value={draft.country ?? "any"}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      country:
                        event.target.value === "any"
                          ? null
                          : (event.target.value as CountryId),
                    }))
                  }
                  textSize="sm"
                >
                  <option value="any" className="bg-[#252525]">
                    {t("filters.anyCountry")}
                  </option>
                  {countryOptions.map((country) => (
                    <option
                      key={country}
                      value={country}
                      className="bg-[#252525]"
                    >
                      {formatCountry(country)}
                    </option>
                  ))}
                </FilterSelect>
              </label>

              <fieldset>
                <legend className="mb-3 text-base font-semibold">{t("filters.duration")}</legend>
                <DurationOptionGroup
                  value={draft.duration}
                  onChange={(duration) =>
                    setDraft((current) => ({ ...current, duration }))
                  }
                />
              </fieldset>
            </div>
          </div>

          <footer className="shrink-0 bg-[#252525] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              disabled={resultCount === 0}
              onClick={() => {
                onApply(draft);
              }}
              data-bottom-sheet-close
              className="poppi-control min-h-12 w-full rounded-2xl bg-accent px-5 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {resultCount === 0
                ? t("common.noMovies")
                : t("filters.showMovies", { count: resultCount })}
            </button>
          </footer>
        </div>
      </>
    </BottomSheet>
  );
}
