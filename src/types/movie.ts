export type Actor = {
  name: string;
  character: string;
  imageSrc: string;
};

export type RecommendationTag =
  | "comforting"
  | "emotional"
  | "funny"
  | "light"
  | "romantic"
  | "scary"
  | "tense"
  | "uplifting";

export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: string;
  runtimeMinutes: number;
  director: string;
  countries: CountryId[];
  genres: GenreId[];
  recommendationTags: RecommendationTag[];
  imdbRating: number;
  posterSrc: string;
  synopsis?: string;
  actors?: Actor[];
  watched?: boolean;
  favorite?: boolean;
  inWatchlist?: boolean;
};
import type { CountryId, GenreId } from "@/types/metadata";
