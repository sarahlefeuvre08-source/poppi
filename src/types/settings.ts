export type PreferredMovieLength =
  | "any"
  | "under-90"
  | "under-120"
  | "120-plus";

export type RecommendationStyle =
  | "familiar"
  | "balanced"
  | "adventurous";

export type ProfileSettings = {
  displayName: string;
};

export type MoviePreferenceSettings = {
  likedGenres: GenreId[];
  avoidedGenres: GenreId[];
  recommendationStyle: RecommendationStyle;
  preferredMovieLength: PreferredMovieLength;
};

export type TasteProfile = {
  favoriteMovieIds: string[];
};
import type { GenreId } from "@/types/metadata";
