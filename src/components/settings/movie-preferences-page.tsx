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
import type {
  MoviePreferenceSettings,
  PreferredMovieLength,
  RecommendationStyle,
} from "@/types/settings";

type OpenPicker = "liked" | "avoided" | null;

const recommendationStyles: Array<{
  label: string;
  value: RecommendationStyle;
}> = [
  { label: "Familiar", value: "familiar" },
  { label: "Balanced", value: "balanced" },
  { label: "Adventurous", value: "adventurous" },
];

const dividedPreferenceSectionClassName =
  "border-b border-white/20 pb-5";

export function MoviePreferencesPage() {
  const router = useRouter();
  const { moviePreferences, saveMoviePreferences } = useSettings();
  const [draft, setDraft] = useState<MoviePreferenceSettings>(moviePreferences);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);

  useEffect(() => {
    // Restore persisted preferences once the provider has hydrated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(moviePreferences);
  }, [moviePreferences]);

  function toggleGenre(kind: Exclude<OpenPicker, null>, genre: string) {
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
        title="Movie preferences"
        description="Help Poppi understand your taste."
      />

      <PreferenceGenreSection
        title="Genres you like"
        helper="Choose the genres you'd be happy to see more often."
        genres={draft.likedGenres}
        onRemove={(genre) => toggleGenre("liked", genre)}
        onAdd={() => setOpenPicker("liked")}
      />

      <PreferenceGenreSection
        title="Genres to avoid"
        helper="Poppi will avoid recommending these whenever possible."
        genres={draft.avoidedGenres}
        onRemove={(genre) => toggleGenre("avoided", genre)}
        onAdd={() => setOpenPicker("avoided")}
      />

      <section className={dividedPreferenceSectionClassName}>
        <h2 className="text-sm font-semibold">Recommendation style</h2>
        <p className="mt-1 text-xs leading-5 text-white/75">
          Choose how adventurous you want your recommendations to be.
        </p>
        <div className="mt-3 grid grid-cols-3 text-xs">
          {recommendationStyles.map((style, index) => (
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
          options={recommendationStyles}
          value={draft.recommendationStyle}
          onChange={(recommendationStyle) =>
            setDraft((current) => ({ ...current, recommendationStyle }))
          }
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold">Preferred movie length</h2>
        <p className="mt-1 text-xs leading-5 text-white/75">
          We&apos;ll prioritize this duration in recommendations. You can always
          ask Poppi for something different.
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
        Save preferences
      </button>

      {openPicker && (
        <PreferenceGenrePicker
          title={openPicker === "liked" ? "Genres you like" : "Genres to avoid"}
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
  genres: string[];
  onRemove: (genre: string) => void;
  onAdd: () => void;
};

function PreferenceGenreSection({
  title,
  helper,
  genres,
  onRemove,
  onAdd,
}: PreferenceGenreSectionProps) {
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
              aria-label={`Remove ${genre}`}
              className="poppi-control inline-flex min-h-8 items-center gap-2 rounded-full bg-accent px-4 text-sm"
            >
              <RemoveIcon />
              {genre}
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
        Add genres
      </button>
    </section>
  );
}
