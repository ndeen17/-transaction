import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TransactionFlowShell } from "../../components/transactions/TransactionFlowShell";
import { CryptoDetailsStep } from "../../components/transactions/CryptoDetailsStep";
import { ReviewStep } from "../../components/transactions/ReviewStep";
import { AuthenticateStep } from "../../components/transactions/AuthenticateStep";
import { ProcessingStep } from "../../components/transactions/ProcessingStep";
import { PendingStep } from "../../components/transactions/PendingStep";
import { sleep } from "../../lib/async";
import { useAuthedUser } from "../../lib/useAuthedUser";
import {
  ApiRequestError,
  submitCryptoDeposit,
  type CryptoAsset,
  type CryptoDepositSummary,
} from "../../lib/api";
import type { CryptoDepositDetailsValues } from "../../lib/transactionSchema";

type Phase = "details" | "review" | "authenticate" | "processing" | "pending";

export function CryptoDepositPage() {
  const navigate = useNavigate();
  const { token, cachedUser, user } = useAuthedUser();

  const [phase, setPhase] = useState<Phase>("details");
  const [draft, setDraft] = useState<CryptoDepositDetailsValues | null>(null);
  const [asset, setAsset] = useState<CryptoAsset | null>(null);
  const [request, setRequest] = useState<CryptoDepositSummary | null>(null);
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
      submitCryptoDeposit(token, {
        assetId: asset.id,
        amountCrypto: draft.amountCrypto,
        txHash: draft.txHash || undefined,
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
    draft && asset
      ? [
          { label: "Currency", value: `${asset.symbol} — ${asset.name}` },
          ...(asset.network ? [{ label: "Network", value: asset.network }] : []),
          { label: "Address", value: asset.address },
          { label: "Amount sent", value: `${draft.amountCrypto} ${asset.symbol}` },
          ...(draft.txHash ? [{ label: "Transaction hash", value: draft.txHash }] : []),
        ]
      : [];

  return (
    <TransactionFlowShell>
      {phase === "details" && (
        <CryptoDetailsStep
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
          onViewStatus={() => navigate(`/dashboard/crypto-deposits/${request.id}`)}
          onDone={() => navigate("/dashboard")}
        />
      )}
    </TransactionFlowShell>
  );
}
