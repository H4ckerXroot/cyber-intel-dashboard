"use client";

import { BRAND } from "@/lib/brand";

export function AnalystProfile() {
  const initials = BRAND.analystName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="soc-card h-full px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          Analyst Workspace
        </p>
        <span className="inline-flex items-center gap-1 rounded border border-blue-900/50 bg-blue-950/40 px-1.5 py-px text-[8px] font-medium uppercase text-blue-400/90">
          <span className="h-1 w-1 rounded-full bg-blue-400 animate-subtle-pulse" />
          Live
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-semibold text-slate-100">
            {BRAND.analystName}
          </h3>
          <p className="truncate text-[10px] text-slate-500">{BRAND.analystRole}</p>
        </div>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-slate-800/60 pt-2 text-[9px]">
        <MetaItem label="Clearance" value={BRAND.analystClearance} />
        <MetaItem label="Workspace" value="Private SOC" />
        <MetaItem label="Team" value={BRAND.analystTeam} />
        <MetaItem label="Timezone" value={BRAND.analystTimezone} />
      </dl>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-600">{label}</dt>
      <dd className="truncate font-medium text-slate-400">{value}</dd>
    </div>
  );
}
