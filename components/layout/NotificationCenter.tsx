"use client";

import { useDropdown } from "@/hooks/useDropdown";
import {
  buildSocNotifications,
  SEVERITY_DOT,
  type SocNotification,
} from "@/lib/notifications";
import type { ThreatArticle, ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface NotificationCenterProps {
  severityCounts: Record<ThreatSeverity, number>;
  articles: ThreatArticle[];
}

export function NotificationCenter({
  severityCounts,
  articles,
}: NotificationCenterProps) {
  const { open, toggle, ref } = useDropdown();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(
    () => buildSocNotifications(severityCounts, articles),
    [severityCounts, articles]
  );

  const unreadCount = notifications.filter((n) => n.unread && !readIds.has(n.id)).length;

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "relative rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200",
          open && "bg-slate-800/60 text-slate-200"
        )}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-semibold text-white animate-subtle-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-panel absolute right-0 top-full z-50 mt-1.5 w-80 origin-top-right">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold text-slate-100">Notifications</p>
              <p className="text-xs text-slate-500">SOC intelligence alerts</p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-blue-400/90 hover:text-blue-300"
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-72 overflow-y-auto py-1">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                read={readIds.has(n.id) || !n.unread}
                onRead={() => setReadIds((prev) => new Set(prev).add(n.id))}
              />
            ))}
          </ul>

          <div className="border-t border-slate-800/80 px-3 py-2">
            <button
              type="button"
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300"
            >
              View alert history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  read,
  onRead,
}: {
  notification: SocNotification;
  read: boolean;
  onRead: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onRead}
        className={cn(
          "flex w-full gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-slate-800/40",
          !read && "bg-blue-950/20"
        )}
      >
        <span
          className={cn(
            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
            SEVERITY_DOT[notification.severity]
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm leading-snug",
              read ? "font-medium text-slate-300" : "font-semibold text-slate-100"
            )}
          >
            {notification.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {notification.message}
          </p>
          <p className="mt-1 text-[10px] text-slate-600">{notification.time}</p>
        </div>
      </button>
    </li>
  );
}

function BellIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}
