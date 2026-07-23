import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";

export function TransactionFlowShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard">
            <Logo />
          </Link>
          <Link to="/dashboard" className="text-sm text-[#6B7280] hover:text-[#111827]">
            Cancel
          </Link>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
