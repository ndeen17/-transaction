import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { BellIcon } from "./icons";

interface DashboardTopbarProps {
  firstName: string;
  onComingSoon: (label: string) => void;
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
      <h1 className="hidden text-xl font-medium tracking-tight text-ink lg:block">
        Welcome back, {firstName}
      </h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onComingSoon("Notifications")}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#EEF1F5] text-ink transition-colors hover:bg-[#F6F8FB]"
        >
          <BellIcon className="h-5 w-5" />
        </button>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white">
          {initial}
        </span>
      </div>
    </div>
  );
}
