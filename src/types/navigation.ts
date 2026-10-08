export type NavIconName =
  | "home"
  | "watched"
  | "poppi"
  | "watchlist"
  | "settings";

export type NavigationItem = {
  labelKey: TranslationKey;
  href: string;
  icon: NavIconName;
};
import type { TranslationKey } from "@/i18n/types";
