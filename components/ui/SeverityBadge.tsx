import { SEVERITY_META } from "@/lib/severity";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: ThreatSeverity;
  size?: "sm" | "md";
  className?: string;
}

export function SeverityBadge({
  severity,
  size = "sm",
  className,
}: SeverityBadgeProps) {
  const meta = SEVERITY_META[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider",
        meta.className,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} aria-hidden />
      {meta.label}
    </span>
  );
}
