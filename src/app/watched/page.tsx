import { MovieCollectionPage } from "@/components/movies/movie-collection-page";
import { movieCatalog } from "@/data/movies";

export default function WatchedPage() {
  return (
    <MovieCollectionPage
      movies={movieCatalog}
      collectionLabel="Watched"
      source="/watched"
      enableFavorites
      watchedOnly
    />
  );
}
