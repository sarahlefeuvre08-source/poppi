"use client";

import Image from "next/image";

import { useSettings } from "@/components/providers/settings-provider";

export function UserGreeting() {
  const { profile } = useSettings();

  return (
    <header className="flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
        <Image
          src="/assets/avatar.png"
          alt={profile.displayName}
          fill
          priority
          sizes="44px"
          className="object-cover"
        />
      </div>
      <h1 className="text-[1.4rem] font-bold tracking-[-0.03em]">
        Hi, {profile.displayName}!
      </h1>
    </header>
  );
}
