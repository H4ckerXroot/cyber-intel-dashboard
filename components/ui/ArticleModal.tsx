"use client";

import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { IOCPanel } from "@/components/ui/IOCPanel";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { ThreatScoreGauge } from "@/components/ui/ThreatScoreGauge";
import { ThreatTagBadge } from "@/components/ui/ThreatTagBadge";
import type { ThreatArticle } from "@/lib/types";
import { formatFullDate, cn } from "@/lib/utils";
import { useEffect } from "react";

interface ArticleModalProps {
  article: ThreatArticle | null;
  onClose: () => void;
}

function IntelBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-3.5">
      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    if (!article) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [article, onClose]);

  if (!article) return null;

  const tags = article.tags ?? [];
  const iocs = article.iocs ?? [];
  const mitre = article.mitreTechniques ?? [];
  const actions = article.recommendedActions ?? [];
  const technologies = article.affectedTechnologies ?? [];
  const threatScore = article.threatScore ?? 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl",
          "border border-slate-700/80 bg-slate-900 shadow-2xl animate-fade-in"
        )}
      >
        <div className="shrink-0 border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={article.severity} size="md" />
            <CategoryBadge category={article.category} size="md" />
            {tags.slice(0, 4).map((tag) => (
              <ThreatTagBadge key={tag} tag={tag} />
            ))}
          </div>
          <h2
            id="article-modal-title"
            className="mt-3 text-lg font-semibold leading-snug text-slate-50"
          >
            {article.title}
          </h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <SourceBadge source={article.source} className="max-w-none" />
            <time dateTime={article.publishedAt} className="text-slate-500">
              {formatFullDate(article.publishedAt)}
            </time>
          </div>

          <ThreatScoreGauge
            score={threatScore}
            severity={article.severity}
          />

          {article.severityReason && (
            <p className="text-xs text-slate-500">{article.severityReason}</p>
          )}

          <IntelBlock title="AI Threat Summary">
            <p className="text-sm leading-relaxed text-slate-200">
              {article.aiSummary ?? article.summary}
            </p>
            {article.impact && (
              <p className="mt-2.5 border-t border-slate-800/60 pt-2.5 text-sm leading-relaxed text-slate-400">
                <span className="font-medium text-slate-300">Impact: </span>
                {article.impact}
              </p>
            )}
          </IntelBlock>

          {technologies.length > 0 && (
            <IntelBlock title="Affected Technologies / Vendors">
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-slate-700/80 bg-slate-800/60 px-2 py-1 text-xs text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </IntelBlock>
          )}

          <IntelBlock title="Indicators of Compromise (IOCs)">
            <IOCPanel iocs={iocs} />
          </IntelBlock>

          {mitre.length > 0 && (
            <IntelBlock title="MITRE ATT&CK — Suggested Tactics">
              <ul className="space-y-2">
                {mitre.map((technique) => (
                  <li
                    key={technique.id}
                    className="flex flex-col gap-0.5 rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`https://attack.mitre.org/techniques/${technique.id.replace(/\./g, "/")}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        {technique.id}
                      </a>
                      <span className="text-xs text-slate-500">
                        {technique.tactic}
                      </span>
                    </div>
                    <span className="text-sm text-slate-300">{technique.name}</span>
                  </li>
                ))}
              </ul>
            </IntelBlock>
          )}

          {actions.length > 0 && (
            <IntelBlock title="Recommended Actions">
              <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-slate-300">
                {actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </IntelBlock>
          )}

          {article.summary && (
            <IntelBlock title="Source Summary (RSS)">
              <p className="text-sm leading-relaxed text-slate-400">
                {article.summary}
              </p>
            </IntelBlock>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-800 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            Close
          </button>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Open Article
          </a>
        </div>
      </div>
    </div>
  );
}
