import type { ComponentType, SVGProps } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../Logo";
import { openSupportChat } from "../../lib/supportChat";
import { ArrowUpIcon, ChatIcon, HomeIcon, LogoutIcon, SettingsIcon } from "./icons";
import { DASH_FOCUS_RING } from "./theme";

interface NavItem {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  action: "logout" | "openSupport" | "link";
  to?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Settings", Icon: SettingsIcon, action: "link", to: "/dashboard/settings" },
  { label: "Home", Icon: HomeIcon, action: "link", to: "/dashboard" },
  { label: "Transfer", Icon: ArrowUpIcon, action: "link", to: "/dashboard/bank-withdraw" },
  { label: "Support", Icon: ChatIcon, action: "openSupport" },
];

interface NavHandlers {
  onComingSoon: (label: string) => void;
  onLogout: () => void;
}

function handleClick(item: NavItem, { onLogout }: NavHandlers) {
  if (item.action === "logout") onLogout();
  else if (item.action === "openSupport") openSupportChat();
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

          if (item.label === "Transfer") {
            return (
              <Link
                key={item.label}
                to={item.to!}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 ${DASH_FOCUS_RING}`}
              >
                <span className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] transition-transform duration-150 ease-in-out active:scale-95">
                  <item.Icon className="h-5 w-5" />
                </span>
                <span className="mt-6 text-[10px] font-medium text-blue-600">{item.label}</span>
              </Link>
            );
          }

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
        {NAV_ITEMS.filter((item) => item.action !== "logout" && item.label !== "Transfer").map((item) => {
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
