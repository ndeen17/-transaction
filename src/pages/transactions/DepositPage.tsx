import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { TransactionFlowShell } from "../../components/transactions/TransactionFlowShell";
import { DepositDetailsStep } from "../../components/transactions/DepositDetailsStep";
import { ReviewStep } from "../../components/transactions/ReviewStep";
import { AuthenticateStep } from "../../components/transactions/AuthenticateStep";
import { ProcessingStep } from "../../components/transactions/ProcessingStep";
import { SuccessStep } from "../../components/transactions/SuccessStep";
import { sleep } from "../../lib/async";
import { formatCurrency } from "../../lib/format";
import { useAuthedUser } from "../../lib/useAuthedUser";
import {
  ApiRequestError,
  fetchMe,
  getTransaction,
  submitDeposit,
  type TransactionSummary,
} from "../../lib/api";
import type { DepositDetailsValues } from "../../lib/transactionSchema";

type Phase = "details" | "review" | "authenticate" | "processing" | "success";

export function DepositPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, cachedUser, user, setUser } = useAuthedUser();

  const [phase, setPhase] = useState<Phase>("details");
  const [draft, setDraft] = useState<DepositDetailsValues | null>(null);
  const [transaction, setTransaction] = useState<TransactionSummary | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [repeatDefaults, setRepeatDefaults] = useState<Partial<DepositDetailsValues> | undefined>();

  useEffect(() => {
    const repeatId = searchParams.get("repeat");
    if (!repeatId || !token) return;
    getTransaction(token, repeatId)
      .then((tx) => {
        if (tx.type !== "deposit") return;
        setRepeatDefaults({ amount: tx.amount });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token || !cachedUser) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <p className="text-sm text-[#6B7280]">Loading…</p>
      </div>
    );
  }

  function handleAuthenticated(pin: string) {
    if (!draft || !token) return;
    setAuthError(null);
    setPhase("processing");

    Promise.all([submitDeposit(token, { amount: draft.amount, pin }), sleep(1400)])
      .then(([tx]) => {
        setTransaction(tx);
        setPhase("success");
        fetchMe(token)
          .then((fresh) => {
            setUser(fresh);
            localStorage.setItem("authUser", JSON.stringify(fresh));
          })
          .catch(() => {});
      })
      .catch((err) => {
        setAuthError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
        setPhase("authenticate");
      });
  }

  const reviewRows = draft
    ? [
        { label: "To", value: `Your account •••• ${user.account.accountNumber.slice(-4)}` },
        { label: "Amount", value: formatCurrency(draft.amount, user.account.currency) },
      ]
    : [];

  return (
    <TransactionFlowShell>
      {phase === "details" && (
        <DepositDetailsStep
          defaultValues={repeatDefaults}
          onContinue={(values) => {
            setDraft(values);
            setPhase("review");
          }}
        />
      )}

      {phase === "review" && (
        <ReviewStep
          title="Review deposit"
          rows={reviewRows}
          onBack={() => setPhase("details")}
          onConfirm={() => setPhase("authenticate")}
        />
      )}

      {phase === "authenticate" && (
        <AuthenticateStep
          token={token}
          hasPin={user.hasPin}
          errorMessage={authError}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {phase === "processing" && <ProcessingStep label="Processing your deposit…" />}

      {phase === "success" && transaction && (
        <SuccessStep
          message="Deposit successful"
          amountLabel={formatCurrency(transaction.amount, transaction.currency)}
          reference={transaction.reference}
          onViewReceipt={() => navigate(`/dashboard/transactions/${transaction.id}`)}
          onDone={() => navigate("/dashboard")}
        />
      )}
    </TransactionFlowShell>
  );
}
