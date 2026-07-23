import { useState } from "react";
import type { AccountSummary } from "../../lib/api";
import { formatCurrency, maskAccountNumber } from "../../lib/format";
import { CopyIcon, EyeIcon, EyeOffIcon } from "./icons";

interface AccountCardProps {
  accountType: string;
  status: string;
  account: AccountSummary;
}

export function AccountCard({ accountType, status, account }: AccountCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const isActive = status === "active";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — fail silently, no crash.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7FB6FB] via-[#4C86EF] to-[#1B4FD1] p-6 text-white shadow-[0_20px_45px_-20px_rgba(27,79,209,0.55)] sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.35),transparent_55%)]" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/75">
            {accountType === "savings" ? "Savings" : "Current"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              isActive ? "bg-positive/20 text-white" : "bg-white/15 text-white/85"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-positive" : "bg-white/60"}`} />
            {isActive ? "Active" : "Pending"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setBalanceVisible((v) => !v)}
          aria-label={balanceVisible ? "Hide balance" : "Show balance"}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        >
          {balanceVisible ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
        </button>
      </div>

      <p className="relative mt-4 text-[34px] font-semibold tracking-tight sm:text-[40px]">
        {balanceVisible ? formatCurrency(account.balance, account.currency) : "•••••••"}
      </p>

      <div className="relative mt-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/70">Account number</p>
          <p className="mt-1 text-sm font-medium">{maskAccountNumber(account.accountNumber)}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/25"
        >
          <CopyIcon className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/70">Total credit</p>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(account.totalCredit, account.currency)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/70">Total debit</p>
          <p className="mt-1 text-sm font-semibold">{formatCurrency(account.totalDebit, account.currency)}</p>
        </div>
      </div>
    </div>
  );
}
