import type { MouseEventHandler } from "react";

import { BackButton } from "@/components/navigation/back-button";
type SettingsPageHeaderProps = {
  backHref?: string;
  backOnClick?: MouseEventHandler<HTMLAnchorElement>;
  title: string;
  description?: string;
};

export function SettingsPageHeader({
  backHref = "/settings",
  backOnClick,
  title,
  description,
}: SettingsPageHeaderProps) {
  return (
    <header>
      <BackButton href={backHref} onClick={backOnClick} />
      <h1 className="mt-2.5 text-[1.55rem] leading-none font-bold tracking-[-0.04em]">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm leading-5 text-text-secondary">{description}</p>
      )}
    </header>
  );
}
