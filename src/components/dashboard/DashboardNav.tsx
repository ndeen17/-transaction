import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { BellIcon, ChatIcon, HomeIcon, LogoutIcon, SettingsIcon } from "./icons";

interface NavItem {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
  action: "home" | "logout" | "comingSoon";
}

const NAV_ITEMS: NavItem[] = [
  { label: "Settings", Icon: SettingsIcon, action: "comingSoon" },
  { label: "Notifications", Icon: BellIcon, action: "comingSoon" },
  { label: "Home", Icon: HomeIcon, active: true, action: "home" },
  { label: "Support", Icon: ChatIcon, action: "comingSoon" },
  { label: "Logout", Icon: LogoutIcon, action: "logout" },
];

interface NavHandlers {
  onComingSoon: (label: string) => void;
  onLogout: () => void;
}

function handleClick(item: NavItem, { onComingSoon, onLogout }: NavHandlers) {
  if (item.action === "logout") onLogout();
  else if (item.action === "comingSoon") onComingSoon(item.label);
}

export function DashboardBottomNav(handlers: NavHandlers) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EEF1F5] bg-white/95 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-2.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleClick(item, handlers)}
            className="flex flex-col items-center gap-1 px-2 py-1"
          >
            <span className={item.active ? "text-blue-600" : "text-muted"}>
              <item.Icon className="h-5 w-5" />
            </span>
            <span className={`text-[10px] font-medium ${item.active ? "text-blue-600" : "text-muted"}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function DashboardSidebar(handlers: NavHandlers) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#EEF1F5] bg-white p-5 lg:flex">
      <Link to="/" className="px-1">
        <Logo />
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.filter((item) => item.action !== "logout").map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleClick(item, handlers)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              item.active ? "bg-badge-bg text-blue-600" : "text-muted hover:bg-[#F6F8FB] hover:text-ink"
            }`}
          >
            <item.Icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={handlers.onLogout}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-[#FDEEEE] hover:text-[#F2555A]"
      >
        <LogoutIcon className="h-5 w-5" />
        Log out
      </button>
    </aside>
  );
}
