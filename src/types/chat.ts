export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  recommendationId?: string;
};

export type QuickReply = {
  label: string;
  value: string;
};

export type ConversationStage = "welcome" | "funny" | "recommendation";

export type RecommendationContext = {
  currentRecommendationId?: string;
  excludedMovieIds: string[];
  requiredGenres: string[];
  preferredMoods: RecommendationTag[];
  excludeRomance: boolean;
  minRuntimeExclusive?: number;
  maxRuntimeExclusive?: number;
};

export type MockChatResponse = {
  stage: ConversationStage;
  text: string;
  quickReplies: QuickReply[];
  recommendationId?: string;
  recommendationContext: RecommendationContext;
};
import type { RecommendationTag } from "@/types/movie";
