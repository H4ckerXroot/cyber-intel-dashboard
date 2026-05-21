import type { ThreatCategory } from "./types";

const CATEGORY_RULES: {
  category: ThreatCategory;
  keywords: string[];
  sources?: string[];
}[] = [
  {
    category: "government-advisories",
    keywords: [
      "cisa",
      "advisory",
      "government",
      "federal",
      "nist",
      "ncsc",
      "cert",
      "national security",
      "agency alert",
    ],
    sources: ["cisa"],
  },
  {
    category: "cve-alerts",
    keywords: [
      "cve-",
      "cve ",
      "vulnerability",
      "zero-day",
      "0-day",
      "patch tuesday",
      "cvss",
      "exploit",
      "rce",
      "remote code execution",
      "security flaw",
      "critical flaw",
    ],
  },
  {
    category: "ransomware-updates",
    keywords: [
      "ransomware",
      "lockbit",
      "blackcat",
      "alphv",
      "clop",
      "royal ransomware",
      "encrypt",
      "ransom note",
      "double extortion",
    ],
  },
  {
    category: "malware-analysis",
    keywords: [
      "malware",
      "trojan",
      "botnet",
      "backdoor",
      "rootkit",
      "wiper",
      "infostealer",
      "rat ",
      "remote access",
      "spyware",
      "cryptominer",
      "dropper",
      "payload",
      "ioc",
      "indicators of compromise",
    ],
  },
  {
    category: "threat-actors",
    keywords: [
      "apt",
      "threat actor",
      "hacking group",
      "cybercrime group",
      "nation-state",
      "lazarus",
      "fancy bear",
      "sandworm",
      "scattered spider",
      "lapsus",
      "state-sponsored",
      "cyber espionage",
      "campaign",
    ],
  },
];

export function categorizeArticle(
  title: string,
  summary: string,
  source: string
): ThreatCategory {
  const text = `${title} ${summary}`.toLowerCase();
  const sourceLower = source.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.sources?.some((s) => sourceLower.includes(s))) {
      return rule.category;
    }
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }

  return "latest-threat-news";
}
