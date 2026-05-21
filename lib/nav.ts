import { CATEGORIES } from "./categories";

export type NavSectionId =
  | "overview"
  | "latest-threat-news"
  | "cve-alerts"
  | "malware-analysis"
  | "ransomware-updates"
  | "threat-actors"
  | "government-advisories"
  | "reports-analytics"
  | "saved-articles"
  | "watchlist";

export interface NavItem {
  id: NavSectionId;
  label: string;
  icon: string;
  group?: "main" | "intel" | "personal";
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: "◉", group: "main" },
  ...CATEGORIES.map((c) => ({
    id: c.id as NavSectionId,
    label: c.label,
    icon: c.icon,
    group: "intel" as const,
  })),
  {
    id: "reports-analytics",
    label: "Reports & Analytics",
    icon: "📊",
    group: "personal",
  },
  { id: "saved-articles", label: "Saved Articles", icon: "★", group: "personal" },
  { id: "watchlist", label: "Watchlist", icon: "◎", group: "personal" },
];
