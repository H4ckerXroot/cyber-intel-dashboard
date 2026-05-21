import { getCategoryMeta } from "@/lib/categories";
import type { ThreatCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const BADGE_STYLES: Record<ThreatCategory, string> = {
  "latest-threat-news":
    "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "cve-alerts": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "malware-analysis": "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "ransomware-updates": "bg-red-500/15 text-red-300 border-red-500/30",
  "threat-actors": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "government-advisories":
    "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

interface CategoryBadgeProps {
  category: ThreatCategory;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  category,
  size = "sm",
  className,
}: CategoryBadgeProps) {
  const meta = getCategoryMeta(category);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium tracking-wide uppercase",
        BADGE_STYLES[category],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
