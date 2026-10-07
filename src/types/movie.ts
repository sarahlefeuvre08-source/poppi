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
  countries: string[];
  genres: string[];
  recommendationTags: RecommendationTag[];
  imdbRating: number;
  posterSrc: string;
  synopsis?: string;
  actors?: Actor[];
  watched?: boolean;
  favorite?: boolean;
  inWatchlist?: boolean;
};
