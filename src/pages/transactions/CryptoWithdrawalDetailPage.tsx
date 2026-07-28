import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ComingSoonToast } from "../../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../../components/dashboard/DashboardNav";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DownloadIcon, PrintIcon, ShareIcon } from "../../components/dashboard/icons";
import { Receipt } from "../../components/receipt/Receipt";
import { exportReceiptToPdf } from "../../lib/receiptExport";
import { useAuthedUser } from "../../lib/useAuthedUser";
import { useComingSoonToast } from "../../lib/useComingSoonToast";
import {
  ApiRequestError,
  getMyCryptoWithdrawal,
  getTransaction,
  type CryptoWithdrawalSummary,
  type TransactionSummary,
} from "../../lib/api";

function statusBannerClass(status: CryptoWithdrawalSummary["status"]) {
  if (status === "completed") return "bg-[#F0FDF4] text-[#16A34A]";
  if (status === "declined") return "bg-[#FEF2F2] text-[#DC2626]";
  return "bg-[#FFFBEB] text-[#B45309]";
}

function statusMessage(request: CryptoWithdrawalSummary) {
  if (request.status === "completed") return "This withdrawal has been reviewed and approved.";
  if (request.status === "declined")
    return request.adminNote
      ? `This withdrawal was declined and refunded: ${request.adminNote}`
      : "This withdrawal was declined and refunded to your balance.";
  return "This withdrawal is processing — already deducted from your balance, awaiting review.";
}

export function CryptoWithdrawalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, cachedUser, user } = useAuthedUser();
  const { toast, show } = useComingSoonToast();

  const [request, setRequest] = useState<CryptoWithdrawalSummary | null>(null);
  const [transaction, setTransaction] = useState<TransactionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !id) return;
    getMyCryptoWithdrawal(token, id)
      .then(setRequest)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Couldn't load this withdrawal."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!token || !request) return;
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
      await exportReceiptToPdf(receiptRef.current, `vaultohub-receipt-${transaction.reference}.pdf`);
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
          to="/dashboard/crypto-withdrawals"
          className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
        >
          ← Crypto withdrawals
        </Link>

        <div className="mt-6">
          {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}
          {!request && !error && <p className="text-sm text-[#6B7280]">Loading…</p>}

          {request && (
            <>
              <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${statusBannerClass(request.status)}`}>
                {statusMessage(request)}
              </div>

              {transaction && user && (
                <div className="mt-5">
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
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DashboardBottomNav onComingSoon={show} onLogout={handleLogout} />
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
