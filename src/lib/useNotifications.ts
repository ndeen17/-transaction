import { useCallback, useEffect, useRef, useState } from "react";
import { listNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "./api";

const POLL_INTERVAL_MS = 20_000;

export function useNotifications(token: string | null) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(() => {
    if (!token) return;
    listNotifications(token, { limit: 10 })
      .then((result) => {
        setItems(result.items);
        setUnreadCount(result.unreadCount);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;

    refresh();

    function startPolling() {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    }
    function stopPolling() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    function handleVisibility() {
      if (document.hidden) {
        stopPolling();
      } else {
        refresh();
        startPolling();
      }
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refresh);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refresh);
    };
  }, [token, refresh]);

  async function markRead(id: string) {
    if (!token) return;
    try {
      await markNotificationRead(token, id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Best-effort — a stale badge is a minor inconvenience, not worth surfacing an error.
    }
  }

  async function markAllRead() {
    if (!token) return;
    try {
      await markAllNotificationsRead(token);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Best-effort, same as markRead.
    }
  }

  return { items, unreadCount, markRead, markAllRead, refresh };
}
