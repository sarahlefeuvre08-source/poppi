import { MovieCollectionPage } from "@/components/movies/movie-collection-page";
import { watchlistCandidates } from "@/data/movies";

export default function ToWatchPage() {
  return (
    <MovieCollectionPage
      movies={watchlistCandidates}
      collectionLabel="To watch"
      source="/to-watch"
      watchlistOnly
    />
  );
}
