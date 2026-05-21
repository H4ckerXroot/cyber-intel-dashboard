"use client";

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function AnalystProfile() {
  const initials = BRAND.analystName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="glass-card rounded-lg p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Analyst Workspace
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-100">
            {BRAND.analystName}
          </h3>
          <p className="text-xs text-slate-400">{BRAND.analystRole}</p>
        </div>
      </div>

      <dl className="mt-3 space-y-1.5 border-t border-slate-800/80 pt-3 text-xs">
        <Row label="Clearance" value={BRAND.analystClearance} />
        <Row label="Workspace" value="Private CTI Portal" />
        <Row label="Session" value="Active" valueClass="text-emerald-400/90" />
        <Row label="Timezone" value={BRAND.analystTimezone} />
      </dl>

      <div className="mt-3 rounded-md border border-slate-800 bg-slate-800/30 px-2.5 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Focus
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
          CVE triage · Ransomware · Feed correlation
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className={cn("font-medium text-slate-300", valueClass)}>{value}</dd>
    </div>
  );
}
