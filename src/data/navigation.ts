import type { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  { labelKey: "nav.home", href: "/", icon: "home" },
  { labelKey: "nav.watched", href: "/watched", icon: "watched" },
  { labelKey: "nav.poppi", href: "/poppi", icon: "poppi" },
  { labelKey: "nav.toWatch", href: "/to-watch", icon: "watchlist" },
  { labelKey: "nav.settings", href: "/settings", icon: "settings" },
];
