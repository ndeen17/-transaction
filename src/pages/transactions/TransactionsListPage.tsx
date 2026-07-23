import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ComingSoonToast } from "../../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../../components/dashboard/DashboardNav";
import { TransactionRow } from "../../components/dashboard/TransactionRow";
import { DASH_CARD } from "../../components/dashboard/theme";
import { useAuthedUser } from "../../lib/useAuthedUser";
import { useComingSoonToast } from "../../lib/useComingSoonToast";
import { ApiRequestError, listTransactions, type TransactionSummary } from "../../lib/api";

const PAGE_SIZE = 20;

export function TransactionsListPage() {
  const navigate = useNavigate();
  const { token, cachedUser } = useAuthedUser();
  const { toast, show } = useComingSoonToast();

  const [items, setItems] = useState<TransactionSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    listTransactions(token, { page, limit: PAGE_SIZE })
      .then((result) => {
        setItems(result.items);
        setTotalPages(result.totalPages);
      })
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Couldn't load transactions."))
      .finally(() => setLoading(false));
  }, [token, page]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  }

  if (!token || !cachedUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-0 lg:pl-64">
      <DashboardSidebar onComingSoon={show} onLogout={handleLogout} />

      <div className="mx-auto max-w-[720px] px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
        <h1 className="text-xl font-semibold text-[#111827]">Transactions</h1>

        <div className={`${DASH_CARD} mt-5`}>
          {loading && <p className="p-6 text-sm text-[#6B7280]">Loading…</p>}
          {error && <p className="p-6 text-sm text-[#DC2626]">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="p-6 text-sm text-[#6B7280]">No transactions yet.</p>
          )}
          {!loading && items.length > 0 && (
            <div className="divide-y divide-[#E5E7EB]">
              {items.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-sm font-medium text-[#111827] disabled:text-[#9CA3AF]"
            >
              Previous
            </button>
            <span className="text-xs text-[#6B7280]">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-sm font-medium text-[#111827] disabled:text-[#9CA3AF]"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <DashboardBottomNav onComingSoon={show} onLogout={handleLogout} />
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
