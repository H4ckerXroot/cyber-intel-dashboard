import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: string;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-[160px] truncate rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400",
        className
      )}
      title={source}
    >
      {source}
    </span>
  );
}
