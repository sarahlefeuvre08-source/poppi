"use client";

import type { CSSProperties } from "react";
import { useI18n } from "@/i18n/provider";

export type RecommendationStyleOption<T extends string> = {
  label: string;
  value: T;
};

type RecommendationStyleSliderProps<T extends string> = {
  options: readonly RecommendationStyleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  trackOuterInset?: string;
  className?: string;
};

type SliderStyle = CSSProperties & {
  "--slider-track-inset": string;
};

export function RecommendationStyleSlider<T extends string>({
  options,
  value,
  onChange,
  trackOuterInset = "0px",
  className = "",
}: RecommendationStyleSliderProps<T>) {
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
  const style: SliderStyle = { "--slider-track-inset": trackOuterInset };
  const { t } = useI18n();

  return (
    <div className={`recommendation-style-slider relative h-8 ${className}`} style={style}>
      <div className="recommendation-style-slider__track" />
      <div className="recommendation-style-slider__stops">
        {options.map((option) => (
          <span
            key={option.value}
            className={`recommendation-style-slider__stop ${value === option.value ? "bg-accent" : "bg-[#d9d9d9]"}`}
          />
        ))}
      </div>
      <input
        type="range"
        min="0"
        max={options.length - 1}
        step="1"
        value={selectedIndex}
        aria-label={t("preferences.recommendationStyle")}
        aria-valuetext={selected?.label}
        onChange={(event) => onChange(options[Number(event.target.value)].value)}
        className="poppi-range-discrete recommendation-style-slider__input"
      />
    </div>
  );
}
