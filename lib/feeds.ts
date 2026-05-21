import type { FeedSource } from "./types";

/** Curated high-quality feeds — Reddit, Packet Storm, and other unstable sources removed. */
export const RSS_FEEDS: FeedSource[] = [
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "The Record", url: "https://therecord.media/feed/" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { name: "SecurityWeek", url: "https://feeds.feedburner.com/securityweek" },
  {
    name: "Cisco Talos",
    url: "https://feeds.feedburner.com/feedburner/Talos",
  },
  {
    name: "Microsoft Security",
    url: "https://www.microsoft.com/en-us/security/blog/feed/",
  },
  {
    name: "Google Project Zero",
    url: "https://googleprojectzero.blogspot.com/feeds/posts/default",
  },
  { name: "Malwarebytes Labs", url: "https://www.malwarebytes.com/blog/feed" },
  { name: "Rapid7 Blog", url: "https://www.rapid7.com/blog/rss/" },
  { name: "Unit 42", url: "https://unit42.paloaltonetworks.com/feed/" },
  { name: "CrowdStrike Blog", url: "https://www.crowdstrike.com/blog/feed/" },
  { name: "SentinelOne Blog", url: "https://www.sentinelone.com/blog/feed/" },
  {
    name: "Check Point Research",
    url: "https://research.checkpoint.com/feed",
  },
  { name: "HackRead", url: "https://hackread.com/feed" },
  { name: "CyberScoop", url: "https://cyberscoop.com/feed/" },
  { name: "Security Affairs", url: "https://securityaffairs.com/feed" },
  { name: "SANS ISC", url: "https://isc.sans.edu/rssfeed.xml" },
  {
    name: "CISA Advisories",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
  },
];
