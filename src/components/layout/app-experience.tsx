"use client";

import type { ReactNode } from "react";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { useSettings } from "@/components/providers/settings-provider";
import { SettingsBackgroundOverlay } from "@/components/settings/settings-background-overlay";

function CinematicBackground() {
  return (
    <div
      aria-hidden="true"
      data-cinematic-background
      className="pointer-events-none fixed inset-0 z-0 min-h-dvh w-screen bg-[url('/assets/background.jpg')] bg-cover bg-top bg-no-repeat"
    />
  );
}

export function AppExperience({ children }: { children: ReactNode }) {
  const { isHydrated, onboardingCompleted } = useSettings();

  if (!isHydrated) {
    return <div className="min-h-dvh bg-background" />;
  }

  if (!onboardingCompleted) {
    return (
      <div className="relative min-h-dvh">
        <CinematicBackground />
        <div
          aria-hidden="true"
          data-background-overlay
          className="pointer-events-none fixed inset-0 z-0 bg-black/35"
        />
        <div
          data-app-shell
          className="relative z-10 mx-auto min-h-dvh w-full max-w-[var(--content-width)] overflow-hidden"
        >
          <OnboardingFlow />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh">
      <CinematicBackground />
      <div
        data-app-shell
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[var(--content-width)] flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-20 sm:px-6"
      >
        <SettingsBackgroundOverlay />
        <main className="relative z-10 flex flex-1 flex-col">{children}</main>
        <BottomNavigation />
      </div>
    </div>
  );
}
