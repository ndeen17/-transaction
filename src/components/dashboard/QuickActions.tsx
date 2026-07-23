import type { ComponentType, SVGProps } from "react";
import {
  BellIcon,
  CardIcon,
  CashIcon,
  ChartBarIcon,
  ChatIcon,
  CheckDocumentIcon,
  CryptoIcon,
  ListIcon,
  PersonPlusIcon,
  ReceiptIcon,
  TransferIcon,
} from "./icons";
import { DASH_FOCUS_RING } from "./theme";

interface Action {
  label: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const ACTIONS: Action[] = [
  { label: "Wire Transfer", description: "Send money abroad", Icon: TransferIcon },
  { label: "Local Transfer", description: "Domestic transfers", Icon: TransferIcon },
  { label: "Internal Transfer", description: "Between your accounts", Icon: TransferIcon },
  { label: "Buy Crypto", description: "Purchase digital assets", Icon: CryptoIcon },
  { label: "Pay Bills", description: "Utilities & subscriptions", Icon: ReceiptIcon },
  { label: "Add Beneficiary", description: "Manage saved recipients", Icon: PersonPlusIcon },
  { label: "Card Deposit", description: "Fund with a debit card", Icon: CardIcon },
  { label: "Crypto Deposit", description: "Fund with crypto", Icon: CryptoIcon },
  { label: "Check Deposit", description: "Deposit a check remotely", Icon: CheckDocumentIcon },
  { label: "Savings Statement", description: "View savings history", Icon: ListIcon },
  { label: "Checking Statement", description: "View checking history", Icon: ListIcon },
  { label: "Alerts", description: "Notification settings", Icon: BellIcon },
  { label: "Loans", description: "Apply for financing", Icon: CashIcon },
  { label: "Investments", description: "Grow your portfolio", Icon: ChartBarIcon },
  { label: "Support", description: "Get help from our team", Icon: ChatIcon },
];

export function QuickActions({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ACTIONS.map(({ label, description, Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(label)}
          className={`group flex items-center gap-3.5 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:translate-y-0 active:scale-[0.99] ${DASH_FOCUS_RING}`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-badge-bg text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-[#111827]">{label}</span>
            <span className="mt-0.5 block truncate text-xs text-[#6B7280]">{description}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
