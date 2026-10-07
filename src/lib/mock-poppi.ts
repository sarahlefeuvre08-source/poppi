import { getMovieById, movieCatalog } from "@/data/movies";
import type {
  ConversationStage,
  MockChatResponse,
  QuickReply,
  RecommendationContext,
} from "@/types/chat";
import type { Movie, RecommendationTag } from "@/types/movie";

export const initialQuickReplies: QuickReply[] = [
  { label: "😂 Make me laugh", value: "make-me-laugh" },
  { label: "🫂 Something comforting", value: "comforting" },
  { label: "😭 I need a good cry", value: "good-cry" },
  { label: "👻 Scare me", value: "scary" },
  { label: "🎲 Pick for me", value: "pick-for-me" },
  { label: "✨ Surprise me", value: "surprise" },
];

const funnyQuickReplies: QuickReply[] = [
  { label: "🎭 Comedy", value: "comedy" },
  { label: "💕 Romantic comedy", value: "romantic-comedy" },
  { label: "🪽 Something light", value: "something-light" },
  { label: "🎲 Surprise me", value: "surprise" },
];

const genreMatchers: Array<[string, RegExp]> = [
  ["Animation", /\banimat(?:ed|ion)\b/],
  ["Adventure", /\badventure\b/],
  ["Comedy", /\bcomed(?:y|ies)\b/],
  ["Drama", /\bdrama\b/],
  ["Family", /\bfamily\b/],
  ["Horror", /\bhorror\b/],
  ["Mystery", /\bmystery\b/],
  ["Romance", /\b(?:romance|romantic)\b/],
  ["Thriller", /\bthrillers?\b/],
];

const moodMatchers: Array<[RecommendationTag, RegExp]> = [
  ["comforting", /\b(?:comfort|comforting|cosy|cozy)\b/],
  ["emotional", /\b(?:emotional|cry|tearjerker)\b/],
  ["funny", /\b(?:funny|laugh|humou?r)\b/],
  ["light", /\b(?:light|lighter|easy.?going)\b/],
  ["romantic", /\bromantic\b/],
  ["scary", /\b(?:scary|scare|frightening)\b/],
];

const normalize = (value: string) => value.trim().toLocaleLowerCase();
const unique = <T,>(values: T[]) => [...new Set(values)];

export const initialRecommendationContext: RecommendationContext = {
  excludedMovieIds: [],
  requiredGenres: [],
  preferredMoods: [],
  excludeRomance: false,
};

type IsMovieWatched = (movieId: string) => boolean;

type ParsedRequest = {
  genres: string[];
  moods: RecommendationTag[];
  minRuntimeExclusive?: number;
  maxRuntimeExclusive?: number;
  runtimeComparison?: "shorter" | "longer";
  clearsRuntime: boolean;
  hasRecommendationIntent: boolean;
};

const runtimeNumber = String.raw`(\d+(?:\.\d+)?|one|two|three)`;
const runtimeUnits = String.raw`(?:h|hours?|hrs?)`;
const minuteUnits = String.raw`(?:minutes?|mins?)`;

function runtimeValue(value: string, unit: "hours" | "minutes") {
  const writtenNumbers: Record<string, number> = { one: 1, two: 2, three: 3 };
  const amount = writtenNumbers[value] ?? Number(value);
  return unit === "hours" ? amount * 60 : amount;
}

