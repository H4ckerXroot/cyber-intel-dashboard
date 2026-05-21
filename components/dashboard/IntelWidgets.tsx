"use client";

import { cn } from "@/lib/utils";

interface IntelWidgetsProps {
  className?: string;
}

export function IntelWidgets({ className }: IntelWidgetsProps) {
  const bars = [32, 48, 38, 55, 42, 61, 50, 58, 45, 52, 40, 56];

  return (
    <div className={cn("grid gap-3 lg:grid-cols-2", className)}>
      <div className="glass-card rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-200">Threat Volume</h3>
            <p className="text-[11px] text-slate-500">7-day trend (sample)</p>
          </div>
          <span className="text-[10px] text-slate-600">Preview</span>
        </div>
        <div className="flex h-28 items-end gap-1 border-b border-slate-800/60 pb-1">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-blue-600/45"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-lg p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-200">
              Geographic Exposure
            </h3>
            <p className="text-[11px] text-slate-500">Regional overview</p>
          </div>
          <span className="text-[10px] text-slate-600">Preview</span>
        </div>
        <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-slate-800 bg-slate-900/40">
          <p className="text-xs text-slate-500">Map visualization — coming soon</p>
        </div>
      </div>
    </div>
  );
}
