import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TransactionFlowShell } from "../../components/transactions/TransactionFlowShell";
import { CryptoWithdrawDetailsStep } from "../../components/transactions/CryptoWithdrawDetailsStep";
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
  submitCryptoWithdrawal,
  type CryptoAsset,
  type CryptoWithdrawalSummary,
  type TransactionSummary,
} from "../../lib/api";
import type { CryptoWithdrawDetailsValues } from "../../lib/transactionSchema";

type Phase = "details" | "review" | "authenticate" | "processing" | "success";

export function CryptoWithdrawPage() {
  const navigate = useNavigate();
  const { token, cachedUser, user, setUser } = useAuthedUser();

  const [phase, setPhase] = useState<Phase>("details");
  const [draft, setDraft] = useState<CryptoWithdrawDetailsValues | null>(null);
  const [asset, setAsset] = useState<CryptoAsset | null>(null);
  const [request, setRequest] = useState<CryptoWithdrawalSummary | null>(null);
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
    if (!draft || !asset || !token) return;
    setAuthError(null);
    setPhase("processing");

    Promise.all([
      submitCryptoWithdrawal(token, {
        assetId: asset.id,
        amountCrypto: draft.amountCrypto,
        walletAddress: draft.walletAddress,
        network: draft.network || undefined,
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

  const reviewRows =
    draft && asset
      ? [
          { label: "Currency", value: `${asset.symbol} — ${asset.name}` },
          { label: "Amount", value: `${draft.amountCrypto} ${asset.symbol}` },
          { label: "Wallet address", value: draft.walletAddress },
          ...(draft.network ? [{ label: "Network", value: draft.network }] : []),
        ]
      : [];

  return (
    <TransactionFlowShell>
      {phase === "details" && (
        <CryptoWithdrawDetailsStep
          token={token}
          onContinue={(values, selectedAsset) => {
            setDraft(values);
            setAsset(selectedAsset);
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
          onViewReceipt={() => navigate(`/dashboard/crypto-withdrawals/${request.id}`)}
          onDone={() => navigate("/dashboard")}
        />
      )}
    </TransactionFlowShell>
  );
}
