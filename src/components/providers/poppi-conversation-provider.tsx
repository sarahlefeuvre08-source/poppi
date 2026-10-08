"use client";

import {
  createContext,
  type MutableRefObject,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getMockPoppiResponse,
  initialQuickReplies,
  initialRecommendationContext,
} from "@/lib/mock-poppi";
import { useMovieLibrary } from "@/components/providers/movie-library-provider";
import { useI18n } from "@/i18n/provider";
import type {
  ChatMessage,
  ConversationStage,
  QuickReply,
  RecommendationContext,
} from "@/types/chat";

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi, I'm Poppi! 🍿\nTell me what you're in the mood for, and I'll find something just right.",
};

type PoppiConversationContextValue = {
  messages: ChatMessage[];
  quickReplies: QuickReply[];
  draft: string;
  scrollPositionRef: MutableRefObject<number>;
  setDraft: (draft: string) => void;
  sendMessage: (text: string, displayText?: string) => void;
};

const PoppiConversationContext =
  createContext<PoppiConversationContextValue | null>(null);

export function PoppiConversationProvider({ children }: { children: ReactNode }) {
  const { isWatched } = useMovieLibrary();
  const { locale } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [quickReplies, setQuickReplies] =
    useState<QuickReply[]>(initialQuickReplies);
  const [stage, setStage] = useState<ConversationStage>("welcome");
  const [recommendationContext, setRecommendationContext] =
    useState<RecommendationContext>(initialRecommendationContext);
  const [draft, setDraft] = useState("");
  const messageCounterRef = useRef(0);
  const scrollPositionRef = useRef(0);

  const value = useMemo<PoppiConversationContextValue>(
    () => ({
      messages,
      quickReplies,
      draft,
      scrollPositionRef,
      setDraft,
      sendMessage: (text, displayText = text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const response = getMockPoppiResponse(
          trimmed,
          stage,
          recommendationContext,
          isWatched,
          locale,
        );
        messageCounterRef.current += 1;
        const messageId = `message-${messageCounterRef.current}`;

        setMessages((current) => [
          ...current,
          { id: `${messageId}-user`, role: "user", text: displayText.trim() },
          {
            id: `${messageId}-assistant`,
            role: "assistant",
            text: response.text,
            recommendationId: response.recommendationId,
          },
        ]);
        setStage(response.stage);
        setRecommendationContext(response.recommendationContext);
        setQuickReplies(response.quickReplies);
        setDraft("");
      },
    }),
    [draft, isWatched, locale, messages, quickReplies, recommendationContext, stage],
  );

  return (
    <PoppiConversationContext.Provider value={value}>
      {children}
    </PoppiConversationContext.Provider>
  );
}

export function usePoppiConversation() {
  const context = useContext(PoppiConversationContext);
  if (!context) {
    throw new Error(
      "usePoppiConversation must be used within PoppiConversationProvider",
    );
  }
  return context;
}
