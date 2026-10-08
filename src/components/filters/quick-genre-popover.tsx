"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

import { RemoveIcon } from "@/components/icons/remove-icon";
import { genreOptions } from "@/data/filter-options";
import { useI18n } from "@/i18n/provider";
import type { GenreId } from "@/types/metadata";

type QuickGenrePopoverProps = {
  anchorRef: RefObject<HTMLButtonElement | null>;
  selectedGenres: GenreId[];
  onChange: (genres: GenreId[]) => void;
  onClose: () => void;
};

type PopoverPosition = {
  left: number;
  top: number;
  width: number;
};

export function QuickGenrePopover({
  anchorRef,
  selectedGenres,
  onChange,
  onClose,
}: QuickGenrePopoverProps) {
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const { formatGenre, t } = useI18n();

  useEffect(() => {
    function updatePosition() {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const appShell = anchor.closest("[data-app-shell]");
      const appRect = appShell?.getBoundingClientRect() ?? {
        left: 0,
        right: window.innerWidth,
        width: window.innerWidth,
      };
      const width = Math.min(352, appRect.width - 32);
      const minimumLeft = appRect.left + 16;
      const maximumLeft = appRect.right - width - 16;

      setPosition({
        left: Math.min(Math.max(anchorRect.left, minimumLeft), maximumLeft),
        top: anchorRect.bottom + 8,
        width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef]);

  function toggleGenre(genre: GenreId) {
    onChange(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((selectedGenre) => selectedGenre !== genre)
        : [...selectedGenres, genre],
    );
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label={t("filters.closeGenreSelector")}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-transparent"
      />
      {position && (
        <section
          aria-label={t("filters.selectGenres")}
          style={position}
          className="absolute max-h-[min(24rem,55dvh)] overflow-y-auto rounded-2xl border border-white/20 bg-[#252525]/98 p-3 shadow-[0_18px_55px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">{t("filters.genres")}</h2>
            {selectedGenres.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-white/80 underline underline-offset-2"
              >
                {t("filters.clearGenres")}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleGenre(genre)}
                  className={`poppi-control inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${isSelected ? "gap-2 border-accent bg-accent text-white" : "border-white/30 bg-transparent text-white"}`}
                >
                  {isSelected && (
                    <RemoveIcon />
                  )}
                  {formatGenre(genre)}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
