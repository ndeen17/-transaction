import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ComingSoonToast } from "../../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../../components/dashboard/DashboardNav";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DASH_CARD } from "../../components/dashboard/theme";
import { ClockIcon, DownloadIcon, PrintIcon, ShareIcon } from "../../components/dashboard/icons";
import { Receipt } from "../../components/receipt/Receipt";
import { exportReceiptToPdf } from "../../lib/receiptExport";
import { formatCurrency } from "../../lib/format";
import { useAuthedUser } from "../../lib/useAuthedUser";
import { useComingSoonToast } from "../../lib/useComingSoonToast";
import {
  ApiRequestError,
  getMyCryptoDeposit,
  getTransaction,
  type CryptoDepositSummary,
  type TransactionSummary,
} from "../../lib/api";

function statusBadgeClass(status: CryptoDepositSummary["status"]) {
  if (status === "credited") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "rejected") return "bg-[#FEF2F2] text-[#DC2626]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

function statusLabel(status: CryptoDepositSummary["status"]) {
  if (status === "credited") return "Credited";
  if (status === "rejected") return "Rejected";
  if (status === "pending") return "Pending review";
  return "Processing";
}

export function CryptoDepositDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, cachedUser, user } = useAuthedUser();
  const { toast, show } = useComingSoonToast();

  const [request, setRequest] = useState<CryptoDepositSummary | null>(null);
  const [transaction, setTransaction] = useState<TransactionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !id) return;
    getMyCryptoDeposit(token, id)
      .then(setRequest)
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : "Couldn't load this deposit."),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!token || !request || request.status !== "credited" || !request.transactionId) return;
    getTransaction(token, request.transactionId).then(setTransaction).catch(() => {});
  }, [token, request]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  }

  if (!token || !cachedUser) {
    return <Navigate to="/" replace />;
  }

  async function handleDownload() {
    if (!receiptRef.current || !transaction) return;
    setExporting(true);
    try {
      await exportReceiptToPdf(receiptRef.current, `astera-receipt-${transaction.reference}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  async function handleShare() {
    if (!transaction) return;
    const text = `Vaulto Hub receipt\nRef: ${transaction.reference}\nAmount: ${transaction.amount} ${transaction.currency}\nStatus: ${transaction.status}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Vaulto Hub Receipt", text });
        return;
      } catch {
        // User cancelled the native share sheet — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be unavailable — fail silently, no crash.
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-0 lg:pl-64">
      <DashboardSidebar onComingSoon={show} onLogout={handleLogout} />

      <div className="mx-auto max-w-[560px] px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
        <Link
          to="/dashboard/crypto-deposits"
          className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
        >
          ← Crypto deposits
        </Link>

        <div className="mt-6">
          {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}
          {!request && !error && <p className="text-sm text-[#6B7280]">Loading…</p>}

          {request && request.status === "credited" && transaction && user && (
            <>
              <Receipt
                ref={receiptRef}
                transaction={transaction}
                accountHolderName={`${user.firstName} ${user.lastName}`}
                accountNumber={user.account.accountNumber}
              />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <DashboardButton
                  variant="secondary"
                  onClick={handleDownload}
                  disabled={exporting}
                  className="justify-center gap-1.5"
                >
                  <DownloadIcon className="h-4 w-4" /> {exporting ? "Saving…" : "Download"}
                </DashboardButton>
                <DashboardButton variant="secondary" onClick={handleShare} className="justify-center gap-1.5">
                  <ShareIcon className="h-4 w-4" /> Share
                </DashboardButton>
                <DashboardButton
                  variant="secondary"
                  onClick={() => window.print()}
                  className="justify-center gap-1.5"
                >
                  <PrintIcon className="h-4 w-4" /> Print
                </DashboardButton>
              </div>
            </>
          )}

          {request && request.status !== "credited" && (
            <div className={`${DASH_CARD} p-6 text-center`}>
              <div className="flex justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFFBEB] text-[#B45309]">
                  <ClockIcon className="h-7 w-7" />
                </span>
              </div>
              <p className="mt-4 text-lg font-semibold text-[#111827]">
                {request.symbol} — {formatCurrency(request.amount, request.currency)}
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(request.status)}`}
              >
                {statusLabel(request.status)}
              </span>

              <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                {request.status === "pending" &&
                  "We're reviewing your deposit. You'll be notified here once it's processed."}
                {(request.status === "accepted" || request.status === "crediting") &&
                  "Your deposit was accepted and is being processed — it'll reflect in your balance shortly."}
                {request.status === "rejected" &&
                  (request.adminNote || "This deposit was declined. Contact support if you believe this is a mistake.")}
              </p>

              <p className="mt-4 font-mono text-xs text-[#6B7280]">Ref: {request.reference}</p>

              <DashboardButton onClick={() => navigate("/dashboard")} className="mt-6">
                Back to dashboard
              </DashboardButton>
            </div>
          )}
        </div>
      </div>

      <DashboardBottomNav onComingSoon={show} onLogout={handleLogout} />
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
