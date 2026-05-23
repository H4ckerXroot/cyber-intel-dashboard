import { getCategoryMeta } from "@/lib/categories";
import type { ThreatCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const BADGE_STYLES: Record<ThreatCategory, string> = {
  "latest-threat-news":
    "bg-blue-950/40 text-blue-300/90 border-blue-900/40",
  "cve-alerts": "bg-amber-950/35 text-amber-300/90 border-amber-900/40",
  "malware-analysis": "bg-violet-950/35 text-violet-300/90 border-violet-900/40",
  "ransomware-updates": "bg-red-950/40 text-red-300/90 border-red-900/40",
  "threat-actors": "bg-slate-800/50 text-slate-300 border-slate-700/50",
  "government-advisories":
    "bg-indigo-950/35 text-indigo-300/90 border-indigo-900/40",
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
        "inline-flex items-center gap-0.5 rounded border font-medium uppercase tracking-wide",
        BADGE_STYLES[category],
        size === "sm" ? "px-1.5 py-px text-[9px]" : "px-2 py-0.5 text-[10px]",
        className
      )}
    >
      <span aria-hidden className="opacity-70">
        {meta.icon}
      </span>
      {meta.label}
    </span>
  );
}