function parseRequest(message: string): ParsedRequest {
  const genres = genreMatchers
    .filter(([, matcher]) => matcher.test(message))
    .map(([genre]) => genre);
  const moods = moodMatchers
    .filter(([, matcher]) => matcher.test(message))
    .map(([mood]) => mood);

  if (/\b(?:scary|scare|frightening)\b/.test(message)) genres.push("Horror");
  if (/\b(?:funny|laugh|humou?r)\b/.test(message)) moods.push("funny");

  let minRuntimeExclusive: number | undefined;
  let maxRuntimeExclusive: number | undefined;
  const underMinutes = message.match(
    new RegExp(String.raw`\b(?:under|less than|below|shorter than)\s+${runtimeNumber}\s*${minuteUnits}\b`),
  );
  const underHours = message.match(
    new RegExp(String.raw`\b(?:under|less than|below|shorter than)\s+${runtimeNumber}\s*${runtimeUnits}\b`),
  );
  const overMinutes = message.match(
    new RegExp(String.raw`\b(?:over|more than|above|longer than)\s+${runtimeNumber}\s*${minuteUnits}\b`),
  );
  const overHours = message.match(
    new RegExp(String.raw`\b(?:over|more than|above|longer than)\s+${runtimeNumber}\s*${runtimeUnits}\b`),
  );

  if (underMinutes) maxRuntimeExclusive = runtimeValue(underMinutes[1], "minutes");
  if (underHours) maxRuntimeExclusive = runtimeValue(underHours[1], "hours");
  if (overMinutes) minRuntimeExclusive = runtimeValue(overMinutes[1], "minutes");
  if (overHours) minRuntimeExclusive = runtimeValue(overHours[1], "hours");

  const hasAbsoluteRuntime =
    minRuntimeExclusive !== undefined || maxRuntimeExclusive !== undefined;
  const runtimeComparison = hasAbsoluteRuntime
    ? undefined
    : /\b(?:something\s+|a\s+)?shorter(?:\s+one)?\b/.test(message)
      ? "shorter"
      : /\b(?:something\s+|a\s+)?longer(?:\s+one)?\b/.test(message)
        ? "longer"
        : undefined;
  const clearsRuntime = /\b(?:no time limit|any (?:runtime|length)|no runtime limit)\b/.test(
    message,
  );

  const hasRecommendationIntent =
    genres.length > 0 ||
    moods.length > 0 ||
    minRuntimeExclusive !== undefined ||
    maxRuntimeExclusive !== undefined ||
    runtimeComparison !== undefined ||
    clearsRuntime ||
    /\b(?:movie|film|watch|recommend|pick|surprise)\b/.test(message);

  return {
    genres: unique(genres),
    moods: unique(moods),
    minRuntimeExclusive,
    maxRuntimeExclusive,
    runtimeComparison,
    clearsRuntime,
    hasRecommendationIntent,
  };
}

function startsNewRecommendationRequest(message: string) {
  return /\b(?:i want|i would like|i'd like|recommend(?: me)?|find me|show me|give me|looking for)\b/.test(
    message,
  );
}

