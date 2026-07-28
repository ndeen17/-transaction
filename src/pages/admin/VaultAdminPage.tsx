import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { dashInputClass } from "../../components/dashboard/inputStyles";
import { DASH_CARD } from "../../components/dashboard/theme";
import { VaultAdminNav } from "./VaultAdminNav";
import {
  ApiRequestError,
  adminListUsers,
  adminLogin,
  type AdminUserListItem,
} from "../../lib/api";
import { formatCurrency } from "../../lib/format";

const KYC_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

function kycBadgeClass(status: string) {
  if (status === "approved") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "rejected") return "bg-[#FEF2F2] text-[#DC2626]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

export function VaultAdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [items, setItems] = useState<AdminUserListItem[]>([]);
  const [kycFilter, setKycFilter] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    adminListUsers(token, { kycStatus: kycFilter || undefined, search: search || undefined, limit: 50 })
      .then((result) => setItems(result.items))
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 401) {
          localStorage.removeItem("adminToken");
          setToken(null);
          return;
        }
        setError(err instanceof ApiRequestError ? err.message : "Couldn't load users.");
      })
      .finally(() => setLoading(false));
  }, [token, kycFilter, search]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const result = await adminLogin(password);
      localStorage.setItem("adminToken", result.token);
      setToken(result.token);
    } catch (err) {
      setLoginError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setToken(null);
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F1A] px-4">
        <div className="w-full max-w-[380px] rounded-[20px] border border-white/10 bg-[#111827] p-8 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Vaulto Hub</p>
          <h1 className="mt-1.5 text-xl font-semibold text-white">VaultAdmin</h1>
          <p className="mt-1.5 text-sm text-[#9CA3AF]">Sign in with the admin password to continue.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#6B7280] focus:border-blue-500"
            />
            {loginError && <p className="rounded-xl bg-[#450A0A] px-4 py-3 text-sm text-[#FCA5A5]">{loginError}</p>}
            <DashboardButton type="submit" disabled={loggingIn} className="w-full justify-center">
              {loggingIn ? "Signing in…" : "Sign in"}
            </DashboardButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Vaulto Hub</p>
            <h1 className="mt-1 text-xl font-semibold text-[#111827]">VaultAdmin</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
          >
            Log out
          </button>
        </div>

        <VaultAdminNav />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {KYC_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setKycFilter(f.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  kycFilter === f.value
                    ? "bg-blue-600 text-white"
                    : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, login ID…"
            className={`${dashInputClass()} sm:w-64`}
          />
        </div>

        <div className={`${DASH_CARD} mt-5`}>
          {loading && <p className="p-6 text-sm text-[#6B7280]">Loading…</p>}
          {error && <p className="p-6 text-sm text-[#DC2626]">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="p-6 text-sm text-[#6B7280]">No users match this filter.</p>
          )}
          {!loading && items.length > 0 && (
            <div className="divide-y divide-[#E5E7EB]">
              {items.map((u) => (
                <Link
                  key={u.id}
                  to={`/vaultadmin/users/${u.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#111827]">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="truncate text-xs text-[#6B7280]">{u.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium tabular-nums text-[#111827]">
                      {formatCurrency(u.balance, u.currency)}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${kycBadgeClass(u.kycReviewStatus)}`}>
                      {u.kycReviewStatus}
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
