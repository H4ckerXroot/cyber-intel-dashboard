"use client";

import type { FeedHealthRecord, FeedHealthSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeedDiagnosticsProps {
  open: boolean;
  onClose: () => void;
  feedHealth?: FeedHealthRecord[];
  healthSummary?: FeedHealthSummary;
  syncedAt?: string;
}

const STATUS_STYLES: Record<string, string> = {
  online: "text-emerald-400",
  degraded: "text-amber-400",
  timeout: "text-orange-400",
  blocked: "text-red-400",
  invalid: "text-red-300",
  unsupported: "text-slate-400",
  parsing_failed: "text-rose-400",
  failed: "text-red-400",
};

export function FeedDiagnostics({
  open,
  onClose,
  feedHealth = [],
  healthSummary,
  syncedAt,
}: FeedDiagnosticsProps) {
  if (!open) return null;

  const sorted = [...feedHealth].sort((a, b) => {
    if (a.status === b.status) return a.name.localeCompare(b.name);
    if (a.status === "online") return -1;
    if (b.status === "online") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-label="Feed diagnostics"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Feed diagnostics
            </h2>
            <p className="text-[11px] text-slate-500">
              Hidden panel · Alt+Shift+F · Last sync{" "}
              {syncedAt ? new Date(syncedAt).toLocaleString() : "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Close
          </button>
        </div>

        {healthSummary && (
          <div className="grid grid-cols-3 gap-2 border-b border-slate-800/80 bg-slate-900/40 px-4 py-2 text-[11px] sm:grid-cols-6">
            <Stat label="Online" value={healthSummary.online} />
            <Stat label="Degraded" value={healthSummary.degraded} />
            <Stat label="Blocked" value={healthSummary.blocked} />
            <Stat label="Timeout" value={healthSummary.timeout} />
            <Stat label="Invalid" value={healthSummary.invalid} />
            <Stat label="Parse fail" value={healthSummary.parsing_failed} />
          </div>
        )}

        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-slate-900 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Response</th>
                <th className="hidden px-3 py-2 font-medium md:table-cell">
                  URL
                </th>
                <th className="px-3 py-2 font-medium">Error</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr
                  key={row.name}
                  className="border-t border-slate-800/60 hover:bg-slate-900/50"
                >
                  <td className="px-3 py-2 font-medium text-slate-300">
                    {row.name}
                    {row.articleCount > 0 && (
                      <span className="ml-1 text-slate-600">
                        ({row.articleCount})
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-2 capitalize",
                      STATUS_STYLES[row.status] ?? "text-slate-400"
                    )}
                  >
                    {row.status.replace("_", " ")}
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {row.responseType ?? "—"}
                  </td>
                  <td className="hidden max-w-[200px] truncate px-3 py-2 text-slate-600 md:table-cell">
                    {row.resolvedUrl ?? row.sourceUrl ?? "—"}
                  </td>
                  <td className="max-w-[240px] truncate px-3 py-2 text-slate-500">
                    {row.errorReason ?? row.message ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-slate-600">{label}</p>
      <p className="font-semibold tabular-nums text-slate-300">{value}</p>
    </div>
  );
}