function replacesRecommendationDirection(message: string) {
  return /\b(?:actually|instead|i(?:'d| would)\s+(?:rather|prefer)|make it)\b/.test(
    message,
  );
}

function mergeCompatibleMoods(
  activeMoods: RecommendationTag[],
  addedMoods: RecommendationTag[],
) {
  let nextMoods = [...activeMoods];

  for (const mood of addedMoods) {
    if (mood === "light" || mood === "comforting") {
      nextMoods = nextMoods.filter((activeMood) => activeMood !== "scary");
    }
    if (mood === "scary") {
      nextMoods = nextMoods.filter(
        (activeMood) => activeMood !== "light" && activeMood !== "comforting",
      );
    }
    nextMoods.push(mood);
  }

  return unique(nextMoods);
}

function recommendation(
  movie: Movie,
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
): MockChatResponse {
  const matchedMoods = context.preferredMoods.filter((mood) =>
    movie.recommendationTags.includes(mood),
  );
  const reasons = [
    ...context.requiredGenres.filter((genre) => movie.genres.includes(genre)),
    ...matchedMoods,
  ];

  if (context.maxRuntimeExclusive !== undefined) {
    reasons.push(`under ${formatRuntimeLimit(context.maxRuntimeExclusive)}`);
  }
  if (context.minRuntimeExclusive !== undefined) {
    reasons.push(`longer than ${formatRuntimeLimit(context.minRuntimeExclusive)}`);
  }

  const groundedReasons = unique(reasons);
  const text = groundedReasons.length
    ? `${sentenceList(groundedReasons)} — ${movie.title} matches what you're in the mood for. 🍿`
    : `${movie.title} is my pick for you tonight. 🍿`;

  return {
    stage: "recommendation",
    text,
    recommendationId: movie.id,
    quickReplies: buildFollowUpReplies(
      { ...context, currentRecommendationId: movie.id },
      isMovieWatched,
    ),
    recommendationContext: {
      ...context,
      currentRecommendationId: movie.id,
    },
  };
}

function formatRuntimeLimit(minutes: number) {
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  return `${minutes} minutes`;
}

function sentenceList(values: string[]) {
  const formatted = values.map((value, index) => {
    const normalized = value.toLocaleLowerCase();
    return index === 0
      ? `${normalized.charAt(0).toLocaleUpperCase()}${normalized.slice(1)}`
      : normalized;
  });
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(", ")} and ${formatted.at(-1)}`;
}

function isEligibleRecommendation(
  movie: Movie,
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
) {
  if (isMovieWatched(movie.id)) return false;
  if (context.excludedMovieIds.includes(movie.id)) return false;
  if (
    context.minRuntimeExclusive !== undefined &&
    movie.runtimeMinutes <= context.minRuntimeExclusive
  ) {
    return false;
  }
  if (
    context.maxRuntimeExclusive !== undefined &&
    movie.runtimeMinutes >= context.maxRuntimeExclusive
  ) {
    return false;
  }
  if (context.excludeRomance && movie.genres.includes("Romance")) return false;
  if (
    !context.requiredGenres.every((genre) => movie.genres.includes(genre))
  ) {
    return false;
  }
  return true;
}

function findRecommendation(
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
) {
  const candidates = movieCatalog.filter((movie) =>
    isEligibleRecommendation(movie, context, isMovieWatched),
  );

  const ranked = candidates
    .map((movie) => ({
      movie,
      moodMatches: context.preferredMoods.filter((mood) =>
        movie.recommendationTags.includes(mood),
      ).length,
    }))
    .sort(
      (a, b) =>
        b.moodMatches - a.moodMatches ||
        b.movie.imdbRating - a.movie.imdbRating ||
        a.movie.title.localeCompare(b.movie.title),
    );

  if (context.preferredMoods.length > 0 && ranked[0]?.moodMatches === 0) {
    return undefined;
  }
  return ranked[0]?.movie;
}

function getEligibleAlternatives(
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
) {
  const alternativeContext = withCurrentMovieExcluded(context);
  return movieCatalog.filter((movie) => {
    if (!isEligibleRecommendation(movie, alternativeContext, isMovieWatched)) {
      return false;
    }
    return (
      alternativeContext.preferredMoods.length === 0 ||
      alternativeContext.preferredMoods.some((mood) =>
        movie.recommendationTags.includes(mood),
      )
    );
  });
}

function buildFollowUpReplies(
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
) {
  const currentMovie = context.currentRecommendationId
    ? getMovieById(context.currentRecommendationId)
    : undefined;
  const alternatives = getEligibleAlternatives(context, isMovieWatched);
  const replies: QuickReply[] = [];

  if (alternatives.length > 0) {
    replies.push({ label: "✨ Something else", value: "something-else" });
  }
  if (
    currentMovie &&
    alternatives.some(
      (movie) => movie.runtimeMinutes < currentMovie.runtimeMinutes,
    )
  ) {
    replies.push({ label: "⏱️ Shorter", value: "shorter" });
  }
  if (
    !context.preferredMoods.includes("light") &&
    alternatives.some((movie) => movie.recommendationTags.includes("light"))
  ) {
    replies.push({ label: "🪽 Something lighter", value: "something-light" });
  }
  if (
    context.minRuntimeExclusive === undefined &&
    context.maxRuntimeExclusive === undefined &&
    alternatives.some((movie) => movie.runtimeMinutes < 120)
  ) {
    replies.push({ label: "⏲️ Under 2 hours", value: "under-2-hours" });
  }
  if (
    currentMovie?.genres.includes("Romance") ||
    context.requiredGenres.includes("Romance") ||
    context.preferredMoods.includes("romantic")
  ) {
    replies.push({ label: "💔 Less romantic", value: "less-romantic" });
  }

  return [
    ...replies.slice(0, 3),
    { label: "👀 I've already seen it", value: "already-seen" },
  ];
}

function noMatch(context: RecommendationContext, detail?: string): MockChatResponse {
  return {
    stage: "recommendation",
    text: detail
      ? `I couldn't find a match for ${detail} in my current collection. Want me to loosen one of those preferences? 🍿`
      : "I couldn't find an exact unwatched match in my current collection. Want me to loosen one of those preferences? 🍿",
    quickReplies: [],
    recommendationContext: context,
  };
}

