import { TAG_META } from "@/lib/enrichment/tags";
import type { ThreatTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatTagBadgeProps {
  tag: ThreatTag;
  size?: "sm" | "md";
  className?: string;
}

export function ThreatTagBadge({
  tag,
  size = "sm",
  className,
}: ThreatTagBadgeProps) {
  const meta = TAG_META[tag];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border font-medium",
        meta.className,
        size === "sm" ? "px-1.5 py-px text-[9px]" : "px-2 py-0.5 text-[10px]",
        className
      )}
    >
      {meta.label}
    </span>
  );
}
