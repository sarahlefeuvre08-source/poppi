"use client";

import { type RefObject, useRef } from "react";

import { useI18n } from "@/i18n/provider";

type MovieSearchInputProps = {
  clearLabel?: string;
  id: string;
  inputClassName: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  label?: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  query: string;
  readOnly?: boolean;
};

export function MovieSearchInput({
  clearLabel,
  id,
  inputClassName,
  inputRef,
  label,
  onQueryChange,
  placeholder,
  query,
  readOnly = false,
}: MovieSearchInputProps) {
  const { t } = useI18n();
  const localInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef ?? localInputRef;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label ?? t("common.searchMovie")}
      </label>
      <input
        ref={resolvedInputRef}
        id={id}
        type="text"
        role="searchbox"
        enterKeyHint="search"
        autoComplete="off"
        readOnly={readOnly}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder ?? t("common.searchMovie")}
        className={`appearance-none ${inputClassName}`}
      />
      {query ? (
        <button
          type="button"
          aria-label={clearLabel ?? t("common.clearSearch")}
          onClick={() => {
            onQueryChange("");
            resolvedInputRef.current?.focus();
          }}
          className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-5 h-7 w-7 -translate-y-1/2 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
      )}
    </div>
  );
}
