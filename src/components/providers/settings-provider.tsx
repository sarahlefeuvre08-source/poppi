"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { normalizeGenreId } from "@/data/filter-options";
import { defaultLocale, supportedLocales } from "@/i18n/config";
import type { Locale } from "@/i18n/types";
import type {
  MoviePreferenceSettings,
  ProfileSettings,
  RecommendationStyle,
  TasteProfile,
} from "@/types/settings";
import type { GenreId } from "@/types/metadata";

type SettingsState = {
  locale: Locale;
  profile: ProfileSettings;
  moviePreferences: MoviePreferenceSettings;
  onboardingCompleted: boolean;
  tasteProfile: TasteProfile;
};

type SettingsContextValue = SettingsState & {
  isHydrated: boolean;
  saveLocale: (locale: Locale) => void;
  saveProfile: (profile: ProfileSettings) => void;
  saveMoviePreferences: (preferences: MoviePreferenceSettings) => void;
  completeOnboarding: (input: {
    likedGenres: GenreId[];
    recommendationStyle: RecommendationStyle;
    favoriteMovieIds: string[];
  }) => void;
  resetOnboarding: () => void;
};

const storageKey = "poppi-settings-v1";

const defaultSettings: SettingsState = {
  locale: defaultLocale,
  profile: { displayName: "Sarinha" },
  onboardingCompleted: false,
  tasteProfile: { favoriteMovieIds: [] },
  moviePreferences: {
    likedGenres: [],
    avoidedGenres: [],
    recommendationStyle: "balanced",
    preferredMovieLength: "any",
  },
};

function uniqueGenres(genres: GenreId[]) {
  return [...new Set(genres)];
}

function normalizeStoredGenres(genres: unknown): GenreId[] {
  if (!Array.isArray(genres)) return [];
  return uniqueGenres(
    genres.flatMap((genre) => {
      const normalized = normalizeGenreId(genre);
      return normalized ? [normalized] : [];
    }),
  );
}

function normalizeMoviePreferences(
  preferences: Omit<MoviePreferenceSettings, "likedGenres" | "avoidedGenres"> & {
    likedGenres: unknown;
    avoidedGenres: unknown;
  },
): MoviePreferenceSettings {
  const likedGenres = normalizeStoredGenres(preferences.likedGenres);
  const likedGenreSet = new Set(likedGenres);

  return {
    ...preferences,
    likedGenres,
    avoidedGenres: normalizeStoredGenres(preferences.avoidedGenres).filter(
      (genre) => !likedGenreSet.has(genre),
    ),
  };
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStoredSettings(): SettingsState {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultSettings;
    const parsed = JSON.parse(stored) as Partial<SettingsState>;
    const storedStyle = parsed.moviePreferences?.recommendationStyle as
      | RecommendationStyle
      | number
      | undefined;
    const recommendationStyle: RecommendationStyle =
      typeof storedStyle === "number"
        ? storedStyle < 34
          ? "familiar"
          : storedStyle > 66
            ? "adventurous"
            : "balanced"
        : storedStyle === "familiar" ||
            storedStyle === "balanced" ||
            storedStyle === "adventurous"
          ? storedStyle
          : defaultSettings.moviePreferences.recommendationStyle;

    return {
      locale:
        typeof parsed.locale === "string" &&
        supportedLocales.includes(parsed.locale as Locale)
          ? (parsed.locale as Locale)
          : defaultLocale,
      profile: { ...defaultSettings.profile, ...parsed.profile },
      onboardingCompleted: parsed.onboardingCompleted ?? false,
      tasteProfile: {
        ...defaultSettings.tasteProfile,
        ...parsed.tasteProfile,
      },
      moviePreferences: normalizeMoviePreferences({
        ...defaultSettings.moviePreferences,
        ...parsed.moviePreferences,
        recommendationStyle,
      }),
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let storedSettings = readStoredSettings();
    const shouldResetOnboarding =
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).get("resetOnboarding") === "1";

    if (shouldResetOnboarding) {
      storedSettings = {
        ...storedSettings,
        onboardingCompleted: false,
        tasteProfile: { favoriteMovieIds: [] },
        moviePreferences: { ...defaultSettings.moviePreferences },
      };
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Persist migrations and guarantee conflict-free preference state.
    window.localStorage.setItem(storageKey, JSON.stringify(storedSettings));

    // Loading after hydration keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(storedSettings);
    setIsHydrated(true);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      isHydrated,
      saveLocale: (locale) => {
        setSettings((current) => {
          const next = { ...current, locale };
          window.localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      },
      saveProfile: (profile) => {
        setSettings((current) => {
          const next = { ...current, profile };
          window.localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      },
      saveMoviePreferences: (moviePreferences) => {
        setSettings((current) => {
          const next = {
            ...current,
            moviePreferences: normalizeMoviePreferences(moviePreferences),
          };
          window.localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      },
      completeOnboarding: ({
        likedGenres,
        recommendationStyle,
        favoriteMovieIds,
      }) => {
        setSettings((current) => {
          const normalizedLikedGenres = uniqueGenres(likedGenres);
          const next = {
            ...current,
            onboardingCompleted: true,
            tasteProfile: { favoriteMovieIds },
            moviePreferences: normalizeMoviePreferences({
              ...current.moviePreferences,
              likedGenres: normalizedLikedGenres,
              avoidedGenres: current.moviePreferences.avoidedGenres.filter(
                (genre) => !normalizedLikedGenres.includes(genre),
              ),
              recommendationStyle,
            }),
          };
          window.localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      },
      resetOnboarding: () => {
        setSettings((current) => {
          const next = {
            ...current,
            onboardingCompleted: false,
            tasteProfile: { favoriteMovieIds: [] },
            moviePreferences: { ...defaultSettings.moviePreferences },
          };
          window.localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      },
    }),
    [isHydrated, settings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
