import Image from "next/image";

import { SettingsPageHeader } from "@/components/settings/settings-page-header";

export function AboutPoppiPage() {
  return (
    <div className="flex flex-col gap-6 pb-5">
      <SettingsPageHeader title="About Poppi" />

      <section className="text-center">
        <div className="relative mx-auto h-28 w-28">
          <Image
            src="/assets/poppi.png"
            alt="Poppi mascot"
            fill
            priority
            sizes="112px"
            className="object-contain"
          />
        </div>
        <h2 className="mt-3 text-lg font-bold tracking-[-0.025em]">
          Poppi: your movie buddy
        </h2>
        <p className="mt-3 text-sm leading-5 text-white/90">
          Not sure what to watch? Poppi helps you discover movies that match
          your tastes, your mood and the moment.
        </p>
      </section>

      <AboutSection title="APP INFORMATION">
        <DefinitionItem term="Version">1.0.0</DefinitionItem>
        <DefinitionItem term="Made by">Sarah Lefeuvre</DefinitionItem>
        <DefinitionItem term="Movie data">
          Local prototype movie catalog
        </DefinitionItem>
      </AboutSection>

      <AboutSection title="CREDITS" bordered>
        <DefinitionItem term="Design & Development">
          Sarah Lefeuvre
        </DefinitionItem>
        <DefinitionItem term="Poppi mascot">Designed by Sarah</DefinitionItem>
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

