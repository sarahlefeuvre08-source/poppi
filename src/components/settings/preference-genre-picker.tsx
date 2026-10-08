"use client";

import { RemoveIcon } from "@/components/icons/remove-icon";
import { BottomSheet } from "@/components/overlays/bottom-sheet";
import { genreOptions } from "@/data/filter-options";
import { useI18n } from "@/i18n/provider";
import type { GenreId } from "@/types/metadata";

type PreferenceGenrePickerProps = {
  title: string;
  selectedGenres: GenreId[];
  onToggle: (genre: GenreId) => void;
  onClose: () => void;
};

export function PreferenceGenrePicker({
  title,
  selectedGenres,
  onToggle,
  onClose,
}: PreferenceGenrePickerProps) {
  const { formatGenre, t } = useI18n();
  return (
    <BottomSheet
      ariaLabelledBy="preference-genre-title"
      closeLabel={t("filters.closeGenreSelector")}
      onClose={onClose}
      className="flex max-h-[calc(100dvh-0.75rem)] flex-col overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-[#252525] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
    >
      <>
        <div data-bottom-sheet-drag-region className="mx-auto mt-2 h-1 w-28 shrink-0 touch-none rounded-full bg-white/65" />
        <div data-bottom-sheet-drag-region className="flex shrink-0 touch-none items-center justify-between gap-4 px-4 pt-3 pb-1">
          <h2 id="preference-genre-title" className="text-lg font-bold">{title}</h2>
          <button type="button" data-bottom-sheet-close className="secondary-text-action -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-2 text-sm font-semibold">
            {t("preferences.done")}
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-4 pt-1 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-wrap gap-2">
          {genreOptions.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggle(genre)}
                className={`poppi-control inline-flex min-h-9 items-center rounded-full border px-3 text-sm ${isSelected ? "gap-2 border-accent bg-accent" : "border-white/35 bg-transparent"}`}
              >
                {isSelected && (
                  <RemoveIcon />
                )}
                {formatGenre(genre)}
              </button>
            );
          })}
          </div>
        </div>
      </>
    </BottomSheet>
  );
}
