"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { MoviePoster } from "@/components/movies/movie-poster";
import { useSettings } from "@/components/providers/settings-provider";
import { MovieSearchInput } from "@/components/search/movie-search-input";
import { RecommendationStyleSlider } from "@/components/ui/recommendation-style-slider";
import { genreOptions } from "@/data/filter-options";
import { movieCatalog } from "@/data/movies";
import type { RecommendationStyle } from "@/types/settings";

type Step = "welcome" | "genres" | "movies" | "style" | "reward";

const steps: Step[] = ["welcome", "genres", "movies", "style", "reward"];
const styles: Array<{
  value: RecommendationStyle;
  label: string;
  symbol: string;
  description: string;
}> = [
  {
    value: "familiar",
    label: "Familiar",
    symbol: "🏠",
    description: "Recommend movies similar to what I already enjoy.",
  },
  {
    value: "balanced",
    label: "Balanced",
    symbol: "⚖️",
    description: "Mostly my favorites, with some discoveries.",
  },
  {
    value: "adventurous",
    label: "Adventurous",
    symbol: "🎲",
    description: "Take me outside my comfort zone.",
  },
];

export function OnboardingFlow() {
  const { moviePreferences, tasteProfile, completeOnboarding } = useSettings();
  const [step, setStep] = useState<Step>("welcome");
  const [likedGenres, setLikedGenres] = useState(moviePreferences.likedGenres);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState(
    tasteProfile.favoriteMovieIds,
  );
  const [recommendationStyle, setRecommendationStyle] =
    useState<RecommendationStyle>(moviePreferences.recommendationStyle);
  const [query, setQuery] = useState("");

  const stepIndex = steps.indexOf(step);
  const goBack = () => setStep(steps[Math.max(0, stepIndex - 1)]);
  const goNext = () => setStep(steps[Math.min(steps.length - 1, stepIndex + 1)]);

  function finish() {
    completeOnboarding({ likedGenres, favoriteMovieIds, recommendationStyle });
    window.history.replaceState({}, "", "/");
  }

  return (
    <main className="relative z-10 min-h-dvh">
      {step === "welcome" && <WelcomeStep onNext={goNext} />}
      {step === "genres" && (
        <GenresStep
          selected={likedGenres}
          onChange={setLikedGenres}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === "movies" && (
        <MoviesStep
          query={query}
          onQueryChange={setQuery}
          selectedIds={favoriteMovieIds}
          onChange={setFavoriteMovieIds}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === "style" && (
        <StyleStep
          value={recommendationStyle}
          onChange={setRecommendationStyle}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === "reward" && (
        <RewardStep genres={likedGenres} onBack={goBack} onFinish={finish} />
      )}
    </main>
  );
}

function StepFrame({
  children,
  action,
  actionLabel,
  actionDisabled = false,
  onBack,
}: {
  children: React.ReactNode;
  action: () => void;
  actionLabel: string;
  actionDisabled?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      {onBack && <OnboardingBackButton onClick={onBack} />}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-2">
        {children}
      </div>
      <button
        type="button"
        disabled={actionDisabled}
        onClick={action}
        className="poppi-control mt-4 min-h-14 w-full shrink-0 rounded-2xl bg-accent px-5 text-lg font-bold text-white shadow-[0_14px_36px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function OnboardingBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="secondary-control poppi-control mb-5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 bg-black/35 backdrop-blur-md"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <StepFrame action={onNext} actionLabel="GET STARTED">
      <div className="flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <div className="relative h-[clamp(11rem,52vw,13rem)] w-[clamp(11rem,52vw,13rem)]">
          <Image src="/assets/poppi.png" alt="Poppi mascot" fill priority sizes="208px" className="scale-[1.45] object-contain" />
        </div>
        <h1 className="font-gloock mt-2 text-6xl leading-none font-normal tracking-[-0.06em]">Poppi</h1>
        <p className="mt-4 text-xl">Pick less. Watch more.</p>
      </div>
    </StepFrame>
  );
}

function GenresStep({
  selected,
  onChange,
  onBack,
  onNext,
}: {
  selected: string[];
  onChange: (genres: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const toggle = (genre: string) =>
    onChange(
      selected.includes(genre)
        ? selected.filter((item) => item !== genre)
        : [...selected, genre],
    );

  return (
    <StepFrame onBack={onBack} action={onNext} actionLabel="NEXT">
      <h1 className="text-2xl leading-tight font-bold tracking-[-0.035em]">What are your favorite genres?</h1>
      <p className="mt-1 text-sm text-white/85">You can pick as many genres as you like.</p>
      <div className="mt-24 grid grid-cols-3 gap-x-3 gap-y-3 max-[350px]:grid-cols-2">
        {genreOptions.map((genre) => {
          const active = selected.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(genre)}
              className={`poppi-control min-h-8 rounded-full border px-2 text-sm ${active ? "border-accent bg-accent font-semibold" : "border-white/65 bg-black/15"}`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </StepFrame>
  );
}

function MoviesStep({
  query,
  onQueryChange,
  selectedIds,
  onChange,
  onBack,
  onNext,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const confirmationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmationPendingRef = useRef(false);
  const [confirmationPending, setConfirmationPending] = useState(false);
  const normalized = query.trim().toLocaleLowerCase();
  const movies = useMemo(
    () =>
      normalized
        ? movieCatalog.filter((movie) => movie.title.toLocaleLowerCase().includes(normalized))
        : movieCatalog,
    [normalized],
  );

  useEffect(
    () => () => {
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
      }
    },
    [],
  );

  function toggleMovie(id: string) {
    if (confirmationPendingRef.current) return;

    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((movieId) => movieId !== id));
    } else if (selectedIds.length < 5) {
      onChange([...selectedIds, id]);
      searchInputRef.current?.blur();

      if (normalized) {
        confirmationPendingRef.current = true;
        setConfirmationPending(true);
        confirmationTimerRef.current = setTimeout(() => {
          onQueryChange("");
          confirmationPendingRef.current = false;
          setConfirmationPending(false);
          confirmationTimerRef.current = null;
        }, 600);
      }
    }
  }

  return (
    <StepFrame onBack={onBack} action={onNext} actionLabel="NEXT" actionDisabled={selectedIds.length !== 5}>
      <h1 className="text-2xl leading-tight font-bold tracking-[-0.035em]">Pick 5 of your favorite movies</h1>
      <p className="mt-3 text-center text-sm"><span className="rounded-full border border-white/60 bg-black/25 px-2 py-0.5">{selectedIds.length}/5</span></p>
      <div className="mt-4">
        <MovieSearchInput
          id="onboarding-movie-search"
          inputRef={searchInputRef}
          label="Search for a movie"
          clearLabel="Clear favorite movie search"
          query={query}
          readOnly={confirmationPending}
          onQueryChange={onQueryChange}
          inputClassName="h-14 w-full rounded-[1.35rem] border border-white/35 bg-[#292929]/90 py-3 pr-14 pl-5 text-base text-white outline-none backdrop-blur-md placeholder:text-white/80 transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-inset focus:ring-accent"
        />
      </div>
      {movies.length ? (
        <div aria-busy={confirmationPending} className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 pb-2">
          {movies.map((movie) => {
            const order = selectedIds.indexOf(movie.id) + 1;
            const selected = order > 0;
            return (
              <article key={movie.id} className="min-w-0">
                <button
                  type="button"
                  aria-label={`${selected ? "Deselect" : "Select"} ${movie.title}`}
                  aria-pressed={selected}
                  disabled={confirmationPending || (!selected && selectedIds.length === 5)}
                  onClick={() => toggleMovie(movie.id)}
                  className={`poppi-card-control relative block w-full overflow-hidden rounded-xl border-2 text-left disabled:cursor-default ${!selected && selectedIds.length === 5 ? "opacity-45" : ""} ${selected ? "border-accent" : "border-transparent"}`}
                >
                  <MoviePoster title={movie.title} src={movie.posterSrc} compact sizes="(max-width: 416px) calc((100vw - 3rem) / 2), 180px" />
                  <span className={`absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-[transform,background-color,color] duration-150 motion-reduce:transition-none ${selected ? "scale-105 bg-accent text-white" : "scale-100 bg-white/85 text-transparent"}`}>
                    {order || "0"}
                  </span>
                </button>
                <h2 className="mt-2 line-clamp-2 text-sm font-semibold">{movie.title}</h2>
                <p className="mt-1 text-sm text-white/80">{movie.runtime} | {movie.year}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-white/75">No movies found.</p>
      )}
    </StepFrame>
  );
}

function StyleStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: RecommendationStyle;
  onChange: (value: RecommendationStyle) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const selectedIndex = styles.findIndex((style) => style.value === value);
  const selected = styles[selectedIndex];

  return (
    <StepFrame onBack={onBack} action={onNext} actionLabel="NEXT">
      <h1 className="text-2xl leading-tight font-bold tracking-[-0.035em]">How adventurous should Poppi&apos;s recommendations be?</h1>
      <div className="mt-24 text-center">
        <div className="text-6xl leading-none" aria-hidden="true">{selected.symbol}</div>
        <h2 className="mt-5 text-2xl font-bold">{selected.label}</h2>
        <p className="mt-2 text-sm text-white/85">{selected.description}</p>
        <RecommendationStyleSlider
          className="mt-4"
          options={styles}
          value={value}
          onChange={onChange}
          trackOuterInset="calc(16.6667% - (var(--slider-thumb-size) / 2))"
        />
        <div className="grid grid-cols-3 text-[0.65rem] text-white/70">
          {styles.map((style) => <span key={style.value} className="text-center">{style.label}</span>)}
        </div>
      </div>
    </StepFrame>
  );
}

function RewardStep({
  genres,
  onBack,
  onFinish,
}: {
  genres: string[];
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <StepFrame onBack={onBack} action={onFinish} actionLabel="CONTINUE">
      <div className="flex flex-1 flex-col items-center justify-center pb-12 text-center">
        <div className="relative h-[clamp(11.5rem,54vw,13.5rem)] w-[clamp(11.5rem,54vw,13.5rem)]">
          <Image src="/assets/poppi.png" alt="Poppi mascot" fill sizes="216px" className="scale-[1.4] object-contain" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em]">🎬 Looking good!</h1>
        <p className="mt-4 max-w-sm text-lg leading-6">{genreSummary(genres)}</p>
      </div>
    </StepFrame>
  );
}

function genreSummary(genres: string[]) {
  if (genres.length === 0) {
    return "Ready to explore? Poppi has plenty of recommendations waiting for you.";
  }
  const shown = genres.slice(0, 3);
  const list =
    shown.length === 1
      ? shown[0]
      : `${shown.slice(0, -1).join(", ")} and ${shown.at(-1)}`;
  return `${list} fan? Poppi has plenty of recommendations waiting for you.`;
}
