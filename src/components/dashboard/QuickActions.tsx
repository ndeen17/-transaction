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

interface Action {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const ACTIONS: Action[] = [
  { label: "Wire Transfer", Icon: TransferIcon },
  { label: "Local Transfer", Icon: TransferIcon },
  { label: "Internal Transfer", Icon: TransferIcon },
  { label: "Buy Crypto", Icon: CryptoIcon },
  { label: "Pay Bills", Icon: ReceiptIcon },
  { label: "Add Beneficiary", Icon: PersonPlusIcon },
  { label: "Card Deposit", Icon: CardIcon },
  { label: "Crypto Deposit", Icon: CryptoIcon },
  { label: "Check Deposit", Icon: CheckDocumentIcon },
  { label: "Savings Statement", Icon: ListIcon },
  { label: "Checking Statement", Icon: ListIcon },
  { label: "Alerts", Icon: BellIcon },
  { label: "Loans", Icon: CashIcon },
  { label: "Investments", Icon: ChartBarIcon },
  { label: "Support", Icon: ChatIcon },
];

export function QuickActions({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5">
      {ACTIONS.map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(label)}
          className="flex flex-col items-center gap-2 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-[0_10px_20px_-10px_rgba(47,111,238,0.6)] transition-transform active:scale-95 sm:h-14 sm:w-14">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <span className="text-[11px] font-medium leading-tight text-ink sm:text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}
