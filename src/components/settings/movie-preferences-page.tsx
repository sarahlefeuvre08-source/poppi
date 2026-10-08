"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DurationOptionGroup } from "@/components/filters/duration-option-group";
import { PlusIcon } from "@/components/icons/plus-icon";
import { RemoveIcon } from "@/components/icons/remove-icon";
import { useSettings } from "@/components/providers/settings-provider";
import { PreferenceGenrePicker } from "@/components/settings/preference-genre-picker";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { RecommendationStyleSlider } from "@/components/ui/recommendation-style-slider";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/types";
import type { GenreId } from "@/types/metadata";
import type {
  MoviePreferenceSettings,
  PreferredMovieLength,
  RecommendationStyle,
} from "@/types/settings";

type OpenPicker = "liked" | "avoided" | null;

const recommendationStyles: Array<{
  labelKey: TranslationKey;
  value: RecommendationStyle;
}> = [
  { labelKey: "preferences.style.familiar", value: "familiar" },
  { labelKey: "preferences.style.balanced", value: "balanced" },
  { labelKey: "preferences.style.adventurous", value: "adventurous" },
];

const dividedPreferenceSectionClassName =
  "border-b border-white/20 pb-5";

export function MoviePreferencesPage() {
  const router = useRouter();
  const { moviePreferences, saveMoviePreferences } = useSettings();
  const [draft, setDraft] = useState<MoviePreferenceSettings>(moviePreferences);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const { t } = useI18n();
  const localizedStyles = recommendationStyles.map((style) => ({
    label: t(style.labelKey),
    value: style.value,
  }));

  useEffect(() => {
    // Restore persisted preferences once the provider has hydrated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(moviePreferences);
  }, [moviePreferences]);

  function toggleGenre(kind: Exclude<OpenPicker, null>, genre: GenreId) {
    setDraft((current) => {
      const key = kind === "liked" ? "likedGenres" : "avoidedGenres";
      const otherKey = kind === "liked" ? "avoidedGenres" : "likedGenres";
      const isSelected = current[key].includes(genre);
      return {
        ...current,
        [key]: isSelected
          ? current[key].filter((item) => item !== genre)
          : [...current[key], genre],
        [otherKey]: isSelected
          ? current[otherKey]
          : current[otherKey].filter((item) => item !== genre),
      };
    });
  }

  function save() {
    saveMoviePreferences(draft);
    router.push("/settings");
  }

  return (
    <div className="flex flex-col gap-5 pb-5">
      <SettingsPageHeader
        title={t("settings.moviePreferences")}
        description={t("preferences.description")}
      />

      <PreferenceGenreSection
        title={t("preferences.likedGenres")}
        helper={t("preferences.likedHelper")}
        genres={draft.likedGenres}
        onRemove={(genre) => toggleGenre("liked", genre)}
        onAdd={() => setOpenPicker("liked")}
      />

      <PreferenceGenreSection
        title={t("preferences.avoidedGenres")}
        helper={t("preferences.avoidedHelper")}
        genres={draft.avoidedGenres}
        onRemove={(genre) => toggleGenre("avoided", genre)}
        onAdd={() => setOpenPicker("avoided")}
      />

      <section className={dividedPreferenceSectionClassName}>
        <h2 className="text-sm font-semibold">{t("preferences.recommendationStyle")}</h2>
        <p className="mt-1 text-xs leading-5 text-white/75">
          {t("preferences.styleHelper")}
        </p>
        <div className="mt-3 grid grid-cols-3 text-xs">
          {localizedStyles.map((style, index) => (
            <span
              key={style.value}
              className={`${index === 1 ? "text-center" : index === 2 ? "text-right" : "text-left"} ${draft.recommendationStyle === style.value ? "font-semibold text-white" : "text-white/65"}`}
            >
              {style.label}
            </span>
          ))}
        </div>
        <RecommendationStyleSlider
          className="mt-2 h-6"
          options={localizedStyles}
          value={draft.recommendationStyle}
          onChange={(recommendationStyle) =>
            setDraft((current) => ({ ...current, recommendationStyle }))
          }
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold">{t("preferences.preferredLength")}</h2>
        <p className="mt-1 text-xs leading-5 text-white/75">
          {t("preferences.lengthHelper")}
        </p>
        <div className="mt-3">
          <DurationOptionGroup
            value={draft.preferredMovieLength}
            onChange={(preferredMovieLength: PreferredMovieLength) =>
              setDraft((current) => ({
                ...current,
                preferredMovieLength,
              }))
            }
          />
        </div>
      </section>

      <button
        type="button"
        onClick={save}
        className="poppi-control ml-auto min-h-10 rounded-full bg-accent px-5 text-sm font-semibold"
      >
        {t("preferences.save")}
      </button>

      {openPicker && (
        <PreferenceGenrePicker
          title={openPicker === "liked" ? t("preferences.likedGenres") : t("preferences.avoidedGenres")}
          selectedGenres={
            openPicker === "liked" ? draft.likedGenres : draft.avoidedGenres
          }
          onToggle={(genre) => toggleGenre(openPicker, genre)}
          onClose={() => setOpenPicker(null)}
        />
      )}
    </div>
  );
}

type PreferenceGenreSectionProps = {
  title: string;
  helper: string;
  genres: GenreId[];
  onRemove: (genre: GenreId) => void;
  onAdd: () => void;
};

function PreferenceGenreSection({
  title,
  helper,
  genres,
  onRemove,
  onAdd,
}: PreferenceGenreSectionProps) {
  const { formatGenre, t } = useI18n();
  return (
    <section className={dividedPreferenceSectionClassName}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-white/75">{helper}</p>
      {genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => onRemove(genre)}
              aria-label={t("preferences.removeGenre", { genre: formatGenre(genre) })}
              className="poppi-control inline-flex min-h-8 items-center gap-2 rounded-full bg-accent px-4 text-sm"
            >
              <RemoveIcon />
              {formatGenre(genre)}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="poppi-control mt-3 inline-flex min-h-8 items-center gap-2 rounded-full border border-white/55 px-4 text-sm"
      >
        <PlusIcon />
        {t("preferences.addGenres")}
      </button>
    </section>
  );
}
