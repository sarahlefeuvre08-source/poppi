"use client";

import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { useI18n } from "@/i18n/provider";
import type { Locale } from "@/i18n/types";

export function LanguagePage() {
  const { locale, setLocale, t } = useI18n();
  const options: Array<{ value: Locale; label: string }> = [
    { value: "en", label: t("settings.english") },
    { value: "fr", label: t("settings.french") },
  ];

  return (
    <div className="flex flex-col gap-5 pb-5">
      <SettingsPageHeader
        title={t("settings.language")}
        description={t("settings.languageDescription")}
      />
      <div role="group" aria-label={t("settings.language")} className="space-y-2.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={locale === option.value}
            onClick={() => setLocale(option.value)}
            className="poppi-control grid min-h-14 w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-white/25 bg-[#292929]/90 px-4 text-left text-sm font-semibold backdrop-blur-md"
          >
            {option.label}
            <span
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 rounded-full border border-white ${locale === option.value ? "bg-accent" : "bg-transparent"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
