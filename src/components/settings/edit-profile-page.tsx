"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { useSettings } from "@/components/providers/settings-provider";
import { SettingsIcon } from "@/components/settings/settings-icon";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";

export function EditProfilePage() {
  const router = useRouter();
  const { profile, saveProfile } = useSettings();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatarNotice, setAvatarNotice] = useState(false);

  useEffect(() => {
    // Keep the form aligned when persisted settings finish hydrating.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(profile.displayName);
  }, [profile.displayName]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = displayName.trim();
    if (!trimmedName) return;
    saveProfile({ displayName: trimmedName });
    router.push("/settings");
  }

  return (
    <div className="flex flex-col gap-5 pb-5">
      <SettingsPageHeader
        title="Edit profile"
        description="Manage your personal information."
      />

      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/30 shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
            <Image
              src="/assets/avatar.png"
              alt={profile.displayName}
              fill
              priority
              sizes="112px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            aria-label="Edit avatar"
            onClick={() => setAvatarNotice(true)}
            className="poppi-control absolute right-0 bottom-0 grid h-10 w-10 place-items-center rounded-full border-2 border-[#171717] bg-accent text-black"
          >
            <SettingsIcon name="pencil" />
          </button>
        </div>
        {avatarNotice && (
          <p role="status" className="mt-3 text-center text-xs text-white/70">
            Avatar editing is not connected in this prototype.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-1 flex flex-col items-end gap-4">
        <label className="w-full rounded-[1.35rem] border border-white/35 bg-[#292929]/90 px-3 py-2 backdrop-blur-md focus-within:border-accent">
          <span className="block text-xs text-white/70">Display name</span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            maxLength={40}
            className="mt-1 w-full bg-transparent text-sm text-white outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!displayName.trim()}
          className="poppi-control min-h-10 rounded-full bg-accent px-5 text-sm font-semibold text-white disabled:opacity-45"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
