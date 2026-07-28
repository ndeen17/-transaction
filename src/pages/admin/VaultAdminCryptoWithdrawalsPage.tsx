import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { DASH_CARD } from "../../components/dashboard/theme";
import { VaultAdminNav } from "./VaultAdminNav";
import { ApiRequestError, adminListCryptoWithdrawals, type AdminCryptoWithdrawalSummary } from "../../lib/api";
import { formatCurrency } from "../../lib/format";

const STATUS_FILTERS = [
  { label: "Processing", value: "processing" },
  { label: "Declined", value: "declined" },
  { label: "Completed", value: "completed" },
  { label: "All", value: "" },
] as const;

function statusBadgeClass(status: string) {
  if (status === "completed") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "declined") return "bg-[#FEF2F2] text-[#DC2626]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

export function VaultAdminCryptoWithdrawalsPage() {
  const token = localStorage.getItem("adminToken");

  const [items, setItems] = useState<AdminCryptoWithdrawalSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("processing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    adminListCryptoWithdrawals(token, { status: statusFilter || undefined, limit: 50 })
      .then((result) => setItems(result.items))
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Couldn't load crypto withdrawals."))
      .finally(() => setLoading(false));
  }, [token, statusFilter]);

  if (!token) {
    return <Navigate to="/vaultadmin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Vaulto Hub</p>
          <h1 className="mt-1 text-xl font-semibold text-[#111827]">VaultAdmin</h1>
        </div>

        <VaultAdminNav />

        <div className="mt-6 flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-blue-600 text-white"
                  : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={`${DASH_CARD} mt-5`}>
          {loading && <p className="p-6 text-sm text-[#6B7280]">Loading…</p>}
          {error && <p className="p-6 text-sm text-[#DC2626]">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="p-6 text-sm text-[#6B7280]">No crypto withdrawals match this filter.</p>
          )}
          {!loading && items.length > 0 && (
            <div className="divide-y divide-[#E5E7EB]">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/vaultadmin/crypto-withdrawals/${item.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#111827]">
                      {item.submitter ? `${item.submitter.firstName} ${item.submitter.lastName}` : "Unknown user"}
                    </p>
                    <p className="truncate text-xs text-[#6B7280]">
                      {item.symbol} · {item.reference}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium tabular-nums text-[#111827]">
                      {formatCurrency(item.amount, item.currency)}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
