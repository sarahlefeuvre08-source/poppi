export type MovieSource = "/" | "/poppi" | "/watched" | "/to-watch" | "/search";

type MovieSourceKey = "home" | "poppi" | "watched" | "to-watch" | "search";

const sourceRoutes: Record<MovieSourceKey, MovieSource> = {
  home: "/",
  poppi: "/poppi",
  watched: "/watched",
  "to-watch": "/to-watch",
  search: "/search",
};

const sourceKeys: Record<MovieSource, MovieSourceKey> = {
  "/": "home",
  "/poppi": "poppi",
  "/watched": "watched",
  "/to-watch": "to-watch",
  "/search": "search",
};

export function getMovieSource(value: string | string[] | undefined): MovieSource {
  const key = Array.isArray(value) ? value[0] : value;
  return sourceRoutes[key as MovieSourceKey] ?? "/";
}

export function getMovieDetailsHref(movieId: string, source: MovieSource) {
  return `/movies/${movieId}?from=${sourceKeys[source]}`;
}

export function getMovieCastHref(movieId: string, source: MovieSource) {
  return `/movies/${movieId}/cast?from=${sourceKeys[source]}`;
}

export function getActorAnchor(name: string) {
  return `actor-${name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
