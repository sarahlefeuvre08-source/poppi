"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export function SearchEntry() {
  const { t } = useI18n();
  return (
    <Link
      href="/search"
      aria-label={t("home.searchLabel")}
      className="group flex min-h-20 items-center gap-3 rounded-[1.15rem] border border-white/25 bg-[#252525]/90 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors hover:bg-[#2d2d2d]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-8 w-8 shrink-0 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </svg>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-white">
          {t("home.searchTitle")}
        </span>
        <span className="mt-0.5 block text-sm text-text-secondary">
          {t("home.searchDescription")}
        </span>
      </span>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform group-hover:translate-x-0.5">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
