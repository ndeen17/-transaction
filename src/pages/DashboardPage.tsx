import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AccountCard } from "../components/dashboard/AccountCard";
import { ComingSoonToast } from "../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../components/dashboard/DashboardNav";
import { DashboardButton } from "../components/dashboard/DashboardButton";
import { DashboardTopbar } from "../components/dashboard/DashboardTopbar";
import { InboxIcon, PlusCircleIcon, ShieldIcon } from "../components/dashboard/icons";
import { QuickActions } from "../components/dashboard/QuickActions";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { DASH_CARD } from "../components/dashboard/theme";
import { ApiRequestError, fetchMe, listTransactions, type TransactionSummary, type UserSummary } from "../lib/api";

export function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const cachedUser = localStorage.getItem("authUser");

  const [user, setUser] = useState<UserSummary | null>(
    cachedUser ? (JSON.parse(cachedUser) as UserSummary) : null,
  );
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);

  useEffect(() => {
    if (!token) return;

    fetchMe(token)
      .then((fresh) => {
        setUser(fresh);
        localStorage.setItem("authUser", JSON.stringify(fresh));
      })
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));

    listTransactions(token, { page: 1, limit: 5 })
      .then((result) => setTransactions(result.items))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  }

  function handleComingSoon(label: string) {
    setToast(label);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }

  if (!token || !cachedUser) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <p className="text-sm text-[#6B7280]">Loading your dashboard…</p>
      </div>
    );
  }

  const needsVerification = user.status === "pending_verification" || user.kycReviewStatus === "pending";
  const hasZeroBalance = user.account.balance === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-0 lg:pl-64">
      <DashboardSidebar onComingSoon={handleComingSoon} onLogout={handleLogout} />

      <div className="mx-auto max-w-[900px] px-4 pb-6 pt-5 sm:px-6 sm:pt-8 lg:px-12 lg:pt-12">
        <DashboardTopbar firstName={user.firstName} onComingSoon={handleComingSoon} />

        <div className="mt-8 sm:mt-10">
          <AccountCard accountType={user.accountType} status={user.status} account={user.account} />
        </div>

        {needsVerification && (
          <div className={`${DASH_CARD} mt-6 flex flex-col gap-4 p-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFFBEB] text-[#B45309]">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Complete your identity verification</p>
                <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
                  Your account is under review. Some features remain unavailable until
                  verification is complete.
                </p>
              </div>
            </div>
            <DashboardButton
              variant="secondary"
              onClick={() => handleComingSoon("Verification status")}
              className="shrink-0"
            >
              Continue Verification
            </DashboardButton>
          </div>
        )}

        <div className={`${DASH_CARD} mt-6 p-5 sm:mt-8 sm:p-8`}>
          <h2 className="text-[15px] font-semibold text-[#111827]">Quick actions</h2>
          <div className="mt-5">
            <QuickActions onSelect={handleComingSoon} />
          </div>
        </div>

        <div className={`${DASH_CARD} mt-6 p-6 sm:mt-8 sm:p-8`}>
          <h2 className="text-[15px] font-semibold text-[#111827]">Recent activity</h2>

          {transactions.length > 0 ? (
            <div className="mt-6">
              <RecentActivity
                transactions={transactions}
                onSelect={(id) => navigate(`/dashboard/transactions/${id}`)}
              />
            </div>
          ) : hasZeroBalance ? (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-[#E5E7EB] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-badge-bg text-blue-600">
                <PlusCircleIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-semibold text-[#111827]">Your account is ready.</p>
              <p className="mt-1 max-w-xs text-sm text-[#6B7280]">
                Make your first deposit to start using your account.
              </p>
              <DashboardButton
                onClick={() => navigate("/dashboard/deposit")}
                className="mt-5"
              >
                Deposit Funds
              </DashboardButton>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-[#E5E7EB] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]">
                <InboxIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-semibold text-[#111827]">No recent transactions yet.</p>
              <p className="mt-1 max-w-xs text-sm text-[#6B7280]">Your activity will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <DashboardBottomNav onComingSoon={handleComingSoon} onLogout={handleLogout} />

      {loading && (
        <p className="fixed bottom-24 left-1/2 -translate-x-1/2 text-xs text-[#6B7280] lg:bottom-4">
          Syncing…
        </p>
      )}
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
