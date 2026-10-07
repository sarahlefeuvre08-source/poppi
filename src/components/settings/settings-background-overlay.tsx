"use client";

import { usePathname } from "next/navigation";

export function SettingsBackgroundOverlay() {
  const pathname = usePathname();
  if (!pathname.startsWith("/settings")) return null;

  return (
    <div
      aria-hidden="true"
      data-background-overlay
      className="pointer-events-none fixed inset-0 z-0 bg-black/25"
    />
  );
}
