import { Link } from "react-router-dom";
import { BankIcon, CryptoIcon } from "./icons";

const OPTIONS = [
  { label: "Withdraw via Bank", description: "Send funds to your bank", Icon: BankIcon, to: "/dashboard/bank-withdraw" },
  { label: "Withdraw via Crypto", description: "Send funds to your wallet", Icon: CryptoIcon, to: "/dashboard/crypto-withdraw" },
];

interface TransferSheetProps {
  open: boolean;
  onClose: () => void;
}

export function TransferSheet({ open, onClose }: TransferSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 bg-black/40" />

      <div className="relative w-full rounded-t-3xl bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] sm:max-w-sm sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#111827]">Transfer</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] transition-colors duration-150 ease-in-out hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-[#6B7280]">Choose how you'd like to send money.</p>

        <div className="mt-4 space-y-2 pb-[env(safe-area-inset-bottom)]">
          {OPTIONS.map(({ label, description, Icon, to }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3.5 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left transition-colors duration-150 ease-in-out hover:border-[#BFDBFE] hover:bg-[#F8FAFC]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-badge-bg text-blue-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[#111827]">{label}</span>
                <span className="mt-0.5 block text-xs text-[#6B7280]">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
