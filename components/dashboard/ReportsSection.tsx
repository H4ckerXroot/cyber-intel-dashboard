"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReportsSectionProps {
  severityCounts: Record<ThreatSeverity, number>;
  totalArticles: number;
  loading?: boolean;
  className?: string;
}

export function ReportsSection({
  severityCounts,
  totalArticles,
  loading,
  className,
}: ReportsSectionProps) {
  const reports = [
    {
      title: "Weekly Summary",
      desc: "Severity breakdown",
      metric: totalArticles,
      label: "articles",
    },
    {
      title: "Priority Digest",
      desc: "Critical + high items",
      metric: severityCounts.critical + severityCounts.high,
      label: "priority",
    },
    {
      title: "Feed Coverage",
      desc: "Active sources",
      metric: 12,
      label: "feeds",
    },
  ];

  return (
    <section
      id="reports-analytics"
      className={cn("scroll-mt-16 flex flex-col gap-2", className)}
    >
      <div className="border-b border-slate-800/50 pb-1.5">
        <h2 className="section-heading">Reports & Analytics</h2>
        <p className="section-subheading">Operational summaries</p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {reports.map((r) => (
          <div key={r.title} className="soc-card px-3 py-2.5">
            <h3 className="text-[13px] font-medium text-slate-200">{r.title}</h3>
            <p className="text-[10px] text-slate-600">{r.desc}</p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums text-blue-400/90">
              <AnimatedCounter value={r.metric} enabled={!loading} />
            </p>
            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              {r.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
