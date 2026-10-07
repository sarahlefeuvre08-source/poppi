import { SettingsPageHeader } from "@/components/settings/settings-page-header";

type LegalSection = {
  heading: string;
  content: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <article className="flex flex-col gap-5 pb-5">
      <SettingsPageHeader title={title} description={intro} />

      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-sm font-bold tracking-[0.055em] text-white/65">
            {section.heading}
          </h2>
          <div className="mt-3 space-y-4 text-xs leading-[1.45] text-white/90">
            {section.content}
          </div>
        </section>
      ))}

      <p className="text-xs text-white/90">Last updated: October 2026</p>
    </article>
  );
}
