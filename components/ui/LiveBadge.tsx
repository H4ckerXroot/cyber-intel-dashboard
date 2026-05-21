import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function LiveBadge({ className, size = "md" }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-800/60 font-medium uppercase tracking-wider text-slate-300",
        size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute h-full w-full rounded-full bg-emerald-500/40 animate-subtle-pulse" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}
