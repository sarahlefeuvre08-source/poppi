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
      <fieldset className="space-y-2.5">
        <legend className="sr-only">{t("settings.language")}</legend>
        {options.map((option) => (
          <label
            key={option.value}
            className="poppi-control flex min-h-14 cursor-pointer items-center justify-between rounded-xl border border-white/25 bg-[#292929]/90 px-4 text-sm font-semibold backdrop-blur-md"
          >
            {option.label}
            <input
              type="radio"
              name="language"
              value={option.value}
              checked={locale === option.value}
              onChange={() => setLocale(option.value)}
              className="h-5 w-5 shrink-0 appearance-none rounded-full border border-white bg-transparent checked:bg-accent"
            />
          </label>
        ))}
      </fieldset>
    </div>
  );
}
