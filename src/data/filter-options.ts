import { formatCountry, formatGenre } from "@/i18n/format";
import type { CountryId, GenreId } from "@/types/metadata";

export const genreOptions = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "history",
  "horror",
  "music",
  "mystery",
  "romance",
  "sci-fi",
  "thriller",
  "war",
  "western",
] as const satisfies readonly GenreId[];

export const countryOptions = [
  "AR",
  "AU",
  "BR",
  "CA",
  "CN",
  "DK",
  "FR",
  "DE",
  "IN",
  "IE",
  "IT",
  "JP",
  "MX",
  "NZ",
  "NO",
  "KR",
  "ES",
  "SE",
  "GB",
  "US",
] as const satisfies readonly CountryId[];

const genreAliases = new Map<string, GenreId>([
  ...genreOptions.map((genre) => [genre, genre] as const),
  ["biography", "biography"],
  ["sci fi", "sci-fi"],
  ["science fiction", "sci-fi"],
]);

export function normalizeGenreId(value: unknown): GenreId | undefined {
  if (typeof value !== "string") return undefined;
  return genreAliases.get(value.trim().toLocaleLowerCase().replaceAll("_", " "));
}

export const getGenreLabel = (genre: GenreId) => formatGenre("en", genre);
export const getCountryLabel = (country: CountryId) => formatCountry("en", country);
