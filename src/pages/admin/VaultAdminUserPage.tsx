import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DashField } from "../../components/dashboard/DashField";
import { dashInputClass } from "../../components/dashboard/inputStyles";
import { DASH_CARD } from "../../components/dashboard/theme";
import {
  ApiRequestError,
  adminAdjustBalance,
  adminApproveKyc,
  adminGetUser,
  adminSuspendUser,
  adminUnsuspendUser,
  type AdminUserDetail,
} from "../../lib/api";
import { formatCurrency } from "../../lib/format";

function kycBadgeClass(status: string) {
  if (status === "approved") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "rejected") return "bg-[#FEF2F2] text-[#DC2626]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

function statusBadgeClass(status: string) {
  if (status === "active") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "suspended") return "bg-[#FEF2F2] text-[#DC2626]";
  if (status === "closed") return "bg-[#F3F4F6] text-[#6B7280]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

export function VaultAdminUserPage() {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("adminToken");

  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [approveNotice, setApproveNotice] = useState<string | null>(null);

  const [suspending, setSuspending] = useState(false);
  const [suspendError, setSuspendError] = useState<string | null>(null);
  const [suspendNotice, setSuspendNotice] = useState<string | null>(null);

  const [direction, setDirection] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [adjustNotice, setAdjustNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    adminGetUser(token, id)
      .then(setUser)
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Couldn't load this user."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!token) {
    return <Navigate to="/vaultadmin" replace />;
  }

  async function handleApprove() {
    if (!token || !id) return;
    setApproving(true);
    setApproveError(null);
    setApproveNotice(null);
    try {
      const result = await adminApproveKyc(token, id);
      setUser((prev) => (prev ? { ...prev, kyc: { ...prev.kyc, reviewStatus: result.kycReviewStatus } } : prev));
      setApproveNotice("Approved — the customer has been emailed.");
    } catch (err) {
      setApproveError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setApproving(false);
    }
  }

  async function handleSuspendToggle() {
    if (!token || !id || !user) return;
    const suspended = user.status === "suspended";

    setSuspending(true);
    setSuspendError(null);
    setSuspendNotice(null);
    try {
      const result = suspended ? await adminUnsuspendUser(token, id) : await adminSuspendUser(token, id);
      setUser((prev) => (prev ? { ...prev, status: result.status } : prev));
      setSuspendNotice(
        suspended
          ? "Unsuspended — the customer has been emailed and can log in again."
          : "Suspended — the customer has been emailed and can no longer log in.",
      );
    } catch (err) {
      setSuspendError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSuspending(false);
    }
  }

  async function handleAdjust(e: FormEvent) {
    e.preventDefault();
    if (!token || !id) return;
    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setAdjustError("Enter an amount greater than 0");
      return;
    }

    setAdjusting(true);
    setAdjustError(null);
    setAdjustNotice(null);
    try {
      const result = await adminAdjustBalance(token, id, { direction, amount: parsedAmount, note: note || undefined });
      setUser((prev) => (prev ? { ...prev, account: { ...prev.account, balance: result.balance } } : prev));
      setAdjustNotice(
        `${direction === "credit" ? "Credited" : "Debited"} ${formatCurrency(parsedAmount, user?.account.currency)} — ref ${result.transaction.reference}`,
      );
      setAmount("");
      setNote("");
    } catch (err) {
      setAdjustError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setAdjusting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[720px] px-4 py-8 sm:px-6 sm:py-10">
        <Link to="/vaultadmin" className="text-sm font-medium text-[#6B7280] hover:text-[#111827]">
          ← VaultAdmin
        </Link>

        {loadError && <p className="mt-6 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{loadError}</p>}
        {!user && !loadError && <p className="mt-6 text-sm text-[#6B7280]">Loading…</p>}

        {user && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-[#111827]">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="mt-0.5 text-sm text-[#6B7280]">
                  {user.email} · {user.loginId}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(user.status)}`}>
                  {user.status.replace("_", " ")}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${kycBadgeClass(user.kyc.reviewStatus)}`}>
                  {user.kyc.reviewStatus}
                </span>
              </div>
            </div>

            <div className={`${DASH_CARD} mt-5 p-5 sm:p-6`}>
              <h2 className="text-[15px] font-semibold text-[#111827]">Account access</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                {user.status === "suspended"
                  ? "This account is suspended and can't log in."
                  : "Suspending blocks this account from logging in until reinstated."}
              </p>

              {suspendError && (
                <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{suspendError}</p>
              )}
              {suspendNotice && (
                <p className="mt-4 rounded-xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#16A34A]">{suspendNotice}</p>
              )}

              <DashboardButton
                variant={user.status === "suspended" ? "primary" : "danger"}
                onClick={handleSuspendToggle}
                disabled={suspending}
                className="mt-4"
              >
                {suspending
                  ? "Working…"
                  : user.status === "suspended"
                    ? "Unsuspend account"
                    : "Suspend account"}
              </DashboardButton>
            </div>

            <div className={`${DASH_CARD} mt-5 p-5 sm:p-6`}>
              <h2 className="text-[15px] font-semibold text-[#111827]">Identity verification</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <Field label="ID type" value={user.kyc.idType.replace("_", " ")} />
                <Field label="ID number" value={user.kyc.idNumber} />
                <Field label="Date of birth" value={new Date(user.dateOfBirth).toLocaleDateString()} />
                <Field label="Nationality" value={user.nationality} />
                <Field label="Phone" value={user.phone} />
                <Field
                  label="Address"
                  value={`${user.address.line1}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}, ${user.address.country}`}
                />
              </dl>

              <div className="mt-4">
                <p className="mb-1.5 text-sm font-medium text-[#111827]">Submitted document</p>
                {user.kyc.documentMimeType?.startsWith("image/") ? (
                  <a href={user.kyc.documentUrl} target="_blank" rel="noreferrer">
                    <img
                      src={user.kyc.documentUrl}
                      alt="Submitted identification document"
                      className="max-h-64 rounded-xl border border-[#E5E7EB] object-contain"
                    />
                  </a>
                ) : (
                  <a
                    href={user.kyc.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Open document
                  </a>
                )}
              </div>

              {approveError && <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{approveError}</p>}
              {approveNotice && (
                <p className="mt-4 rounded-xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#16A34A]">{approveNotice}</p>
              )}

              {user.kyc.reviewStatus !== "approved" && (
                <DashboardButton onClick={handleApprove} disabled={approving} className="mt-4">
                  {approving ? "Approving…" : "Approve identity verification"}
                </DashboardButton>
              )}
            </div>

            <div className={`${DASH_CARD} mt-5 p-5 sm:p-6`}>
              <h2 className="text-[15px] font-semibold text-[#111827]">Account balance</h2>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#111827]">
                {formatCurrency(user.account.balance, user.account.currency)}
              </p>
              <p className="mt-0.5 text-xs text-[#6B7280]">Account •••• {user.account.accountNumber.slice(-4)}</p>

              <form onSubmit={handleAdjust} className="mt-5 space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection("credit")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      direction === "credit"
                        ? "bg-[#F0FDF4] text-[#16A34A] ring-1 ring-inset ring-[#16A34A]"
                        : "border border-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    Add funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("debit")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      direction === "debit"
                        ? "bg-[#FEF2F2] text-[#DC2626] ring-1 ring-inset ring-[#DC2626]"
                        : "border border-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    Subtract funds
                  </button>
                </div>

                <DashField label="Amount">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={dashInputClass()}
                  />
                </DashField>

                <DashField label="Note" optional>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason for this adjustment"
                    className={dashInputClass()}
                  />
                </DashField>

                {adjustError && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{adjustError}</p>}
                {adjustNotice && (
                  <p className="rounded-xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#16A34A]">{adjustNotice}</p>
                )}

                <DashboardButton type="submit" disabled={adjusting} className="w-full justify-center">
                  {adjusting ? "Submitting…" : direction === "credit" ? "Add funds" : "Subtract funds"}
                </DashboardButton>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[#6B7280]">{label}</dt>
      <dd className="mt-0.5 text-sm text-[#111827]">{value}</dd>
    </div>
  );
}
