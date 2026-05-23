import type { CTISource } from "@/lib/types";

/**
 * Enterprise CTI source catalog.
 * `feedUrl` — known-good RSS/Atom endpoint (fast path).
 * `siteUrl` — discovery + HTML fallback base.
 * `reliability` — 0–100 ingest trust weight.
 */
export const CTI_SOURCES: CTISource[] = [
  // —— Tier A: proven operational feeds ——
  { name: "The Hacker News", siteUrl: "https://thehackernews.com/", feedUrl: "https://feeds.feedburner.com/TheHackersNews", reliability: 95 },
  { name: "BleepingComputer", siteUrl: "https://www.bleepingcomputer.com/", feedUrl: "https://www.bleepingcomputer.com/feed/", reliability: 94 },
  { name: "Security Affairs", siteUrl: "https://securityaffairs.com/", feedUrl: "https://securityaffairs.com/feed", reliability: 92 },
  { name: "The Record", siteUrl: "https://therecord.media/", feedUrl: "https://therecord.media/feed/", reliability: 90 },
  { name: "Dark Reading", siteUrl: "https://www.darkreading.com/", feedUrl: "https://www.darkreading.com/rss.xml", reliability: 88 },
  { name: "SecurityWeek", siteUrl: "https://www.securityweek.com/", feedUrl: "https://feeds.feedburner.com/securityweek", reliability: 88 },
  { name: "Microsoft Security", siteUrl: "https://www.microsoft.com/en-us/security/blog/", feedUrl: "https://www.microsoft.com/en-us/security/blog/feed/", reliability: 96 },
  { name: "CISA Advisories", siteUrl: "https://www.cisa.gov/", feedUrl: "https://www.cisa.gov/cybersecurity-advisories/all.xml", reliability: 98 },
  { name: "SANS ISC", siteUrl: "https://isc.sans.edu/", feedUrl: "https://isc.sans.edu/rssfeed.xml", reliability: 90 },
  { name: "Unit 42", siteUrl: "https://unit42.paloaltonetworks.com/", feedUrl: "https://unit42.paloaltonetworks.com/feed/", reliability: 93 },
  { name: "Talos Intelligence", siteUrl: "https://blog.talosintelligence.com/", feedUrl: "https://blog.talosintelligence.com/rss/", reliability: 94 },
  { name: "Check Point Research", siteUrl: "https://research.checkpoint.com/", feedUrl: "https://research.checkpoint.com/feed/", reliability: 92 },
  { name: "AWS Security Blog", siteUrl: "https://aws.amazon.com/blogs/security/", feedUrl: "https://aws.amazon.com/blogs/security/feed/", reliability: 91 },
  { name: "Google Threat Intel", siteUrl: "https://cloud.google.com/blog/topics/threat-intelligence/", feedUrl: "https://cloud.google.com/feeds/cloud-security-blog.xml", reliability: 90 },
  { name: "Elastic Security Labs", siteUrl: "https://www.elastic.co/security-labs/", feedUrl: "https://www.elastic.co/security-labs/rss/feed.xml", reliability: 89 },
  { name: "Malwarebytes Labs", siteUrl: "https://www.malwarebytes.com/blog/", feedUrl: "https://www.malwarebytes.com/blog/feed", reliability: 87 },
  { name: "CyberScoop", siteUrl: "https://cyberscoop.com/", feedUrl: "https://cyberscoop.com/feed/", reliability: 86 },
  { name: "SentinelOne", siteUrl: "https://www.sentinelone.com/blog/", feedUrl: "https://www.sentinelone.com/blog/feed/", reliability: 88 },
  { name: "CrowdStrike", siteUrl: "https://www.crowdstrike.com/blog/", feedUrl: "https://www.crowdstrike.com/blog/feed/", reliability: 93 },
  { name: "Tenable", siteUrl: "https://www.tenable.com/blog", feedUrl: "https://www.tenable.com/blog/feed", reliability: 87 },
  { name: "Trend Micro Research", siteUrl: "https://www.trendmicro.com/en_us/research.html", feedUrl: "https://www.trendmicro.com/en_us/research/rss.xml", reliability: 88 },
  { name: "Sophos News", siteUrl: "https://news.sophos.com/en-us/", feedUrl: "https://news.sophos.com/en-us/feed/", reliability: 87 },
  { name: "Huntress", siteUrl: "https://www.huntress.com/blog/", feedUrl: "https://www.huntress.com/blog/feed", reliability: 86 },
  { name: "Qualys Blog", siteUrl: "https://blog.qualys.com/", feedUrl: "https://blog.qualys.com/feed", reliability: 85 },
  { name: "Akamai Security", siteUrl: "https://www.akamai.com/blog/security-research", feedUrl: "https://www.akamai.com/blog/rss.xml", reliability: 85 },
  { name: "Broadcom Security", siteUrl: "https://www.security.com/threat-intelligence/", feedUrl: "https://www.security.com/rss.xml", reliability: 84 },
  { name: "Arctic Wolf", siteUrl: "https://arcticwolf.com/resources/blog/", feedUrl: "https://arcticwolf.com/feed/", reliability: 82 },
  { name: "Data Breaches", siteUrl: "https://databreaches.net/", feedUrl: "https://www.databreaches.net/feed/", reliability: 83 },
  { name: "Cyble", siteUrl: "https://cyble.com/blog/", feedUrl: "https://cyble.com/feed/", reliability: 82 },
  { name: "ReliaQuest", siteUrl: "https://reliaquest.com/blog/", feedUrl: "https://reliaquest.com/blog/feed/", reliability: 81 },
  { name: "CyberArk", siteUrl: "https://www.cyberark.com/resources/", feedUrl: "https://www.cyberark.com/feed/", reliability: 84 },
  { name: "Veracode", siteUrl: "https://www.veracode.com/blog/", feedUrl: "https://www.veracode.com/blog/feed", reliability: 80 },
  { name: "Seqrite", siteUrl: "https://www.seqrite.com/blog/", feedUrl: "https://www.seqrite.com/blog/feed/", reliability: 78 },
  { name: "BeyondTrust", siteUrl: "https://www.beyondtrust.com/blog", feedUrl: "https://www.beyondtrust.com/blog/feed", reliability: 79 },
  { name: "Socket", siteUrl: "https://socket.dev/blog/", feedUrl: "https://socket.dev/blog/rss.xml", reliability: 80 },
  { name: "MDSec", siteUrl: "https://www.mdsec.co.uk/", feedUrl: "https://www.mdsec.co.uk/feed/", reliability: 86 },
  { name: "Infoguard Advisories", siteUrl: "https://labs.infoguard.ch/advisories/", feedUrl: "https://labs.infoguard.ch/advisories/feed/", reliability: 85 },
  { name: "Cyber Press", siteUrl: "https://cyberpress.org/", feedUrl: "https://cyberpress.org/feed/", reliability: 78 },
  { name: "Cybersecurity Times", siteUrl: "https://cybersecuritytimes.com/", feedUrl: "https://cybersecuritytimes.com/feed/", reliability: 77 },
  { name: "Open Source Malware", siteUrl: "https://opensourcemalware.com/blog", feedUrl: "https://opensourcemalware.com/blog/feed.xml", reliability: 79 },
  { name: "Acronis TRU", siteUrl: "https://www.acronis.com/en/tru/posts/", feedUrl: "https://www.acronis.com/en-us/blog/feed/", reliability: 78 },
  { name: "Flare", siteUrl: "https://flare.io/learn/resources/blog/", feedUrl: "https://flare.io/blog/feed/", reliability: 77 },
  { name: "Picus Security", siteUrl: "https://www.picussecurity.com/resource/blog/", feedUrl: "https://www.picussecurity.com/feed/", reliability: 76 },
  { name: "LevelBlue", siteUrl: "https://www.levelblue.com/blogs/", feedUrl: "https://www.levelblue.com/blogs/feed/", reliability: 75 },
  { name: "Securonix", siteUrl: "https://www.securonix.com/blog/", feedUrl: "https://www.securonix.com/blog/feed/", reliability: 76 },
  { name: "Pillar Security", siteUrl: "https://www.pillar.security/", feedUrl: "https://www.pillar.security/blog/rss.xml", reliability: 74 },
  { name: "CloudSEK", siteUrl: "https://www.cloudsek.com/blog/", feedUrl: "https://www.cloudsek.com/blog/feed/", reliability: 75 },
  { name: "Hadrian", siteUrl: "https://hadrian.io/", feedUrl: "https://hadrian.io/blog/feed.xml", reliability: 74 },
  { name: "Resecurity", siteUrl: "https://www.resecurity.com/blog/", feedUrl: "https://www.resecurity.com/feed/", reliability: 76 },
  { name: "Dream Group", siteUrl: "https://dreamgroup.com/blog/", feedUrl: "https://dreamgroup.com/feed/", reliability: 72 },
  { name: "Gen Digital Research", siteUrl: "https://www.gendigital.com/blog/insights/research", feedUrl: "https://www.gendigital.com/blog/feed/", reliability: 73 },
  { name: "Rankiteo", siteUrl: "https://blog.rankiteo.com/", feedUrl: "https://blog.rankiteo.com/rss.xml", reliability: 71 },
  { name: "Dark Atlas", siteUrl: "https://darkatlas.io/blog", feedUrl: "https://darkatlas.io/blog/rss.xml", reliability: 70 },
  { name: "Hacktron AI", siteUrl: "https://www.hacktron.ai/blog/", feedUrl: "https://www.hacktron.ai/blog/rss.xml", reliability: 72 },
  { name: "Deception Pro", siteUrl: "https://blog.deception.pro/blog/", feedUrl: "https://blog.deception.pro/feed/", reliability: 71 },
  { name: "Cyber and Ramen", siteUrl: "https://cyberandramen.net/", feedUrl: "https://cyberandramen.net/feed/", reliability: 70 },
  { name: "Coveware", siteUrl: "https://www.coveware.com/blog/", feedUrl: "https://www.coveware.com/blog/feed", reliability: 80 },
  { name: "PC Risk", siteUrl: "https://www.pcrisk.com/", feedUrl: "https://www.pcrisk.com/feed", reliability: 68 },
  { name: "StealthMole", siteUrl: "https://www.stealthmole.com/resources/", feedUrl: "https://www.stealthmole.com/feed/", reliability: 70 },
  { name: "Qianxin XLab", siteUrl: "https://blog.xlab.qianxin.com/", feedUrl: "https://blog.xlab.qianxin.com/atom.xml", reliability: 78 },
  { name: "Atos CyberShield", siteUrl: "https://atos.net/en/lp/cybershield", feedUrl: "https://atos.net/en/blog/rss.xml", reliability: 72 },
  { name: "Phoenix Security", siteUrl: "https://phoenix.security/", feedUrl: "https://phoenix.security/blog/feed/", reliability: 71 },
  { name: "Genians Threat Intel", siteUrl: "https://www.genians.co.kr/en/blog/threat_intelligence/", feedUrl: "https://www.genians.co.kr/en/blog/feed/", reliability: 74 },
  { name: "SuspectFile", siteUrl: "https://www.suspectfile.com/", feedUrl: "https://www.suspectfile.com/feed/", reliability: 65 },
  { name: "EU Most Wanted", siteUrl: "https://eumostwanted.eu/", feedUrl: "https://eumostwanted.eu/feed/", reliability: 60 },
  { name: "Dataminr", siteUrl: "https://www.dataminr.com/resources/", reliability: 70 },
];

/** @deprecated Use CTI_SOURCES — kept for backward compatibility */
export const RSS_FEEDS = CTI_SOURCES.map((s) => ({
  name: s.name,
  url: s.feedUrl ?? s.siteUrl,
}));

export const CTI_SOURCE_COUNT = CTI_SOURCES.length;
