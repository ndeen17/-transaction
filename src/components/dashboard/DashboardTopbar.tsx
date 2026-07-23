import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { BellIcon } from "./icons";
import { DASH_FOCUS_RING } from "./theme";

interface DashboardTopbarProps {
  firstName: string;
  onComingSoon: (label: string) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardTopbar({ firstName, onComingSoon }: DashboardTopbarProps) {
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between">
      <div className="lg:hidden">
        <Link to="/">
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
        <button
          type="button"
          onClick={() => onComingSoon("Notifications")}
          aria-label="Notifications"
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] text-[#111827] transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:bg-[#F8FAFC] ${DASH_FOCUS_RING}`}
        >
          <BellIcon className="h-5 w-5" />
        </button>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          {initial}
        </span>
      </div>
    </div>
  );
}
