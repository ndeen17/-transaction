import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { NotificationBell } from "./NotificationBell";
import { DASH_FOCUS_RING } from "./theme";

interface DashboardTopbarProps {
  firstName: string;
  avatarUrl?: string;
  token: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardTopbar({ firstName, avatarUrl, token }: DashboardTopbarProps) {
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="lg:hidden">
          <Link to="/dashboard">
            <Logo />
          </Link>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#111827]">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">Here's an overview of your finances.</p>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell token={token} />
          <Link
            to="/dashboard/settings"
            aria-label="Settings"
            className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ${DASH_FOCUS_RING}`}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                {initial}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="mt-5 lg:hidden">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-[#111827]">
          {getGreeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">Here's an overview of your finances.</p>
      </div>
    </div>
  );
}
