import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AccountCard } from "../components/dashboard/AccountCard";
import { ComingSoonToast } from "../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../components/dashboard/DashboardNav";
import { DashboardTopbar } from "../components/dashboard/DashboardTopbar";
import { QuickActions } from "../components/dashboard/QuickActions";
import { PANEL } from "../lib/theme";
import { ApiRequestError, fetchMe, type UserSummary } from "../lib/api";

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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-muted">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 lg:pl-64">
      <DashboardSidebar onComingSoon={handleComingSoon} onLogout={handleLogout} />

      <div className="mx-auto max-w-[860px] px-4 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-10">
        <DashboardTopbar firstName={user.firstName} onComingSoon={handleComingSoon} />

        <div className="mt-6 sm:mt-8">
          <AccountCard accountType={user.accountType} status={user.status} account={user.account} />
        </div>

        {user.status === "pending_verification" || user.kycReviewStatus === "pending" ? (
          <div className="mt-6 rounded-2xl border border-[#EEF1F5] bg-[#FFF8EC] px-4 py-3 text-sm text-[#8A6116]">
            Your identity verification is still under review. Some features may be limited until
            it's approved.
          </div>
        ) : null}

        <div className={`${PANEL} mt-6 p-5 sm:mt-8 sm:p-8`}>
          <h2 className="text-sm font-semibold text-ink">Quick actions</h2>
          <div className="mt-5">
            <QuickActions onSelect={handleComingSoon} />
          </div>
        </div>
      </div>

      <DashboardBottomNav onComingSoon={handleComingSoon} onLogout={handleLogout} />

      {loading && (
        <p className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-muted lg:bottom-4">
          Syncing…
        </p>
      )}
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
