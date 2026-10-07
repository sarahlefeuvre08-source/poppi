import type { NavIconName } from "@/types/navigation";

type NavIconProps = {
  name: NavIconName;
};

export function NavIcon({ name }: NavIconProps) {
  const paths: Record<NavIconName, React.ReactNode> = {
    home: (
      <>
        <path d="m3.5 10 8.5-7 8.5 7" />
        <path d="M5.5 9v11h13V9M9 20v-6h6v6" />
      </>
    ),
    watched: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m9.5 9 6 3-6 3V9Z" />
      </>
    ),
    poppi: (
      <>
        <path d="M12 3a8 8 0 0 0-6.7 12.4L4 21l5.6-1.3A8 8 0 1 0 12 3Z" />
        <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
      </>
    ),
    watchlist: (
      <>
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
        <path d="M9 8h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
