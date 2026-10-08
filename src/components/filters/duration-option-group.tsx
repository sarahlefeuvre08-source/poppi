"use client";

import { useI18n } from "@/i18n/provider";

export const durationOptions = [
  { labelKey: "filters.any", value: "any" },
  { labelKey: "filters.under90", value: "under-90" },
  { labelKey: "filters.under2h", value: "under-120" },
  { labelKey: "filters.2hPlus", value: "120-plus" },
] as const;

export type DurationOption = (typeof durationOptions)[number]["value"];

type DurationOptionGroupProps = {
  value: DurationOption;
  onChange: (value: DurationOption) => void;
};

export function DurationOptionGroup({ value, onChange }: DurationOptionGroupProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-2 min-[351px]:grid-cols-4">
      {durationOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`poppi-control min-h-8 min-w-0 whitespace-nowrap rounded-full border px-1.5 text-xs leading-none font-medium ${value === option.value ? "border-accent bg-accent" : "border-white/45 bg-transparent"}`}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
}