function describeConstraints(context: RecommendationContext) {
  const parts = [
    ...context.requiredGenres,
    ...context.preferredMoods,
    ...(context.maxRuntimeExclusive !== undefined
      ? [`under ${formatRuntimeLimit(context.maxRuntimeExclusive)}`]
      : []),
    ...(context.minRuntimeExclusive !== undefined
      ? [`longer than ${formatRuntimeLimit(context.minRuntimeExclusive)}`]
      : []),
  ];
  return parts.length > 0 ? `${sentenceList(unique(parts))} movie` : undefined;
}

function withCurrentMovieExcluded(context: RecommendationContext) {
  return {
    ...context,
    excludedMovieIds: context.currentRecommendationId
      ? unique([...context.excludedMovieIds, context.currentRecommendationId])
      : context.excludedMovieIds,
  };
}

function selectRecommendation(
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
) {
  const movie = findRecommendation(context, isMovieWatched);
  return movie
    ? recommendation(movie, context, isMovieWatched)
    : noMatch(context, describeConstraints(context));
}

function refineRecommendation(
  intent: "something-else" | "less-romantic" | "already-seen",
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
): MockChatResponse {
  const nextContext = withCurrentMovieExcluded({
    ...context,
    excludeRomance:
      intent === "less-romantic" ? true : context.excludeRomance,
    requiredGenres:
      intent === "less-romantic"
        ? context.requiredGenres.filter((genre) => genre !== "Romance")
        : context.requiredGenres,
    preferredMoods:
      intent === "less-romantic"
        ? context.preferredMoods.filter((mood) => mood !== "romantic")
        : context.preferredMoods,
  });

  const movie = findRecommendation(nextContext, isMovieWatched);
  if (!movie) {
    const detail = describeConstraints(nextContext)
      ? `another ${describeConstraints(nextContext)}`
      : undefined;
    return noMatch(nextContext, detail);
  }
  return recommendation(movie, nextContext, isMovieWatched);
}

