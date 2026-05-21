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
      desc: "Severity breakdown and source coverage",
      metric: totalArticles,
      label: "articles",
    },
    {
      title: "Priority Digest",
      desc: "Critical and high-severity items",
      metric: severityCounts.critical + severityCounts.high,
      label: "priority",
    },
    {
      title: "Feed Coverage",
      desc: "Source availability this session",
      metric: 19,
      label: "feeds",
    },
  ];

  return (
    <section
      id="reports-analytics"
      className={cn("scroll-mt-20 flex flex-col gap-2.5", className)}
    >
      <div className="border-b border-slate-800/60 pb-2">
        <h2 className="text-sm font-semibold text-slate-100">Reports & Analytics</h2>
        <p className="text-[11px] text-slate-500">Operational summaries</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {reports.map((r) => (
          <div key={r.title} className="glass-card rounded-lg p-3.5">
            <h3 className="text-sm font-medium text-slate-200">{r.title}</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">{r.desc}</p>
            <p className="mt-2 text-xl font-semibold text-blue-400">
              <AnimatedCounter value={r.metric} enabled={!loading} />
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              {r.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
