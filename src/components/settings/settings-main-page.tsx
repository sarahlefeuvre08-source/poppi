"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { MainPageHeader } from "@/components/layout/main-page-header";
import { useSettings } from "@/components/providers/settings-provider";
import { SettingsRow } from "@/components/settings/settings-row";

export function SettingsMainPage() {
  const { profile } = useSettings();
  const [notice, setNotice] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 pb-5">
      <MainPageHeader
        title="Settings"
        description="Manage your preferences."
      />

      <section className="text-center">
        <Link
          href="/settings/edit-profile"
          aria-label="Edit profile"
          className="mx-auto flex w-fit min-w-32 flex-col items-center rounded-2xl bg-transparent px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="relative h-24 w-24 overflow-hidden rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
            <Image
              src="/assets/avatar.png"
              alt=""
              fill
              priority
              sizes="96px"
              className="object-cover"
            />
          </span>
          <span className="mt-3 text-xl font-semibold tracking-[-0.03em]">
            {profile.displayName}
          </span>
          <span className="mt-1 text-sm font-semibold text-accent-on-dark">
            Edit profile
          </span>
        </Link>
      </section>

      <div className="space-y-5">
        <section aria-labelledby="preferences-heading">
          <h2 id="preferences-heading" className="mb-2 text-sm font-bold tracking-[0.06em] text-white/65">
            PREFERENCES
          </h2>
          <SettingsRow
            icon="heart"
            title="Movie preferences"
            subtitle="Genre, duration, and recommendations"
            href="/settings/movie-preferences"
          />
        </section>

        <section aria-labelledby="app-heading">
          <h2 id="app-heading" className="mb-2 text-sm font-bold tracking-[0.06em] text-white/65">
            APP
          </h2>
          <SettingsRow icon="globe" title="Language" subtitle="English" />
        </section>

        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="mb-2 text-sm font-bold tracking-[0.06em] text-white/65">
            ABOUT
          </h2>
          <div className="space-y-2.5">
            <SettingsRow
              icon="info"
              title="About Poppi"
              subtitle="Learn more about your movie buddy"
              href="/settings/about"
            />
            <SettingsRow
              icon="lock"
              title="Privacy"
              href="/settings/privacy"
            />
            <SettingsRow
              icon="document"
              title="Terms"
              href="/settings/terms"
            />
          </div>
        </section>
      </div>

      <div className="space-y-2 text-center">
        <button
          type="button"
          onClick={() =>
            setNotice(
              "Log out is unavailable in this prototype because no account session is connected.",
            )
          }
          className="min-h-12 w-full rounded-xl border border-accent/70 bg-accent/10 px-5 text-sm font-semibold text-accent-on-dark transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Log out
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="min-h-10 px-4 text-base text-accent-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Delete account
        </button>
        {notice && (
          <p role="status" className="mx-auto max-w-xs text-xs leading-5 text-white/75">
            {notice}
          </p>
        )}
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center px-6">
          <button
            type="button"
            aria-label="Close delete account dialog"
            onClick={() => setIsDeleteDialogOpen(false)}
            className="absolute inset-0 bg-black/75"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative z-10 w-full max-w-sm rounded-3xl border border-white/15 bg-[#252525] p-5 shadow-2xl"
          >
            <h2 id="delete-account-title" className="text-lg font-bold">
              Delete account?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Account deletion is not connected in this prototype. No account
              or data will be deleted.
            </p>
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="mt-5 min-h-11 w-full rounded-xl bg-accent px-4 text-sm font-bold"
            >
              Keep account
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
