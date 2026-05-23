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
        "inline-flex items-center rounded-full border font-medium",
        meta.className,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      {meta.label}
    </span>
  );
}
