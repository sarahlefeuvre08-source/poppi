"use client";

import Image from "next/image";

import { SettingsPageHeader } from "@/components/settings/settings-page-header";
import { useI18n } from "@/i18n/provider";

export function AboutPoppiPage() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-6 pb-5">
      <SettingsPageHeader title={t("about.title")} />

      <section className="text-center">
        <div className="relative mx-auto h-28 w-28">
          <Image
            src="/assets/poppi.png"
            alt={t("common.poppiMascotAlt")}
            fill
            priority
            sizes="112px"
            className="object-contain"
          />
        </div>
        <h2 className="mt-3 text-lg font-bold tracking-[-0.025em]">
          {t("about.tagline")}
        </h2>
        <p className="mt-3 text-sm leading-5 text-white/90">
          {t("about.description")}
        </p>
      </section>

      <AboutSection title={t("about.appInformation")}>
        <DefinitionItem term={t("about.version")}>1.0.0</DefinitionItem>
        <DefinitionItem term={t("about.madeBy")}>Sarah Lefeuvre</DefinitionItem>
        <DefinitionItem term={t("about.movieData")}>
          {t("about.localCatalog")}
        </DefinitionItem>
      </AboutSection>

      <AboutSection title={t("about.credits")} bordered>
        <DefinitionItem term={t("about.designDevelopment")}>
          Sarah Lefeuvre
        </DefinitionItem>
        <DefinitionItem term={t("about.mascot")}>{t("about.designedBy")}</DefinitionItem>
      </AboutSection>
    </div>
  );
}

function AboutSection({
  title,
  bordered = false,
  children,
}: {
  title: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={bordered ? "border-t border-white/20 pt-4" : ""}>
      <h2 className="text-sm font-bold tracking-[0.06em] text-white/65">
        {title}
      </h2>
      <dl className="mt-3 space-y-3">{children}</dl>
    </section>
  );
}

function DefinitionItem({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm font-semibold">{term}</dt>
      <dd className="mt-1 text-xs leading-5 text-white/75">{children}</dd>
    </div>
  );
}
