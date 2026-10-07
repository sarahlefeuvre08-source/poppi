import { MovieCard } from "@/components/movies/movie-card";
import { PoppiCta } from "@/components/home/poppi-cta";
import { SearchEntry } from "@/components/home/search-entry";
import { TodayMovie } from "@/components/home/today-movie";
import { UserGreeting } from "@/components/settings/user-greeting";
import { recommendations, todayMovie } from "@/data/movies";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <UserGreeting />

      <SearchEntry />
      <TodayMovie movie={todayMovie} />
      <PoppiCta />

      <section aria-labelledby="recommendations-heading">
        <div className="mb-3">
          <h2
            id="recommendations-heading"
            className="text-lg font-bold tracking-[-0.025em]"
          >
            You might also like
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {recommendations.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
