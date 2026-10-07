type ToggleSwitchProps = {
  ariaLabel: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ToggleSwitch({
  ariaLabel,
  checked,
  onCheckedChange,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className="poppi-control grid h-11 w-14 shrink-0 place-items-center rounded-full"
    >
      <span
        aria-hidden="true"
        className={`relative block h-6 w-10 rounded-full border border-white/25 transition-colors ${checked ? "bg-accent" : "bg-white/45"}`}
      >
        <span
          className={`absolute top-1/2 left-0.5 block h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </span>
    </button>
  );
}
