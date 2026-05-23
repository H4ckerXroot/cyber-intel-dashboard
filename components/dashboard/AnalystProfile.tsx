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
    <div className="soc-card px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        Analyst Workspace
      </p>

      <div className="mt-2 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-600/90 text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold text-slate-100">
            {BRAND.analystName}
          </h3>
          <p className="text-[10px] text-slate-500">{BRAND.analystRole}</p>
        </div>
      </div>

      <dl className="mt-2 space-y-1 border-t border-slate-800/70 pt-2 text-[10px]">
        <Row label="Clearance" value={BRAND.analystClearance} />
        <Row label="Session" value="Active" valueClass="text-blue-400/90" />
        <Row label="Timezone" value={BRAND.analystTimezone} />
      </dl>
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
    <div className="flex justify-between gap-2">
      <dt className="text-slate-600">{label}</dt>
      <dd className={cn("font-medium text-slate-400", valueClass)}>{value}</dd>
    </div>
  );
}
