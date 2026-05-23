"use client";

import { IOC_TYPE_LABELS } from "@/lib/enrichment/ioc";
import type { IOC } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface IOCPanelProps {
  iocs: IOC[];
  className?: string;
}

const TYPE_ORDER: IOC["type"][] = ["cve", "ip", "domain", "hash", "url"];

const TYPE_STYLES: Record<IOC["type"], string> = {
  cve: "text-red-300/90 border-red-900/40 bg-red-950/25",
  ip: "text-amber-300/90 border-amber-900/35 bg-amber-950/20",
  domain: "text-blue-300/90 border-blue-900/35 bg-blue-950/20",
  hash: "text-violet-300/90 border-violet-900/35 bg-violet-950/20",
  url: "text-slate-300/90 border-slate-700/50 bg-slate-900/40",
};

function groupIOCs(iocs: IOC[]): Record<IOC["type"], IOC[]> {
  const groups = {} as Record<IOC["type"], IOC[]>;
  for (const type of TYPE_ORDER) {
    groups[type] = iocs.filter((i) => i.type === type);
  }
  return groups;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded px-1 py-0.5 text-[9px] text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
      title="Copy to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function IOCPanel({ iocs, className }: IOCPanelProps) {
  if (iocs.length === 0) {
    return (
      <p className={cn("text-[12px] text-slate-500", className)}>
        No indicators extracted from available text.
      </p>
    );
  }

  const grouped = groupIOCs(iocs);

  return (
    <div className={cn("space-y-2", className)}>
      {TYPE_ORDER.map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;

        return (
          <div key={type}>
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-600">
              {IOC_TYPE_LABELS[type]} ({items.length})
            </p>
            <ul className="space-y-0.5">
              {items.map((ioc) => (
                <li
                  key={`${ioc.type}-${ioc.value}`}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded border px-2 py-1",
                    TYPE_STYLES[type]
                  )}
                >
                  <code className="break-all font-mono text-[11px] leading-snug">
                    {ioc.value}
                  </code>
                  <CopyButton value={ioc.value} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
