import Link from "next/link";

import {
  SettingsIcon,
  type SettingsIconName,
} from "@/components/settings/settings-icon";

type SettingsRowProps = {
  title: string;
  subtitle?: string;
  icon: SettingsIconName;
  href?: string;
};

export function SettingsRow({ title, subtitle, icon, href }: SettingsRowProps) {
  const content = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/12 text-white/75">
        <SettingsIcon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        {subtitle && (
          <span className="mt-0.5 block text-xs leading-5 text-white/80">
            {subtitle}
          </span>
        )}
      </span>
      {href && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </>
  );

  const className =
    "flex min-h-[4.25rem] w-full items-center gap-3 rounded-xl border border-white/35 bg-[#292929]/90 px-3 py-2.5 text-left backdrop-blur-md";

  return href ? (
    <Link
      href={href}
      className={`${className} poppi-control`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
