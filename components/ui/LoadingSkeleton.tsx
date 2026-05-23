import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function NewsCardSkeleton() {
  return (
    <div className="soc-card animate-pulse overflow-hidden">
      <div className="skeleton-shimmer h-[7.25rem]" />
      <div className="space-y-2 p-2.5">
        <div className="skeleton-shimmer h-4 w-full rounded" />
        <div className="skeleton-shimmer h-4 w-4/5 rounded" />
        <div className="skeleton-shimmer h-3 w-full rounded" />
        <div className="mt-2 border-t border-slate-800/50 pt-2">
          <div className="skeleton-shimmer h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ count = 6, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
