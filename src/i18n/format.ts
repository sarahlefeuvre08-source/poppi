import { translate } from "@/i18n/config";
import type { Locale } from "@/i18n/types";
import type { CountryId, GenreId } from "@/types/metadata";

export const formatNumber = (locale: Locale, value: number) =>
  new Intl.NumberFormat(locale).format(value);

export const formatDate = (
  locale: Locale,
  value: Date | number,
  options?: Intl.DateTimeFormatOptions,
) => new Intl.DateTimeFormat(locale, options).format(value);

export const formatList = (locale: Locale, values: string[]) =>
  new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(values);

export const formatGenre = (locale: Locale, genre: GenreId) =>
  translate(locale, `metadata.genre.${genre}`);

export const formatCountry = (locale: Locale, country: CountryId) =>
  translate(locale, `metadata.country.${country}`);

export function formatMovieRuntime(locale: Locale, minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (locale === "fr") {
    if (hours === 0) return `${remainingMinutes} min`;
    return remainingMinutes === 0
      ? `${hours} h`
      : `${hours} h ${remainingMinutes.toString().padStart(2, "0")}`;
  }
  if (hours === 0) return `${remainingMinutes}min`;
  return remainingMinutes === 0
    ? `${hours}h`
    : `${hours}h${remainingMinutes.toString().padStart(2, "0")}`;
}

const frenchGenreComplements: Record<GenreId, string> = {
  action: "d’action",
  adventure: "d’aventure",
  animation: "d’animation",
  biography: "de biographie",
  comedy: "de comédie",
  crime: "de policier",
  documentary: "de documentaire",
  drama: "de drame",
  family: "de films familiaux",
  fantasy: "de fantastique",
  history: "d’histoire",
  horror: "d’horreur",
  music: "de musique",
  mystery: "de mystère",
  romance: "de romance",
  "sci-fi": "de science-fiction",
  thriller: "de thriller",
  war: "de guerre",
  western: "de western",
};

export function formatOnboardingGenreSummary(locale: Locale, genres: GenreId[]) {
  if (locale !== "fr") {
    const labels = genres.map((genre) => formatGenre(locale, genre));
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
  }
  return formatList(locale, genres.map((genre) => frenchGenreComplements[genre]));
}
