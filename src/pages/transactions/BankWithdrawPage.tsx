import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TransactionFlowShell } from "../../components/transactions/TransactionFlowShell";
import { BankWithdrawDetailsStep } from "../../components/transactions/BankWithdrawDetailsStep";
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
  submitBankWithdrawal,
  type BankWithdrawalSummary,
  type TransactionSummary,
} from "../../lib/api";
import type { BankWithdrawDetailsValues } from "../../lib/transactionSchema";

type Phase = "details" | "review" | "authenticate" | "processing" | "success";

export function BankWithdrawPage() {
  const navigate = useNavigate();
  const { token, cachedUser, user, setUser } = useAuthedUser();

  const [phase, setPhase] = useState<Phase>("details");
  const [draft, setDraft] = useState<BankWithdrawDetailsValues | null>(null);
  const [request, setRequest] = useState<BankWithdrawalSummary | null>(null);
  const [transaction, setTransaction] = useState<TransactionSummary | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

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

    Promise.all([
      submitBankWithdrawal(token, {
        amount: draft.amount,
        bankName: draft.bankName,
        accountName: draft.accountName,
        accountNumber: draft.accountNumber,
        routingNumber: draft.routingNumber || undefined,
        pin,
      }),
      sleep(1400),
    ])
      .then(([result]) => {
        setRequest(result.request);
        setTransaction(result.transaction);
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
        { label: "Bank", value: draft.bankName },
        { label: "Account name", value: draft.accountName },
        { label: "Account number", value: draft.accountNumber },
        ...(draft.routingNumber ? [{ label: "Routing number", value: draft.routingNumber }] : []),
        { label: "Amount", value: formatCurrency(draft.amount, user.account.currency) },
      ]
    : [];

  return (
    <TransactionFlowShell>
      {phase === "details" && (
        <BankWithdrawDetailsStep
          onContinue={(values) => {
            setDraft(values);
            setPhase("review");
          }}
        />
      )}

      {phase === "review" && (
        <ReviewStep
          title="Review withdrawal"
          rows={reviewRows}
          onBack={() => setPhase("details")}
          onConfirm={() => setPhase("authenticate")}
          confirmLabel="Withdraw"
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

      {phase === "processing" && <ProcessingStep label="Processing your withdrawal…" />}

      {phase === "success" && request && transaction && (
        <SuccessStep
          message="Withdrawal processing"
          amountLabel={formatCurrency(transaction.amount, transaction.currency)}
          reference={transaction.reference}
          onViewReceipt={() => navigate(`/dashboard/bank-withdrawals/${request.id}`)}
          onDone={() => navigate("/dashboard")}
        />
      )}
    </TransactionFlowShell>
  );
}
