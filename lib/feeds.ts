import type { FeedSource } from "./types";

/**
 * Stable, production-tested feeds only.
 * Avoid adding many experimental sources at once — reduces 403/SSL/timeout failures.
 */
export const RSS_FEEDS: FeedSource[] = [
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "The Record", url: "https://therecord.media/feed/" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { name: "SecurityWeek", url: "https://feeds.feedburner.com/securityweek" },
  {
    name: "Microsoft Security",
    url: "https://www.microsoft.com/en-us/security/blog/feed/",
  },
  { name: "Malwarebytes Labs", url: "https://www.malwarebytes.com/blog/feed" },
  { name: "Unit 42", url: "https://unit42.paloaltonetworks.com/feed/" },
  { name: "CyberScoop", url: "https://cyberscoop.com/feed/" },
  { name: "Security Affairs", url: "https://securityaffairs.com/feed" },
  { name: "SANS ISC", url: "https://isc.sans.edu/rssfeed.xml" },
  {
    name: "CISA Advisories",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
  },
];