export function getMockPoppiResponse(
  input: string,
  stage: ConversationStage,
  context: RecommendationContext,
  isMovieWatched: IsMovieWatched,
): MockChatResponse {
  const message = normalize(input);

  if (/less romantic/.test(message) || message === "less-romantic") {
    return refineRecommendation("less-romantic", context, isMovieWatched);
  }
  if (/already seen|seen it/.test(message) || message === "already-seen") {
    return refineRecommendation("already-seen", context, isMovieWatched);
  }
  if (/something else|another/.test(message) || message === "something-else") {
    return refineRecommendation("something-else", context, isMovieWatched);
  }

  if (message === "make-me-laugh") {
    return {
      stage: "funny",
      text: "Nice! A funny movie for a cosy time together — under 2 hours. Do you have a preferred genre, or are you open to suggestions?",
      quickReplies: funnyQuickReplies,
      recommendationContext: {
        ...context,
        preferredMoods: unique([...context.preferredMoods, "funny"]),
        minRuntimeExclusive: undefined,
        maxRuntimeExclusive: Math.min(
          context.maxRuntimeExclusive ?? Number.POSITIVE_INFINITY,
          120,
        ),
      },
    };
  }

  const parsed = parseRequest(message);
  const currentMovie = context.currentRecommendationId
    ? getMovieById(context.currentRecommendationId)
    : undefined;
  const startsNewRequest = startsNewRecommendationRequest(message);
  const replacesDirection = replacesRecommendationDirection(message);
  const replacesTasteDirection =
    replacesDirection && (parsed.genres.length > 0 || parsed.moods.length > 0);
  const hasRuntimeChange =
    parsed.minRuntimeExclusive !== undefined ||
    parsed.maxRuntimeExclusive !== undefined ||
    parsed.runtimeComparison !== undefined ||
    parsed.clearsRuntime;
  const requestsDifferentMovie =
    message === "something-light" ||
    /\blighter\b/.test(message) ||
    parsed.runtimeComparison !== undefined;
  const isRefinement =
    stage === "recommendation" && !startsNewRequest && !replacesDirection;
  const baseContext: RecommendationContext = startsNewRequest
    ? {
        ...initialRecommendationContext,
        excludedMovieIds:
          parsed.runtimeComparison !== undefined &&
          context.currentRecommendationId
            ? unique([
                ...context.excludedMovieIds,
                context.currentRecommendationId,
              ])
            : context.excludedMovieIds,
      }
    : replacesTasteDirection
      ? {
          ...withCurrentMovieExcluded(context),
          requiredGenres: [],
          preferredMoods: [],
          excludeRomance: false,
        }
    : isRefinement && requestsDifferentMovie
      ? withCurrentMovieExcluded(context)
      : context;
  const runtimeReference =
    parsed.runtimeComparison !== undefined
      ? currentMovie?.runtimeMinutes
      : undefined;
  const nextMinRuntime = parsed.clearsRuntime
    ? undefined
    : parsed.runtimeComparison === "longer"
      ? runtimeReference
      : parsed.minRuntimeExclusive !== undefined
        ? parsed.minRuntimeExclusive
        : hasRuntimeChange
          ? undefined
          : baseContext.minRuntimeExclusive;
  const nextMaxRuntime = parsed.clearsRuntime
    ? undefined
    : parsed.runtimeComparison === "shorter"
      ? runtimeReference
      : parsed.maxRuntimeExclusive !== undefined
        ? parsed.maxRuntimeExclusive
        : hasRuntimeChange
          ? undefined
          : baseContext.maxRuntimeExclusive;
  let nextContext: RecommendationContext = {
    ...baseContext,
    requiredGenres: unique([...baseContext.requiredGenres, ...parsed.genres]),
    preferredMoods: mergeCompatibleMoods(
      baseContext.preferredMoods,
      parsed.moods,
    ),
    minRuntimeExclusive: nextMinRuntime,
    maxRuntimeExclusive: nextMaxRuntime,
  };

  if (message === "romantic-comedy") {
    nextContext = {
      ...nextContext,
      requiredGenres: unique([
        ...nextContext.requiredGenres,
        "Comedy",
        "Romance",
      ]),
      preferredMoods: unique([...nextContext.preferredMoods, "romantic"]),
    };
  }
  if (message === "comedy") {
    nextContext = {
      ...nextContext,
      requiredGenres: unique([...nextContext.requiredGenres, "Comedy"]),
      preferredMoods: unique([...nextContext.preferredMoods, "funny"]),
    };
  }
  if (message === "something-light") {
    nextContext = {
      ...nextContext,
      preferredMoods: unique([...nextContext.preferredMoods, "light"]),
    };
  }
  if (message === "under-2-hours") {
    nextContext = {
      ...nextContext,
      minRuntimeExclusive: undefined,
      maxRuntimeExclusive: Math.min(
        nextContext.maxRuntimeExclusive ?? Number.POSITIVE_INFINITY,
        120,
      ),
    };
  }
  if (message === "comforting") {
    nextContext = {
      ...nextContext,
      preferredMoods: unique([...nextContext.preferredMoods, "comforting"]),
    };
  }
  if (message === "good-cry") {
    nextContext = {
      ...nextContext,
      preferredMoods: unique([...nextContext.preferredMoods, "emotional"]),
    };
  }
  if (message === "scary") {
    nextContext = {
      ...nextContext,
      requiredGenres: unique([...nextContext.requiredGenres, "Horror"]),
      preferredMoods: unique([...nextContext.preferredMoods, "scary"]),
    };
  }

  const quickPick = [
    "comforting",
    "good-cry",
    "scary",
    "pick-for-me",
    "surprise",
    "comedy",
    "romantic-comedy",
    "something-light",
    "under-2-hours",
  ].includes(message);

  if (parsed.hasRecommendationIntent || quickPick || stage === "funny") {
    return selectRecommendation(nextContext, isMovieWatched);
  }

  return {
    stage: "funny",
    text: "That sounds fun! Tell me a genre, mood or maximum runtime and I'll narrow it down.",
    quickReplies: funnyQuickReplies,
    recommendationContext: context,
  };
}
