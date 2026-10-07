export const durationOptions = [
  { label: "Any", value: "any" },
  { label: "< 90 min", value: "under-90" },
  { label: "< 2h", value: "under-120" },
  { label: "2h+", value: "120-plus" },
] as const;

export type DurationOption = (typeof durationOptions)[number]["value"];

type DurationOptionGroupProps = {
  value: DurationOption;
  onChange: (value: DurationOption) => void;
};

export function DurationOptionGroup({
  value,
  onChange,
}: DurationOptionGroupProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {durationOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`poppi-control min-h-8 min-w-0 whitespace-nowrap rounded-full border px-1.5 text-xs leading-none font-medium ${value === option.value ? "border-accent bg-accent" : "border-white/45 bg-transparent"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
