import type {
  IOC,
  MitreTechnique,
  ThreatSeverity,
  ThreatTag,
} from "@/lib/types";

export type { IOC, IOCType, MitreTechnique, ThreatTag } from "@/lib/types";

export interface ThreatAnalysis {
  aiSummary: string;
  impact: string;
  affectedTechnologies: string[];
  threatScore: number;
  severity: ThreatSeverity;
  severityReason: string;
  iocs: IOC[];
  tags: ThreatTag[];
  mitreTechniques: MitreTechnique[];
  recommendedActions: string[];
}
