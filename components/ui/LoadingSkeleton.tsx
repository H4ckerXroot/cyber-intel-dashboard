import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function NewsCardSkeleton() {
  return (
    <div className="glass-card animate-pulse overflow-hidden rounded-2xl">
      <div className="skeleton-shimmer h-36" />
      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-5 w-20 rounded-full" />
          <div className="skeleton-shimmer h-5 w-24 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-5 w-full rounded" />
        <div className="skeleton-shimmer h-5 w-4/5 rounded" />
        <div className="space-y-2">
          <div className="skeleton-shimmer h-3 w-full rounded" />
          <div className="skeleton-shimmer h-3 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ count = 6, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
