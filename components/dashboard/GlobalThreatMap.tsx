"use client";

import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface GlobalThreatMapProps {
  severityCounts?: Record<ThreatSeverity, number>;
  className?: string;
}

interface ThreatNode {
  id: string;
  label: string;
  cx: number;
  cy: number;
  severity: ThreatSeverity;
}

const NODES: Omit<ThreatNode, "severity">[] = [
  { id: "na", label: "N. America", cx: 155, cy: 108 },
  { id: "eu", label: "Europe", cx: 468, cy: 92 },
  { id: "me", label: "Middle East", cx: 518, cy: 128 },
  { id: "as", label: "Asia", cx: 598, cy: 118 },
  { id: "af", label: "Africa", cx: 488, cy: 168 },
  { id: "sa", label: "S. America", cx: 198, cy: 198 },
  { id: "oc", label: "Oceania", cx: 648, cy: 198 },
];

const NODE_COLORS: Record<ThreatSeverity, string> = {
  critical: "fill-red-400",
  high: "fill-orange-400",
  medium: "fill-amber-400/90",
  low: "fill-slate-500",
};

export function GlobalThreatMap({
  severityCounts,
  className,
}: GlobalThreatMapProps) {
  const nodes = useMemo(() => {
    const c = severityCounts?.critical ?? 0;
    const h = severityCounts?.high ?? 0;
    const m = severityCounts?.medium ?? 0;

    return NODES.map((node, i) => {
      let severity: ThreatSeverity = "low";
      if (i === 0 && c > 0) severity = "critical";
      else if (i === 1 && (c > 0 || h > 2)) severity = "high";
      else if (i === 2 && h > 0) severity = "high";
      else if (i === 3 && (c + h) > 3) severity = "critical";
      else if (i === 4 && m > 5) severity = "medium";
      else if (i === 5 && h > 1) severity = "medium";
      else if ((c + h + m) > 10 && i % 2 === 0) severity = "medium";
      return { ...node, severity };
    });
  }, [severityCounts]);

  const activeCount = nodes.filter((n) => n.severity !== "low").length;

  return (
    <div className={cn("soc-card flex h-full flex-col px-3 py-2.5", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="section-heading">Global Threat Map</h3>
          <p className="section-subheading">Regional activity indicators</p>
        </div>
        <span className="text-[10px] tabular-nums text-slate-500">
          {activeCount} active
        </span>
      </div>

      <div className="relative flex-1 min-h-[10.5rem] overflow-hidden rounded-md border border-slate-800/60 bg-[#050b14]">
        <svg
          viewBox="0 0 720 260"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Global threat activity map"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(37,99,235,0.08)" />
              <stop offset="100%" stopColor="rgba(5,11,20,0)" />
            </radialGradient>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="720" height="260" fill="url(#mapGlow)" />

          {/* Simplified continental outlines */}
          <g fill="rgba(30,41,59,0.35)" stroke="rgba(51,65,85,0.4)" strokeWidth="0.75">
            <path d="M90 70 Q140 45 200 65 Q240 90 220 130 Q180 160 120 150 Q70 130 90 70Z" />
            <path d="M400 55 Q480 40 540 60 Q580 85 560 120 Q520 145 460 135 Q400 120 400 55Z" />
            <path d="M470 120 Q530 110 580 130 Q620 155 600 190 Q550 210 500 195 Q460 175 470 120Z" />
            <path d="M560 95 Q640 85 680 110 Q700 140 670 175 Q620 200 580 185 Q550 160 560 95Z" />
            <path d="M130 155 Q170 140 210 165 Q230 200 190 220 Q150 225 130 155Z" />
            <path d="M600 175 Q650 165 680 185 Q690 210 660 225 Q620 230 600 175Z" />
          </g>

          {/* Grid lines */}
          <g stroke="rgba(51,65,85,0.25)" strokeWidth="0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`h${i}`} x1="0" y1={52 * i} x2="720" y2={52 * i} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line key={`v${i}`} x1={120 * i} y1="0" x2={120 * i} y2="260" />
            ))}
          </g>

          {nodes.map((node) => (
            <g key={node.id} filter={node.severity !== "low" ? "url(#nodeGlow)" : undefined}>
              {node.severity !== "low" && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="10"
                  className={cn(NODE_COLORS[node.severity], "opacity-20")}
                />
              )}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.severity === "critical" ? 4 : node.severity === "high" ? 3.5 : 3}
                className={cn(
                  NODE_COLORS[node.severity],
                  node.severity !== "low" && "animate-subtle-pulse"
                )}
              />
            </g>
          ))}
        </svg>

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 text-[8px] text-slate-600">
          <LegendDot color="bg-red-400" label="Critical" />
          <LegendDot color="bg-orange-400" label="High" />
          <LegendDot color="bg-amber-400" label="Med" />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("h-1.5 w-1.5 rounded-full", color)} />
      {label}
    </span>
  );
}
