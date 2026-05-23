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
  cve: "text-rose-300 border-rose-500/30 bg-rose-500/10",
  ip: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  domain: "text-sky-300 border-sky-500/30 bg-sky-500/10",
  hash: "text-violet-300 border-violet-500/30 bg-violet-500/10",
  url: "text-blue-300 border-blue-500/30 bg-blue-500/10",
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
      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
      title="Copy to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function IOCPanel({ iocs, className }: IOCPanelProps) {
  if (iocs.length === 0) {
    return (
      <p className={cn("text-sm text-slate-500", className)}>
        No indicators extracted from available article text.
      </p>
    );
  }

  const grouped = groupIOCs(iocs);

  return (
    <div className={cn("space-y-3", className)}>
      {TYPE_ORDER.map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;

        return (
          <div key={type}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {IOC_TYPE_LABELS[type]} ({items.length})
            </p>
            <ul className="space-y-1">
              {items.map((ioc) => (
                <li
                  key={`${ioc.type}-${ioc.value}`}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded-md border px-2.5 py-1.5",
                    TYPE_STYLES[type]
                  )}
                >
                  <code className="break-all font-mono text-xs leading-relaxed">
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
