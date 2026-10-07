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
  likedGenres: string[];
  avoidedGenres: string[];
  recommendationStyle: RecommendationStyle;
  preferredMovieLength: PreferredMovieLength;
};

export type TasteProfile = {
  favoriteMovieIds: string[];
};
