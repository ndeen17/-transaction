import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TransactionFlowShell } from "../../components/transactions/TransactionFlowShell";
import { BankDetailsStep } from "../../components/transactions/BankDetailsStep";
import { ReviewStep } from "../../components/transactions/ReviewStep";
import { AuthenticateStep } from "../../components/transactions/AuthenticateStep";
import { ProcessingStep } from "../../components/transactions/ProcessingStep";
import { PendingStep } from "../../components/transactions/PendingStep";
import { sleep } from "../../lib/async";
import { formatCurrency } from "../../lib/format";
import { useAuthedUser } from "../../lib/useAuthedUser";
import {
  ApiRequestError,
  submitBankDeposit,
  type BankAccount,
  type BankDepositSummary,
} from "../../lib/api";
import type { BankDepositDetailsValues } from "../../lib/transactionSchema";

type Phase = "details" | "review" | "authenticate" | "processing" | "pending";

export function BankDepositPage() {
  const navigate = useNavigate();
  const { token, cachedUser, user } = useAuthedUser();

  const [phase, setPhase] = useState<Phase>("details");
  const [draft, setDraft] = useState<BankDepositDetailsValues | null>(null);
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [request, setRequest] = useState<BankDepositSummary | null>(null);
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
    if (!draft || !account || !token) return;
    setAuthError(null);
    setPhase("processing");

    Promise.all([
      submitBankDeposit(token, {
        bankAccountId: account.id,
        amount: draft.amount,
        senderReference: draft.senderReference || undefined,
        pin,
      }),
      sleep(1400),
    ])
      .then(([created]) => {
        setRequest(created);
        setPhase("pending");
      })
      .catch((err) => {
        setAuthError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
        setPhase("authenticate");
      });
  }

  const reviewRows =
    draft && account
      ? [
          { label: "Bank", value: account.bankName },
          { label: "Account name", value: account.accountName },
          { label: "Account number", value: account.accountNumber },
          { label: "Amount", value: formatCurrency(draft.amount, user.account.currency) },
          ...(draft.senderReference ? [{ label: "Transfer reference", value: draft.senderReference }] : []),
        ]
      : [];

  return (
    <TransactionFlowShell>
      {phase === "details" && (
        <BankDetailsStep
          token={token}
          onContinue={(values, selectedAccount) => {
            setDraft(values);
            setAccount(selectedAccount);
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
          confirmLabel="Submit deposit"
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

      {phase === "processing" && <ProcessingStep label="Submitting your deposit request…" />}

      {phase === "pending" && request && (
        <PendingStep
          title="Deposit request submitted"
          message="We're reviewing your deposit. We'll notify you here once it's processed — this usually takes a few minutes."
          reference={request.reference}
          onViewStatus={() => navigate(`/dashboard/bank-deposits/${request.id}`)}
          onDone={() => navigate("/dashboard")}
        />
      )}
    </TransactionFlowShell>
  );
}
