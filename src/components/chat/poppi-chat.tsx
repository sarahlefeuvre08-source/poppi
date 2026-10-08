"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ChatMovieRecommendation } from "@/components/chat/chat-movie-recommendation";
import { usePoppiConversation } from "@/components/providers/poppi-conversation-provider";
import { getMovieById } from "@/data/movies";
import { useI18n } from "@/i18n/provider";
import { getQuickReplyLabel } from "@/lib/mock-poppi";

export function PoppiChat() {
  const {
    messages,
    quickReplies,
    draft,
    scrollPositionRef,
    setDraft,
    sendMessage,
  } =
    usePoppiConversation();
  const conversationRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef(messages.at(-1)?.id);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const { locale, t } = useI18n();

  const updateScrollToLatestVisibility = useCallback(() => {
    const conversation = conversationRef.current;
    if (!conversation) return;

    const distanceFromBottom =
      conversation.scrollHeight -
      conversation.clientHeight -
      conversation.scrollTop;
    setShowScrollToLatest(distanceFromBottom > 96);
  }, []);

  const scrollToLatest = useCallback(() => {
    const conversation = conversationRef.current;
    if (!conversation) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    conversation.scrollTo({
      top: conversation.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, []);

  useLayoutEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation) return;

    conversation.scrollTop = scrollPositionRef.current;
    let restoreAfterPaintFrame: number | undefined;
    const restoreFrame = window.requestAnimationFrame(() => {
      restoreAfterPaintFrame = window.requestAnimationFrame(() => {
        conversation.scrollTop = scrollPositionRef.current;
        updateScrollToLatestVisibility();
      });
    });

    return () => {
      window.cancelAnimationFrame(restoreFrame);
      if (restoreAfterPaintFrame !== undefined) {
        window.cancelAnimationFrame(restoreAfterPaintFrame);
      }
      scrollPositionRef.current = conversation.scrollTop;
    };
  }, [scrollPositionRef, updateScrollToLatestVisibility]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation) return;

    const lastMessageId = messages.at(-1)?.id;
    if (lastMessageIdRef.current === lastMessageId) return;
    lastMessageIdRef.current = lastMessageId;
    scrollToLatest();
  }, [messages, quickReplies, scrollToLatest]);

  return (
    <div className="relative flex h-[calc(100dvh_-_5.75rem_-_env(safe-area-inset-top))] min-h-0 flex-col pb-1">
      <header className="shrink-0 pb-3">
        <h1 className="text-[1.7rem] leading-none font-bold tracking-[-0.04em]">
          Poppi
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{t("chat.tagline")}</p>
      </header>

      <div
        ref={conversationRef}
        aria-live="polite"
        aria-label={t("chat.conversationAria")}
        onScroll={updateScrollToLatestVisibility}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pb-3 [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-h-full flex-col justify-end gap-4 pb-[max(3.5rem,calc(3rem+env(safe-area-inset-bottom)))]">
          {messages.map((message) => {
            const recommendation = message.recommendationId
              ? getMovieById(message.recommendationId)
              : undefined;

            return message.role === "user" ? (
              <div
                key={message.id}
                className="ml-auto max-w-[82%] whitespace-pre-line rounded-[1.25rem] rounded-br-md bg-accent px-4 py-3 text-sm leading-5 text-white"
              >
                {message.text}
              </div>
            ) : (
              <div key={message.id} className="flex items-end gap-2.5">
                <div className="relative mb-1 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#fbf7ef]">
                  <Image
                    src="/assets/poppi-avatar.png"
                    alt={t("common.poppiAlt")}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 max-w-[calc(100%-3.25rem)]">
                  <div className="whitespace-pre-line rounded-[1.25rem] rounded-bl-md border border-white/10 bg-[#242424]/95 px-4 py-3 text-sm leading-5 shadow-lg backdrop-blur-md">
                    {message.id === "welcome" ? t("chat.welcome") : message.text}
                  </div>
                  {recommendation && (
                    <ChatMovieRecommendation movie={recommendation} />
                  )}
                </div>
              </div>
            );
          })}

          {quickReplies.length > 0 && (
            <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-2">
              {quickReplies.map((reply) => {
                const label = getQuickReplyLabel(locale, reply);
                return (
                <button
                  key={reply.value}
                  type="button"
                  onClick={() => sendMessage(reply.value, label)}
                  className="min-h-11 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-center text-xs font-medium text-white backdrop-blur-md transition-colors hover:border-accent/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {label}
                </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showScrollToLatest && (
        <button
          type="button"
          aria-label={t("chat.scrollLatest")}
          onClick={scrollToLatest}
          className="chat-scroll-latest poppi-control absolute right-2 bottom-[4.6rem] z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-[#242424]/95 text-white shadow-lg backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}

      <form
        className="flex shrink-0 items-end gap-2 rounded-[1.45rem] border border-white/20 bg-[#202020]/95 p-2 pl-4 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent motion-reduce:transition-none"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(draft);
        }}
      >
        <label htmlFor="poppi-message" className="sr-only">
          {t("chat.messageLabel")}
        </label>
        <textarea
          id="poppi-message"
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage(draft);
            }
          }}
          placeholder={t("chat.placeholder")}
          className="max-h-24 min-h-11 flex-1 resize-none bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/55"
        />
        <button
          type="submit"
          aria-label={t("chat.send")}
          disabled={!draft.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
