import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DashField } from "../../components/dashboard/DashField";
import { dashInputClass } from "../../components/dashboard/inputStyles";
import { DASH_CARD } from "../../components/dashboard/theme";
import {
  ApiRequestError,
  adminAcceptBankDeposit,
  adminGetBankDeposit,
  adminRejectBankDeposit,
  type AdminBankDepositSummary,
} from "../../lib/api";
import { formatCurrency } from "../../lib/format";

function statusBadgeClass(status: string) {
  if (status === "credited") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "rejected") return "bg-[#FEF2F2] text-[#DC2626]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[#6B7280]">{label}</dt>
      <dd className="mt-0.5 text-sm text-[#111827]">{value}</dd>
    </div>
  );
}

export function VaultAdminBankDepositDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("adminToken");

  const [request, setRequest] = useState<AdminBankDepositSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [note, setNote] = useState("");
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    adminGetBankDeposit(token, id)
      .then(setRequest)
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Couldn't load this deposit."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!token) {
    return <Navigate to="/vaultadmin" replace />;
  }

  async function handleAccept() {
    if (!token || !id) return;
    setActing(true);
    setActionError(null);
    setNotice(null);
    try {
      await adminAcceptBankDeposit(token, id);
      const fresh = await adminGetBankDeposit(token, id);
      setRequest(fresh);
      setNotice("Approved — the customer has been notified and their balance has been updated.");
    } catch (err) {
      setActionError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setActing(false);
    }
  }

  async function handleReject() {
    if (!token || !id) return;
    setActing(true);
    setActionError(null);
    setNotice(null);
    try {
      await adminRejectBankDeposit(token, id, note || undefined);
      const fresh = await adminGetBankDeposit(token, id);
      setRequest(fresh);
      setNotice("Rejected — the customer has been notified.");
    } catch (err) {
      setActionError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[640px] px-4 py-8 sm:px-6 sm:py-10">
        <Link to="/vaultadmin/bank-deposits" className="text-sm font-medium text-[#6B7280] hover:text-[#111827]">
          ← Bank deposits
        </Link>

        {loadError && <p className="mt-6 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{loadError}</p>}
        {!request && !loadError && <p className="mt-6 text-sm text-[#6B7280]">Loading…</p>}

        {request && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-[#111827]">
                  {request.bankName} deposit — {formatCurrency(request.amount, request.currency)}
                </h1>
                <p className="mt-0.5 text-sm text-[#6B7280]">
                  {request.submitter
                    ? `${request.submitter.firstName} ${request.submitter.lastName} · ${request.submitter.email}`
                    : "Unknown submitter"}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(request.status)}`}>
                {request.status}
              </span>
            </div>

            <div className={`${DASH_CARD} mt-5 p-5 sm:p-6`}>
              <h2 className="text-[15px] font-semibold text-[#111827]">Deposit details</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <Field label="Reference" value={request.reference} />
                <Field label="Amount claimed" value={formatCurrency(request.amount, request.currency)} />
                <Field label="Account name" value={request.accountName} />
                <Field label="Account number" value={request.accountNumber} />
                <Field label="Routing number" value={request.routingNumber || "—"} />
                <Field label="Transfer reference" value={request.senderReference || "—"} />
                <Field label="Submitted" value={new Date(request.createdAt).toLocaleString()} />
                {request.reviewedAt && (
                  <Field label="Reviewed" value={new Date(request.reviewedAt).toLocaleString()} />
                )}
              </dl>

              {request.status === "rejected" && request.adminNote && (
                <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">
                  Rejection note: {request.adminNote}
                </p>
              )}

              {actionError && (
                <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{actionError}</p>
              )}
              {notice && <p className="mt-4 rounded-xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#16A34A]">{notice}</p>}

              {request.status === "pending" && (
                <div className="mt-5 space-y-4">
                  <DashField label="Rejection note" optional>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Shown to the customer if you reject"
                      className={dashInputClass()}
                    />
                  </DashField>
                  <div className="flex gap-2">
                    <DashboardButton onClick={handleAccept} disabled={acting}>
                      {acting ? "Working…" : "Accept"}
                    </DashboardButton>
                    <DashboardButton variant="danger" onClick={handleReject} disabled={acting}>
                      {acting ? "Working…" : "Reject"}
                    </DashboardButton>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
