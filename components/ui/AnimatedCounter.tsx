"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  enabled?: boolean;
}

export function AnimatedCounter({
  value,
  className,
  enabled = true,
}: AnimatedCounterProps) {
  const display = useAnimatedCounter(value, 900, enabled);

  return (
    <span className={cn("tabular-nums", className)}>{display.toLocaleString()}</span>
  );
}
