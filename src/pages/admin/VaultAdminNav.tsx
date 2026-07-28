import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adminListBankDeposits, adminListCryptoDeposits } from "../../lib/api";

const TABS = [
  { label: "Users", to: "/vaultadmin" },
  { label: "Crypto Assets", to: "/vaultadmin/crypto-assets" },
  { label: "Crypto Deposits", to: "/vaultadmin/crypto-deposits" },
  { label: "Bank Accounts", to: "/vaultadmin/bank-accounts" },
  { label: "Bank Deposits", to: "/vaultadmin/bank-deposits" },
] as const;

export function VaultAdminNav() {
  const { pathname } = useLocation();
  const [cryptoPendingCount, setCryptoPendingCount] = useState(0);
  const [bankPendingCount, setBankPendingCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    adminListCryptoDeposits(token, { status: "pending", limit: 1 })
      .then((result) => setCryptoPendingCount(result.total))
      .catch(() => {});
    adminListBankDeposits(token, { status: "pending", limit: 1 })
      .then((result) => setBankPendingCount(result.total))
      .catch(() => {});
  }, []);

  return (
    <div className="mt-6 flex gap-1 overflow-x-auto border-b border-[#E5E7EB]">
      {TABS.map((tab) => {
        const active = pathname === tab.to;
        const badgeCount =
          tab.to === "/vaultadmin/crypto-deposits"
            ? cryptoPendingCount
            : tab.to === "/vaultadmin/bank-deposits"
              ? bankPendingCount
              : 0;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`relative -mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
              active ? "border-blue-600 text-blue-600" : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {tab.label}
            {badgeCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#DC2626] px-1.5 text-[11px] font-semibold text-white">
                {badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
