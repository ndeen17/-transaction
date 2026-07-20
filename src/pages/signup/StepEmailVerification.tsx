import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { OtpInput } from "../../components/ui/OtpInput";
import { ApiRequestError, resendOtp, verifyOtp, type VerifyOtpResult } from "../../lib/api";

interface StepEmailVerificationProps {
  userId: string;
  email: string;
  initialExpiresInSeconds: number;
  onVerified: (result: VerifyOtpResult) => void;
}

export function StepEmailVerification({
  userId,
  email,
  initialExpiresInSeconds,
  onVerified,
}: StepEmailVerificationProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify(fullCode: string) {
    setVerifying(true);
    setError(null);
    try {
      const result = await verifyOtp(userId, fullCode);
      onVerified(result);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong");
      setCode("");
    } finally {
      setVerifying(false);
    }
  }

  function handleChange(value: string) {
    setCode(value);
    setError(null);
    if (value.length === 6) {
      void handleVerify(value);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      await resendOtp(userId);
      setNotice("A new code is on its way.");
      setCooldown(60);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Badge>Email verification</Badge>
      </div>
      <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
        Check your email
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. Enter it
        below — it expires in about {Math.round(initialExpiresInSeconds / 60)} minutes.
      </p>

      <div className="mt-8">
        <OtpInput value={code} onChange={handleChange} disabled={verifying} />
      </div>

      {error && <p className="mt-4 text-sm text-[#F2555A]">{error}</p>}
      {notice && !error && <p className="mt-4 text-sm text-positive">{notice}</p>}

      <div className="mt-8 flex flex-col items-center gap-3">
        {verifying && <p className="text-sm text-muted">Verifying…</p>}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="text-sm font-medium text-blue-600 disabled:text-muted"
        >
          {resending
            ? "Sending…"
            : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
        </button>
      </div>

      {import.meta.env.DEV && (
        <p className="mt-6 text-xs text-muted">
          Dev tip: if <code>DEBUG_LOG_OTP=true</code> on the backend, the code is printed in the
          backend server console.
        </p>
      )}

      <div className="mt-8 flex justify-center">
        <Button type="button" onClick={() => handleVerify(code)} disabled={code.length !== 6 || verifying}>
          Verify
        </Button>
      </div>
    </div>
  );
}
