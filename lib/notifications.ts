import type { ThreatArticle, ThreatSeverity } from "./types";

export type NotificationSeverity = ThreatSeverity;

export interface SocNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  time: string;
  unread: boolean;
}

export function buildSocNotifications(
  severityCounts: Record<ThreatSeverity, number>,
  articles: ThreatArticle[]
): SocNotification[] {
  const notifications: SocNotification[] = [];
  const criticalArticles = articles.filter((a) => a.severity === "critical").slice(0, 2);
  const ransomware = articles.filter((a) => a.tags?.includes("ransomware")).slice(0, 1);
  const withIocs = articles.filter((a) => (a.iocs?.length ?? 0) > 0).slice(0, 1);
  const apt = articles.filter(
    (a) => a.category === "threat-actors" || a.tags?.includes("supply-chain")
  ).slice(0, 1);

  if (severityCounts.critical > 0) {
    const sample = criticalArticles[0];
    notifications.push({
      id: "crit-cve",
      title: "New Critical CVE detected",
      message: sample
        ? `${sample.title.slice(0, 72)}…`
        : `${severityCounts.critical} critical signal(s) in current feed window`,
      severity: "critical",
      time: "Just now",
      unread: true,
    });
  }

  if (ransomware[0]) {
    notifications.push({
      id: "ransomware",
      title: "Ransomware campaign update",
      message: ransomware[0].title.slice(0, 80),
      severity: "high",
      time: "12m ago",
      unread: true,
    });
  }

  if (withIocs[0]) {
    notifications.push({
      id: "ioc-match",
      title: "IOC correlation match",
      message: `${withIocs[0].iocs!.length} indicators extracted — review for blocking rules`,
      severity: "medium",
      time: "28m ago",
      unread: true,
    });
  }

  if (severityCounts.high >= 5 || apt[0]) {
    notifications.push({
      id: "apt-spike",
      title: "Threat actor activity spike",
      message: apt[0]
        ? apt[0].title.slice(0, 78)
        : `${severityCounts.high} high-severity items require analyst review`,
      severity: "high",
      time: "1h ago",
      unread: severityCounts.high >= 8,
    });
  }

  notifications.push({
    id: "feed-sync",
    title: "Live intelligence sync",
    message: "RSS feeds refreshed — new articles available in priority queue",
    severity: "low",
    time: "2h ago",
    unread: false,
  });

  if (notifications.length < 4) {
    notifications.push({
      id: "advisory",
      title: "Government advisory published",
      message: "Review CISA and vendor advisories in government section",
      severity: "medium",
      time: "3h ago",
      unread: false,
    });
  }

  return notifications.slice(0, 6);
}

export const SEVERITY_DOT: Record<NotificationSeverity, string> = {
  critical: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-slate-500",
};
