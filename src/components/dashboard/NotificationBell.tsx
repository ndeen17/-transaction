import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "./icons";
import { DASH_FOCUS_RING } from "./theme";
import { useNotifications } from "../../lib/useNotifications";
import type { NotificationItem } from "../../lib/api";

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMin = Math.round((Date.now() - date.getTime()) / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

export function NotificationBell({ token }: { token: string }) {
  const navigate = useNavigate();
  const { items, unreadCount, markRead, markAllRead } = useNotifications(token);
  const [open, setOpen] = useState(false);

  function handleItemClick(item: NotificationItem) {
    if (!item.read) markRead(item.id);
    setOpen(false);
    if (item.link) navigate(item.link);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] text-[#111827] transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:bg-[#F8FAFC] ${DASH_FOCUS_RING}`}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
              <p className="text-sm font-semibold text-[#111827]">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-[#6B7280]">No notifications yet.</p>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`block w-full border-b border-[#F3F4F6] px-4 py-3 text-left last:border-b-0 hover:bg-[#F8FAFC] ${
                      item.read ? "" : "bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[#111827]">{item.title}</p>
                      {!item.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#6B7280]">{item.body}</p>
                    <p className="mt-1 text-[11px] text-[#9CA3AF]">{relativeTime(item.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
