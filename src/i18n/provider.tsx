"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo } from "react";

import { useSettings } from "@/components/providers/settings-provider";
import { translate } from "@/i18n/config";
import { formatCountry, formatDate, formatGenre, formatList, formatMovieRuntime, formatNumber, formatOnboardingGenreSummary } from "@/i18n/format";
import type { Locale, TranslationKey, TranslationVariables } from "@/i18n/types";
import type { CountryId, GenreId } from "@/types/metadata";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, variables?: TranslationVariables) => string;
  formatNumber: (value: number) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatList: (values: string[]) => string;
  formatGenre: (genre: GenreId) => string;
  formatCountry: (country: CountryId) => string;
  formatMovieRuntime: (minutes: number) => string;
  formatOnboardingGenreSummary: (genres: GenreId[]) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, saveLocale } = useSettings();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: saveLocale,
      t: (key, variables) => translate(locale, key, variables),
      formatNumber: (number) => formatNumber(locale, number),
      formatDate: (date, options) => formatDate(locale, date, options),
      formatList: (values) => formatList(locale, values),
      formatGenre: (genre) => formatGenre(locale, genre),
      formatCountry: (country) => formatCountry(locale, country),
      formatMovieRuntime: (minutes) => formatMovieRuntime(locale, minutes),
      formatOnboardingGenreSummary: (genres) =>
        formatOnboardingGenreSummary(locale, genres),
    }),
    [locale, saveLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
