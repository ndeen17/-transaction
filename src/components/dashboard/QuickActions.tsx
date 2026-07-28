import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import { BankIcon, CryptoIcon, TransferIcon } from "./icons";
import { DASH_FOCUS_RING } from "./theme";

interface Action {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  to: string;
}

const ACTIONS: Action[] = [
  { label: "Transfer", Icon: TransferIcon, to: "/dashboard/bank-withdraw" },
  { label: "Bank Deposit", Icon: BankIcon, to: "/dashboard/bank-deposit" },
  { label: "Crypto Deposit", Icon: CryptoIcon, to: "/dashboard/crypto-deposit" },
  { label: "Withdraw via Bank", Icon: BankIcon, to: "/dashboard/bank-withdraw" },
  { label: "Withdraw via Crypto", Icon: CryptoIcon, to: "/dashboard/crypto-withdraw" },
];

export function QuickActions() {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {ACTIONS.map(({ label, Icon, to }) => (
        <Link
          key={label}
          to={to}
          className={`group flex w-[84px] shrink-0 flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition-colors duration-150 ease-in-out hover:bg-[#F8FAFC] ${DASH_FOCUS_RING}`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-badge-bg text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="h-5 w-5" />
          </span>
          <span className="text-xs font-medium leading-tight text-[#111827]">{label}</span>
        </Link>
      ))}
    </div>
  );
}
