type PlusIconProps = {
  className?: string;
};

export function PlusIcon({ className = "h-5 w-5" }: PlusIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path d="M10 4v12M4 10h12" />
      </svg>
    </span>
  );
}
