import type { ChangeEventHandler, ReactNode } from "react";

type FilterSelectProps = {
  children: ReactNode;
  value: string | number;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  textSize?: "base" | "sm";
};

export function FilterSelect({
  children,
  value,
  onChange,
  textSize = "base",
}: FilterSelectProps) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={onChange}
        className={`h-12 w-full appearance-none rounded-xl border border-white/35 bg-transparent py-0 pr-10 pl-3 text-white outline-none focus:border-accent ${textSize === "sm" ? "text-sm" : "text-base"}`}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </span>
  );
}
