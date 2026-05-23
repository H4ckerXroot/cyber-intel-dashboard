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
    className: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  phishing: {
    label: "Phishing",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  malware: {
    label: "Malware",
    className: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  },
  "zero-day": {
    label: "Zero-Day",
    className: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  "cloud-attack": {
    label: "Cloud Attack",
    className: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  "ai-threat": {
    label: "AI Threat",
    className: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  "supply-chain": {
    label: "Supply Chain",
    className: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  },
  "insider-threat": {
    label: "Insider Threat",
    className: "bg-slate-500/15 text-slate-300 border-slate-500/40",
  },
};
