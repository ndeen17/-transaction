import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ComingSoonToast } from "../../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../../components/dashboard/DashboardNav";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DownloadIcon, PrintIcon, RepeatIcon, ShareIcon } from "../../components/dashboard/icons";
import { Receipt } from "../../components/receipt/Receipt";
import { exportReceiptToPdf } from "../../lib/receiptExport";
import { useAuthedUser } from "../../lib/useAuthedUser";
import { useComingSoonToast } from "../../lib/useComingSoonToast";
import { ApiRequestError, getTransaction, type TransactionSummary } from "../../lib/api";

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, cachedUser, user } = useAuthedUser();
  const { toast, show } = useComingSoonToast();

  const [transaction, setTransaction] = useState<TransactionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !id) return;
    getTransaction(token, id)
      .then(setTransaction)
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : "Couldn't load this transaction."),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    const text = `Astera Banking receipt\nRef: ${transaction.reference}\nAmount: ${transaction.amount} ${transaction.currency}\nStatus: ${transaction.status}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Astera Banking Receipt", text });
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

  function handleRepeat() {
    if (!transaction) return;
    const path = transaction.type === "transfer" ? "/dashboard/send" : "/dashboard/deposit";
    navigate(`${path}?repeat=${transaction.id}`);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-0 lg:pl-64">
      <DashboardSidebar onComingSoon={show} onLogout={handleLogout} />

      <div className="mx-auto max-w-[560px] px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
        <Link to="/dashboard/transactions" className="text-sm font-medium text-[#6B7280] hover:text-[#111827]">
          ← Transactions
        </Link>

        <div className="mt-6">
          {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

          {!transaction && !error && <p className="text-sm text-[#6B7280]">Loading receipt…</p>}

          {transaction && user && (
            <>
              <Receipt
                ref={receiptRef}
                transaction={transaction}
                accountHolderName={`${user.firstName} ${user.lastName}`}
                accountNumber={user.account.accountNumber}
              />

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                <DashboardButton variant="secondary" onClick={handleRepeat} className="justify-center gap-1.5">
                  <RepeatIcon className="h-4 w-4" /> Repeat
                </DashboardButton>
              </div>
            </>
          )}
        </div>
      </div>

      <DashboardBottomNav onComingSoon={show} onLogout={handleLogout} />
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
