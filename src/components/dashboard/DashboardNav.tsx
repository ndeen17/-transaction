import type { ComponentType, SVGProps } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../Logo";
import { BellIcon, ChatIcon, HomeIcon, LogoutIcon, SettingsIcon } from "./icons";
import { DASH_FOCUS_RING } from "./theme";

interface NavItem {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  action: "logout" | "comingSoon" | "link";
  to?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Settings", Icon: SettingsIcon, action: "link", to: "/dashboard/settings" },
  { label: "Notifications", Icon: BellIcon, action: "comingSoon" },
  { label: "Home", Icon: HomeIcon, action: "link", to: "/dashboard" },
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

function isActive(item: NavItem, pathname: string): boolean {
  return item.to !== undefined && pathname === item.to;
}

export function DashboardBottomNav(handlers: NavHandlers) {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white/95 backdrop-blur-sm lg:hidden"
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          const className = `flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors duration-150 ease-in-out ${DASH_FOCUS_RING}`;
          const content = (
            <>
              <span className={active ? "text-blue-600" : "text-[#6B7280]"}>
                <item.Icon className="h-[22px] w-[22px]" />
              </span>
              <span className={`text-[10px] font-medium ${active ? "text-blue-600" : "text-[#6B7280]"}`}>
                {item.label}
              </span>
            </>
          );

          return item.to ? (
            <Link key={item.label} to={item.to} aria-current={active ? "page" : undefined} className={className}>
              {content}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item, handlers)}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function DashboardSidebar(handlers: NavHandlers) {
  const { pathname } = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#E5E7EB] bg-white p-6 lg:flex">
      <Link to="/dashboard" className="px-1">
        <Logo />
      </Link>

      <nav aria-label="Primary" className="mt-10 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.filter((item) => item.action !== "logout").map((item) => {
          const active = isActive(item, pathname);
          const className = `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out ${DASH_FOCUS_RING} ${
            active ? "bg-badge-bg text-blue-600" : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"
          }`;
          const content = (
            <>
              <item.Icon className="h-[22px] w-[22px]" />
              {item.label}
            </>
          );

          return item.to ? (
            <Link key={item.label} to={item.to} aria-current={active ? "page" : undefined} className={className}>
              {content}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item, handlers)}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handlers.onLogout}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#6B7280] transition-colors duration-150 ease-in-out hover:bg-[#FEF2F2] hover:text-[#DC2626] ${DASH_FOCUS_RING}`}
      >
        <LogoutIcon className="h-[22px] w-[22px]" />
        Log out
      </button>
    </aside>
  );
}
