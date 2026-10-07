import type { Movie } from "@/types/movie";

export const todayMovie: Movie = {
  id: "midsommar",
  title: "Midsommar",
  year: 2019,
  runtime: "2h28",
  runtimeMinutes: 148,
  director: "Ari Aster",
  countries: ["USA", "Sweden"],
  genres: ["Horror", "Drama", "Thriller"],
  recommendationTags: ["scary", "tense", "emotional"],
  imdbRating: 7.1,
  posterSrc: "/assets/midsommar.jpg",
  synopsis:
    "After a devastating loss, Dani joins her boyfriend and his friends on a trip to a remote Swedish village for a rare midsummer festival. What begins as an idyllic getaway gradually takes a disturbing and unsettling turn.",
  actors: [
    {
      name: "Florence Pugh",
      character: "Dani",
      imageSrc: "/assets/florence-pugh.jpg",
    },
    {
      name: "Vilhelm Blomgren",
      character: "Pelle",
      imageSrc: "/assets/wilhelm-blomgren.jpg",
    },
    {
      name: "Will Poulter",
      character: "Mark",
      imageSrc: "/assets/will-poulter.jpg",
    },
  ],
};

const trumanShowMovie: Movie = {
  id: "the-truman-show",
  title: "The Truman Show",
  year: 1998,
  runtime: "1h43",
  runtimeMinutes: 103,
  director: "Peter Weir",
  countries: ["USA"],
  genres: ["Comedy", "Drama"],
  recommendationTags: ["funny", "light", "emotional"],
  imdbRating: 8.2,
  posterSrc: "/assets/truman-show.jpg",
  inWatchlist: true,
};

const herMovie: Movie = {
  id: "her",
  title: "Her",
  year: 2013,
  runtime: "2h06",
  runtimeMinutes: 126,
  director: "Spike Jonze",
  countries: ["USA"],
  genres: ["Drama", "Romance"],
  recommendationTags: ["romantic", "emotional"],
  imdbRating: 8.0,
  posterSrc: "/assets/her.jpg",
  watched: true,
  favorite: true,
  inWatchlist: false,
};

const totoroMovie: Movie = {
  id: "my-neighbor-totoro",
  title: "My Neighbor Totoro",
  year: 1988,
  runtime: "1h26",
  runtimeMinutes: 86,
  director: "Hayao Miyazaki",
  countries: ["Japan"],
  genres: ["Animation", "Family"],
  recommendationTags: ["comforting", "light", "uplifting"],
  imdbRating: 8.1,
  posterSrc: "/assets/totoro.jpg",
  watched: true,
  favorite: false,
  inWatchlist: true,
};

export const recommendations: Movie[] = [
  trumanShowMovie,
  {
    id: "get-out",
    title: "Get Out",
    year: 2017,
    runtime: "1h44",
    runtimeMinutes: 104,
    director: "Jordan Peele",
    countries: ["USA"],
    genres: ["Horror", "Mystery", "Thriller"],
    recommendationTags: ["scary", "tense", "funny"],
    imdbRating: 7.8,
    posterSrc: "/assets/get-out.jpg",
  },
  herMovie,
];

export const watchedMovies: Movie[] = [
  herMovie,
  {
    id: "princess-mononoke",
    title: "Princess Mononoke",
    year: 1997,
    runtime: "2h13",
    runtimeMinutes: 133,
    director: "Hayao Miyazaki",
    countries: ["Japan"],
    genres: ["Animation", "Adventure"],
    recommendationTags: ["emotional", "tense", "uplifting"],
    imdbRating: 8.3,
    posterSrc: "/assets/princess-mononoke.jpg",
    watched: true,
    favorite: false,
    inWatchlist: false,
  },
  totoroMovie,
  {
    id: "good-will-hunting",
    title: "Good Will Hunting",
    year: 1997,
    runtime: "2h06",
    runtimeMinutes: 126,
    director: "Gus Van Sant",
    countries: ["USA"],
    genres: ["Drama", "Romance"],
    recommendationTags: ["comforting", "emotional", "uplifting"],
    imdbRating: 8.3,
    posterSrc: "/assets/good-will-hunting.avif",
    watched: true,
    favorite: true,
    inWatchlist: false,
  },
];

export const watchlistMovies: Movie[] = [
  {
    id: "green-book",
    title: "Green Book",
    year: 2018,
    runtime: "2h10",
    runtimeMinutes: 130,
    director: "Peter Farrelly",
    countries: ["USA"],
    genres: ["Biography", "Comedy"],
    recommendationTags: ["comforting", "funny", "uplifting"],
    imdbRating: 8.2,
    posterSrc: "/assets/green-book.jpg",
    inWatchlist: true,
  },
  {
    id: "before-sunrise",
    title: "Before Sunrise",
    year: 1995,
    runtime: "1h41",
    runtimeMinutes: 101,
    director: "Richard Linklater",
    countries: ["USA", "Austria"],
    genres: ["Drama", "Romance"],
    recommendationTags: ["light", "romantic", "emotional"],
    imdbRating: 8.1,
    posterSrc: "/assets/before-sunrise.jpg",
    inWatchlist: true,
  },
  totoroMovie,
  trumanShowMovie,
];

export const palmSpringsMovie: Movie = {
  id: "palm-springs",
  title: "Palm Springs",
  year: 2020,
  runtime: "1h30",
  runtimeMinutes: 90,
  director: "Max Barbakow",
  countries: ["USA"],
  genres: ["Comedy", "Romance"],
  recommendationTags: ["funny", "light", "romantic"],
  imdbRating: 7.4,
  posterSrc: "/assets/palm-springs.jpg",
  inWatchlist: false,
  synopsis:
    "Two wedding guests become trapped in a time loop and are forced to relive the same sunny day again and again.",
};

export const movieCatalog: Movie[] = Array.from(
  new Map(
    [
      todayMovie,
      ...recommendations,
      ...watchedMovies,
      ...watchlistMovies,
      palmSpringsMovie,
    ].map((movie) => [movie.id, movie]),
  ).values(),
);

export const watchlistCandidates = movieCatalog;

export function getMovieById(id: string) {
  return movieCatalog.find((movie) => movie.id === id);
}
