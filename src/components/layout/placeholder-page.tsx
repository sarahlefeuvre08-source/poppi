type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="flex flex-1 flex-col gap-8 pb-8">
      <div className="pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-on-dark">
          {eyebrow}
        </p>
        <h1 className="max-w-sm text-4xl leading-[1.04] font-bold tracking-[-0.045em] text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-sm text-base leading-7 text-text-secondary">
          {description}
        </p>
      </div>

      <div className="mt-auto rounded-card border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="mb-5 h-10 w-10 rounded-2xl bg-accent/15 p-3">
          <div className="h-full w-full rounded-full bg-accent" />
        </div>
        <p className="font-semibold tracking-[-0.02em]">This space is ready.</p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          We’ll build this part of Poppi together in a future step.
        </p>
      </div>
    </section>
  );
}
