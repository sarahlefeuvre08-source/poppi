import { MoviePoster } from "@/components/movies/movie-poster";
import { MovieDetailsLink } from "@/components/navigation/movie-details-link";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <MovieDetailsLink
        movieId={movie.id}
        source="/"
        ariaLabel={`View details for ${movie.title}`}
        className="poppi-card-control block w-full overflow-hidden rounded-lg border border-white/10 text-left shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
      >
        <MoviePoster title={movie.title} src={movie.posterSrc} compact />
      </MovieDetailsLink>
      <h3 className="mt-1.5 line-clamp-2 text-[0.78rem] leading-[1.15rem] font-semibold tracking-[-0.01em]">
        {movie.title}
      </h3>
    </article>
  );
}
