type MainPageHeaderProps = {
  title: string;
  description?: string;
};

export function MainPageHeader({
  title,
  description,
}: MainPageHeaderProps) {
  return (
    <header>
      <h1 className="text-[1.7rem] leading-none font-bold tracking-[-0.04em]">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
    </header>
  );
}
