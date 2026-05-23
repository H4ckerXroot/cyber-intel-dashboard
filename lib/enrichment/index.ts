import type { ThreatArticle } from "@/lib/types";
import { generateRecommendedActions } from "./actions";
import { extractIOCs } from "./ioc";
import { suggestMitreTechniques } from "./mitre";
import { analyzeThreatLevel } from "./severity";
import { generateAnalystSummary } from "./summary";
import { detectThreatTags } from "./tags";
import type { ThreatAnalysis } from "./types";
import { detectAffectedTechnologies } from "./vendors";

export type {
  IOC,
  IOCType,
  MitreTechnique,
  ThreatAnalysis,
  ThreatTag,
} from "./types";
export { IOC_TYPE_LABELS } from "./ioc";
export { TAG_META } from "./tags";

export function analyzeArticle(
  title: string,
  summary: string,
  category: ThreatArticle["category"]
): ThreatAnalysis {
  const tags = detectThreatTags(title, summary);
  const iocs = extractIOCs(title, summary);
  const affectedTechnologies = detectAffectedTechnologies(title, summary);
  const { severity, reason, score } = analyzeThreatLevel(
    title,
    summary,
    tags,
    iocs
  );
  const { aiSummary, impact } = generateAnalystSummary(
    title,
    summary,
    severity,
    tags,
    affectedTechnologies,
    iocs,
    category
  );
  const mitreTechniques = suggestMitreTechniques(title, summary, tags);
  const recommendedActions = generateRecommendedActions(
    severity,
    category,
    tags,
    iocs
  );

  return {
    aiSummary,
    impact,
    affectedTechnologies,
    threatScore: score,
    severity,
    severityReason: reason,
    iocs,
    tags,
    mitreTechniques,
    recommendedActions,
  };
}

export function enrichArticle(article: ThreatArticle): ThreatArticle {
  const analysis = analyzeArticle(
    article.title,
    article.summary,
    article.category
  );

  return {
    ...article,
    severity: analysis.severity,
    aiSummary: analysis.aiSummary,
    impact: analysis.impact,
    affectedTechnologies: analysis.affectedTechnologies,
    threatScore: analysis.threatScore,
    severityReason: analysis.severityReason,
    iocs: analysis.iocs,
    tags: analysis.tags,
    mitreTechniques: analysis.mitreTechniques,
    recommendedActions: analysis.recommendedActions,
  };
}
