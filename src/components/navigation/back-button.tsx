"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";

type BackButtonProps = {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function BackButton({ href, onClick }: BackButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Go back"
      className="secondary-control poppi-control grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </Link>
  );
}
