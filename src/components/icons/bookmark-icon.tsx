type BookmarkIconProps = {
  filled?: boolean;
  className?: string;
};

export function BookmarkIcon({
  filled = false,
  className = "h-[1.375rem] w-[1.375rem]",
}: BookmarkIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5v14.72a.75.75 0 0 1-1.17.62L12 17.25l-3.83 2.59A.75.75 0 0 1 7 19.22V4.5Z" />
    </svg>
  );
}
