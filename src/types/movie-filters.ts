import type { Movie } from "@/types/movie";

export type DurationFilter = "any" | "under-90" | "under-120" | "120-plus";

export type MovieFilters = {
  favoritesOnly: boolean;
  genres: string[];
  fromYear: number | null;
  toYear: number | null;
  country: string | null;
  duration: DurationFilter;
};

export const emptyMovieFilters: MovieFilters = {
  favoritesOnly: false,
  genres: [],
  fromYear: null,
  toYear: null,
  country: null,
  duration: "any",
};

export function filterMovies(movies: Movie[], filters: MovieFilters) {
  return movies.filter((movie) => {
    const matchesFavorite = !filters.favoritesOnly || movie.favorite;
    const matchesGenres =
      filters.genres.length === 0 ||
      movie.genres.some((genre) => filters.genres.includes(genre));
    const matchesFromYear =
      filters.fromYear === null || movie.year >= filters.fromYear;
    const matchesToYear =
      filters.toYear === null || movie.year <= filters.toYear;
    const matchesCountry =
      filters.country === null || movie.countries.includes(filters.country);
    const matchesDuration =
      filters.duration === "any" ||
      (filters.duration === "under-90" && movie.runtimeMinutes < 90) ||
      (filters.duration === "under-120" &&
        movie.runtimeMinutes >= 90 &&
        movie.runtimeMinutes < 120) ||
      (filters.duration === "120-plus" && movie.runtimeMinutes >= 120);

    return (
      matchesFavorite &&
      matchesGenres &&
      matchesFromYear &&
      matchesToYear &&
      matchesCountry &&
      matchesDuration
    );
  });
}
