import type { MitreTechnique, ThreatTag } from "./types";

interface MitreRule {
  patterns: string[];
  technique: MitreTechnique;
}

const MITRE_RULES: MitreRule[] = [
  {
    patterns: ["phishing", "spearphish", "credential harvest", "fake login"],
    technique: {
      id: "T1566",
      name: "Phishing",
      tactic: "Initial Access",
    },
  },
  {
    patterns: ["ransomware", "encrypt", "double extortion"],
    technique: {
      id: "T1486",
      name: "Data Encrypted for Impact",
      tactic: "Impact",
    },
  },
  {
    patterns: ["malware", "trojan", "backdoor", "infostealer", "loader"],
    technique: {
      id: "T1204",
      name: "User Execution",
      tactic: "Execution",
    },
  },
  {
    patterns: ["lateral movement", "psexec", "rdp", "pass-the-hash"],
    technique: {
      id: "T1021",
      name: "Remote Services",
      tactic: "Lateral Movement",
    },
  },
  {
    patterns: ["privilege escalation", "sudo", "kernel exploit", "uac bypass"],
    technique: {
      id: "T1068",
      name: "Exploitation for Privilege Escalation",
      tactic: "Privilege Escalation",
    },
  },
  {
    patterns: ["command and control", "c2", "c&c", "beacon"],
    technique: {
      id: "T1071",
      name: "Application Layer Protocol",
      tactic: "Command and Control",
    },
  },
  {
    patterns: ["exfiltration", "data theft", "stolen data", "leaked"],
    technique: {
      id: "T1041",
      name: "Exfiltration Over C2 Channel",
      tactic: "Exfiltration",
    },
  },
  {
    patterns: ["persistence", "registry run", "scheduled task", "startup"],
    technique: {
      id: "T1053",
      name: "Scheduled Task/Job",
      tactic: "Persistence",
    },
  },
  {
    patterns: ["credential dump", "mimikatz", "lsass", "kerberoast"],
    technique: {
      id: "T1003",
      name: "OS Credential Dumping",
      tactic: "Credential Access",
    },
  },
  {
    patterns: ["supply chain", "third-party compromise", "software update"],
    technique: {
      id: "T1195",
      name: "Supply Chain Compromise",
      tactic: "Initial Access",
    },
  },
  {
    patterns: ["zero-day", "0-day", "actively exploited", "in-the-wild"],
    technique: {
      id: "T1190",
      name: "Exploit Public-Facing Application",
      tactic: "Initial Access",
    },
  },
  {
    patterns: ["powershell", "ps1", "wmic", "living off the land"],
    technique: {
      id: "T1059",
      name: "Command and Scripting Interpreter",
      tactic: "Execution",
    },
  },
  {
    patterns: ["defense evasion", "disable antivirus", "amsi bypass"],
    technique: {
      id: "T1562",
      name: "Impair Defenses",
      tactic: "Defense Evasion",
    },
  },
  {
    patterns: ["discovery", "network scan", "reconnaissance", "enumeration"],
    technique: {
      id: "T1046",
      name: "Network Service Discovery",
      tactic: "Discovery",
    },
  },
];

const TAG_TECHNIQUE_MAP: Partial<Record<ThreatTag, MitreTechnique>> = {
  ransomware: {
    id: "T1486",
    name: "Data Encrypted for Impact",
    tactic: "Impact",
  },
  phishing: { id: "T1566", name: "Phishing", tactic: "Initial Access" },
  malware: { id: "T1204", name: "User Execution", tactic: "Execution" },
  "zero-day": {
    id: "T1190",
    name: "Exploit Public-Facing Application",
    tactic: "Initial Access",
  },
  "supply-chain": {
    id: "T1195",
    name: "Supply Chain Compromise",
    tactic: "Initial Access",
  },
  "cloud-attack": {
    id: "T1078",
    name: "Valid Accounts",
    tactic: "Initial Access",
  },
};

export function suggestMitreTechniques(
  title: string,
  summary: string,
  tags: ThreatTag[]
): MitreTechnique[] {
  const text = `${title} ${summary}`.toLowerCase();
  const found: MitreTechnique[] = [];
  const seen = new Set<string>();

  const add = (technique: MitreTechnique) => {
    if (seen.has(technique.id)) return;
    seen.add(technique.id);
    found.push(technique);
  };

  for (const rule of MITRE_RULES) {
    if (rule.patterns.some((p) => text.includes(p))) {
      add(rule.technique);
    }
  }

  for (const tag of tags) {
    const mapped = TAG_TECHNIQUE_MAP[tag];
    if (mapped) add(mapped);
  }

  return found.slice(0, 6);
}
