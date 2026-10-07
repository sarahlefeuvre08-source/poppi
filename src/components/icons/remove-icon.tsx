type RemoveIconProps = {
  className?: string;
};

export function RemoveIcon({ className = "h-5 w-5" }: RemoveIconProps) {
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
        <path d="m5 5 10 10M15 5 5 15" />
      </svg>
    </span>
  );
}
