import type { CTISource } from "@/lib/types";

/**
 * Curated RSS-only CTI sources — stable endpoints, no discovery/scrape fallbacks.
 * Reliability scores used for article prioritization only.
 */
export const CTI_SOURCES: CTISource[] = [
  {
    name: "The Hacker News",
    siteUrl: "https://thehackernews.com/",
    feedUrl: "https://feeds.feedburner.com/TheHackersNews",
    reliability: 95,
  },
  {
    name: "BleepingComputer",
    siteUrl: "https://www.bleepingcomputer.com/",
    feedUrl: "https://www.bleepingcomputer.com/feed/",
    reliability: 94,
  },
  {
    name: "Security Affairs",
    siteUrl: "https://securityaffairs.com/",
    feedUrl: "https://securityaffairs.com/feed",
    reliability: 92,
  },
  {
    name: "Talos Intelligence",
    siteUrl: "https://blog.talosintelligence.com/",
    feedUrl: "https://blog.talosintelligence.com/rss/",
    reliability: 94,
  },
  {
    name: "Microsoft Security",
    siteUrl: "https://www.microsoft.com/en-us/security/blog/",
    feedUrl: "https://www.microsoft.com/en-us/security/blog/feed/",
    reliability: 96,
  },
  {
    name: "Sophos News",
    siteUrl: "https://news.sophos.com/en-us/",
    feedUrl: "https://news.sophos.com/en-us/feed/",
    reliability: 87,
  },
  {
    name: "Trend Micro Research",
    siteUrl: "https://www.trendmicro.com/en_us/research.html",
    feedUrl: "https://www.trendmicro.com/en_us/research/rss.xml",
    reliability: 88,
  },
  {
    name: "SentinelOne",
    siteUrl: "https://www.sentinelone.com/blog/",
    feedUrl: "https://www.sentinelone.com/blog/feed/",
    reliability: 88,
  },
  {
    name: "Huntress",
    siteUrl: "https://www.huntress.com/blog/",
    feedUrl: "https://www.huntress.com/blog/feed",
    reliability: 86,
  },
  {
    name: "Unit 42",
    siteUrl: "https://unit42.paloaltonetworks.com/",
    feedUrl: "https://unit42.paloaltonetworks.com/feed/",
    reliability: 93,
  },
  {
    name: "Check Point Research",
    siteUrl: "https://research.checkpoint.com/",
    feedUrl: "https://research.checkpoint.com/feed/",
    reliability: 92,
  },
  {
    name: "AWS Security Blog",
    siteUrl: "https://aws.amazon.com/blogs/security/",
    feedUrl: "https://aws.amazon.com/blogs/security/feed/",
    reliability: 91,
  },
  {
    name: "Akamai Security",
    siteUrl: "https://www.akamai.com/blog/security-research",
    feedUrl: "https://www.akamai.com/blog/rss.xml",
    reliability: 85,
  },
  {
    name: "Elastic Security Labs",
    siteUrl: "https://www.elastic.co/security-labs/",
    feedUrl: "https://www.elastic.co/security-labs/rss/feed.xml",
    reliability: 89,
  },
  {
    name: "Cyble",
    siteUrl: "https://cyble.com/blog/",
    feedUrl: "https://cyble.com/feed/",
    reliability: 82,
  },
  {
    name: "Qualys Blog",
    siteUrl: "https://blog.qualys.com/",
    feedUrl: "https://blog.qualys.com/feed",
    reliability: 85,
  },
];

/** @deprecated Use CTI_SOURCES */
export const RSS_FEEDS = CTI_SOURCES.map((s) => ({
  name: s.name,
  url: s.feedUrl,
}));

export const CTI_SOURCE_COUNT = CTI_SOURCES.length;
