import { MoviePoster } from "@/components/movies/movie-poster";
import { MovieDetailsLink } from "@/components/navigation/movie-details-link";
import type { MovieSource } from "@/lib/movie-navigation";
import type { Movie } from "@/types/movie";

type MovieCollectionCardProps = {
  movie: Movie;
  showFavoriteControl?: boolean;
  onToggleFavorite?: (id: string) => void;
  source: MovieSource;
};

export function MovieCollectionCard({
  movie,
  showFavoriteControl = false,
  onToggleFavorite,
  source,
}: MovieCollectionCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <MovieDetailsLink
          movieId={movie.id}
          source={source}
          ariaLabel={`View details for ${movie.title}`}
          className="poppi-card-control block w-full overflow-hidden rounded-xl border border-white/10 text-left shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
        >
          <MoviePoster
            title={movie.title}
            src={movie.posterSrc}
            sizes="(max-width: 416px) calc((100vw - 2.75rem) / 2), 184px"
          />
        </MovieDetailsLink>

        {showFavoriteControl && (
          <button
            type="button"
            aria-label={
              movie.favorite
                ? `Remove ${movie.title} from favorites`
                : `Add ${movie.title} to favorites`
            }
            aria-pressed={movie.favorite}
            onClick={() => onToggleFavorite?.(movie.id)}
            className="poppi-control absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-white/85 text-accent shadow-md backdrop-blur-sm"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill={movie.favorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </button>
        )}
      </div>

      <h2 className="mt-2 line-clamp-2 text-sm leading-5 font-semibold tracking-[-0.015em]">
        {movie.title}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        {movie.runtime} <span className="px-0.5 text-white/45">|</span>{" "}
        {movie.year}
      </p>
    </article>
  );
}
