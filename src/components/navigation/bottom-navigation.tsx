"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMovieSearch } from "@/components/providers/movie-search-provider";
import { navigationItems } from "@/data/navigation";
import { useI18n } from "@/i18n/provider";

import { NavIcon } from "./nav-icon";

export function BottomNavigation() {
  const pathname = usePathname();
  const { resetSearch } = useMovieSearch();
  const { t } = useI18n();

  return (
    <nav
      aria-label={t("nav.label")}
      className="fixed bottom-0 left-1/2 z-20 w-[calc(100%-2rem)] max-w-[calc(var(--content-width)-2rem)] -translate-x-1/2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="grid grid-cols-5 rounded-[1.35rem] border border-border bg-[#161616]/95 p-1 shadow-[0_14px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/settings" && pathname.startsWith("/settings/")) ||
            (item.href === "/" &&
              (pathname.startsWith("/movies/") || pathname === "/search"));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (pathname === "/search" && item.href === "/") {
                  resetSearch();
                }
              }}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-[1rem] px-1 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? "bg-accent/12 text-accent"
                  : "text-text-secondary hover:bg-surface-strong hover:text-white"
              }`}
            >
              <NavIcon name={item.icon} />
              <span className="w-full truncate text-[0.6rem] font-semibold tracking-[-0.01em]">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
