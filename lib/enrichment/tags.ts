import type { ThreatTag } from "./types";

interface TagRule {
  tag: ThreatTag;
  patterns: string[];
}

const TAG_RULES: TagRule[] = [
  {
    tag: "ransomware",
    patterns: [
      "ransomware",
      "ransom note",
      "lockbit",
      "blackcat",
      "alphv",
      "clop",
      "encrypt",
      "double extortion",
    ],
  },
  {
    tag: "phishing",
    patterns: [
      "phishing",
      "spearphishing",
      "credential harvest",
      "fake login",
      "business email compromise",
      "bec ",
    ],
  },
  {
    tag: "malware",
    patterns: [
      "malware",
      "trojan",
      "backdoor",
      "rat ",
      "botnet",
      "infostealer",
      "loader",
      "dropper",
      "wiper",
    ],
  },
  {
    tag: "zero-day",
    patterns: [
      "zero-day",
      "zero day",
      "0-day",
      "0day",
      "unpatched",
      "in-the-wild exploit",
    ],
  },
  {
    tag: "cloud-attack",
    patterns: [
      "aws",
      "azure",
      "gcp",
      "kubernetes",
      "k8s",
      "cloud breach",
      "saas",
      "office 365",
      "m365",
      "entra",
      "s3 bucket",
    ],
  },
  {
    tag: "ai-threat",
    patterns: [
      " ai ",
      "artificial intelligence",
      "llm",
      "chatgpt",
      "deepfake",
      "prompt injection",
      "model poisoning",
    ],
  },
  {
    tag: "supply-chain",
    patterns: [
      "supply chain",
      "third-party",
      "software update compromise",
      "dependency",
      "npm package",
      "pypi",
      "solarwinds",
    ],
  },
  {
    tag: "insider-threat",
    patterns: [
      "insider",
      "rogue employee",
      "privilege abuse",
      "data exfiltration by employee",
      "insider threat",
    ],
  },
];

export function detectThreatTags(title: string, summary: string): ThreatTag[] {
  const text = ` ${title} ${summary} `.toLowerCase();
  const tags: ThreatTag[] = [];

  for (const rule of TAG_RULES) {
    if (rule.patterns.some((p) => text.includes(p))) {
      tags.push(rule.tag);
    }
  }

  return tags;
}

export const TAG_META: Record<
  ThreatTag,
  { label: string; className: string }
> = {
  ransomware: {
    label: "Ransomware",
    className: "bg-red-950/40 text-red-300/90 border-red-900/40",
  },
  phishing: {
    label: "Phishing",
    className: "bg-amber-950/35 text-amber-300/90 border-amber-900/40",
  },
  malware: {
    label: "Malware",
    className: "bg-orange-950/35 text-orange-300/90 border-orange-900/40",
  },
  "zero-day": {
    label: "Zero-Day",
    className: "bg-rose-950/35 text-rose-300/90 border-rose-900/40",
  },
  "cloud-attack": {
    label: "Cloud",
    className: "bg-blue-950/35 text-blue-300/90 border-blue-900/40",
  },
  "ai-threat": {
    label: "AI Threat",
    className: "bg-violet-950/35 text-violet-300/90 border-violet-900/40",
  },
  "supply-chain": {
    label: "Supply Chain",
    className: "bg-slate-800/50 text-slate-300 border-slate-700/50",
  },
  "insider-threat": {
    label: "Insider",
    className: "bg-slate-800/50 text-slate-400 border-slate-700/50",
  },
};
