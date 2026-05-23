import type { IOC, IOCType } from "./types";

const CVE_PATTERN = /\bCVE-\d{4}-\d{4,7}\b/gi;
const IPV4_PATTERN =
  /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g;
const MD5_PATTERN = /\b[a-f0-9]{32}\b/gi;
const SHA1_PATTERN = /\b[a-f0-9]{40}\b/gi;
const SHA256_PATTERN = /\b[a-f0-9]{64}\b/gi;
const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/gi;
const DOMAIN_PATTERN =
  /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|org|net|io|gov|edu|mil|co|uk|de|ru|cn|info|biz|xyz|app|dev|cloud|local)\b/gi;

const DOMAIN_BLOCKLIST = new Set([
  "example.com",
  "localhost",
  "github.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "facebook.com",
  "google.com",
  "microsoft.com",
  "apple.com",
]);

function uniqueByValue(items: IOC[]): IOC[] {
  const seen = new Set<string>();
  const result: IOC[] = [];
  for (const item of items) {
    const key = `${item.type}:${item.value.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function addMatches(
  text: string,
  pattern: RegExp,
  type: IOCType,
  bucket: IOC[],
  normalize?: (v: string) => string
): void {
  const matches = text.match(pattern);
  if (!matches) return;
  for (const raw of matches) {
    const value = normalize ? normalize(raw) : raw;
    bucket.push({ type, value });
  }
}

function isPrivateIp(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return true;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 127) return true;
  return false;
}

export function extractIOCs(title: string, summary: string): IOC[] {
  const text = `${title} ${summary}`;
  const iocs: IOC[] = [];

  addMatches(text, CVE_PATTERN, "cve", iocs, (v) => v.toUpperCase());

  const ips = text.match(IPV4_PATTERN) ?? [];
  for (const ip of ips) {
    if (!isPrivateIp(ip)) {
      iocs.push({ type: "ip", value: ip });
    }
  }

  addMatches(text, URL_PATTERN, "url", iocs);

  addMatches(text, SHA256_PATTERN, "hash", iocs, (v) => v.toLowerCase());
  addMatches(text, SHA1_PATTERN, "hash", iocs, (v) => v.toLowerCase());
  addMatches(text, MD5_PATTERN, "hash", iocs, (v) => v.toLowerCase());

  const domains = text.match(DOMAIN_PATTERN) ?? [];
  for (const domain of domains) {
    const lower = domain.toLowerCase();
    if (DOMAIN_BLOCKLIST.has(lower)) continue;
    if (lower.endsWith(".png") || lower.endsWith(".jpg")) continue;
    iocs.push({ type: "domain", value: lower });
  }

  return uniqueByValue(iocs).slice(0, 24);
}

export const IOC_TYPE_LABELS: Record<IOCType, string> = {
  cve: "CVE",
  ip: "IP",
  domain: "Domain",
  hash: "Hash",
  url: "URL",
};
