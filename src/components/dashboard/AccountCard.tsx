import { useState } from "react";
import type { AccountSummary } from "../../lib/api";
import { formatCurrency, maskAccountNumber } from "../../lib/format";
import { CopyIcon, EyeIcon, EyeOffIcon } from "./icons";

interface AccountCardProps {
  accountType: string;
  kycReviewStatus: string;
  account: AccountSummary;
}

export function AccountCard({ accountType, kycReviewStatus, account }: AccountCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const isVerified = kycReviewStatus === "approved";

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
    <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#3D75E8_0%,#1E40AF_55%,#12296B_100%)] p-5 text-white shadow-[0_20px_50px_-16px_rgba(23,65,176,0.5)] sm:p-8">
      {/* Offset brand mark, bleeding off the right edge lower on the card as a subtle watermark */}
      <img
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-28 h-40 w-40 object-contain opacity-[0.14] sm:top-32 sm:h-48 sm:w-48"
      />
      {/* Subtle grain texture for a premium, non-flat surface */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay" aria-hidden>
        <filter id="dash-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dash-grain)" />
      </svg>

      <div className="relative flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/70">
            {accountType === "savings" ? "Savings" : "Current"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              isVerified ? "bg-white/20 text-white" : "bg-white/15 text-white/85"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? "bg-emerald-400" : "bg-[#FBBF24]"}`} />
            {isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setBalanceVisible((v) => !v)}
          aria-label={balanceVisible ? "Hide balance" : "Show balance"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 ease-in-out hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          {balanceVisible ? <EyeIcon className="h-[18px] w-[18px]" /> : <EyeOffIcon className="h-[18px] w-[18px]" />}
        </button>
      </div>

      <p className="relative mb-1 mt-6 text-[13px] font-medium text-white/60">Available balance</p>
      <p
        className={`relative text-[40px] font-semibold tracking-tight transition-all duration-300 ease-in-out sm:text-[48px] ${
          balanceVisible ? "blur-0 opacity-100" : "opacity-90"
        }`}
      >
        {balanceVisible ? formatCurrency(account.balance, account.currency) : "•••••• . ••"}
      </p>

      <div className="relative mt-7 flex items-center justify-between border-t border-white/15 pt-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">Account number</p>
          <p className="mt-1.5 text-sm font-medium tabular-nums">{maskAccountNumber(account.accountNumber)}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-medium transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95"
        >
          <CopyIcon className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="relative mt-5 grid grid-cols-2 divide-x divide-white/15 border-t border-white/15 pt-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">Total credit</p>
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-emerald-300">
            +{formatCurrency(account.totalCredit, account.currency)}
          </p>
        </div>
        <div className="pl-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">Total debit</p>
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-red-400">
            −{formatCurrency(account.totalDebit, account.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
