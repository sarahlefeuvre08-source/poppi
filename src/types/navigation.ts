export type NavIconName =
  | "home"
  | "watched"
  | "poppi"
  | "watchlist"
  | "settings";

export type NavigationItem = {
  label: string;
  href: string;
  icon: NavIconName;
};
