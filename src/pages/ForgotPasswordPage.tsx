import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { OtpInput } from "../components/ui/OtpInput";
import { WizardPanel } from "../components/ui/WizardPanel";
import { Logo } from "../components/Logo";
import { ApiRequestError, confirmPasswordReset, requestPasswordReset } from "../lib/api";

type Phase = "request" | "reset";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("request");

  const [loginId, setLoginId] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    setRequesting(true);
    setRequestError(null);
    try {
      await requestPasswordReset(loginId.trim());
      setPhase("reset");
      setCooldown(60);
    } catch (err) {
      setRequestError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setRequesting(false);
    }
  }

  async function handleResend() {
    setResetError(null);
    setNotice(null);
    try {
      await requestPasswordReset(loginId.trim());
      setNotice("If an account exists, a new code is on its way.");
      setCooldown(60);
    } catch (err) {
      setResetError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setResetting(true);
    setResetError(null);
    try {
      const result = await confirmPasswordReset({
        loginId: loginId.trim(),
        code,
        newPassword,
        confirmNewPassword,
      });
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      navigate("/dashboard");
    } catch (err) {
      setResetError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <Link to="/">
          <Logo />
        </Link>
        <Link to="/login" className="text-sm text-muted hover:text-ink">
          Back to login
        </Link>
      </div>

      <WizardPanel>
        {phase === "request" && (
          <>
            <div className="flex justify-center">
              <Badge>Forgot password</Badge>
            </div>
            <h1 className="mt-4 text-center text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
              Reset your password
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-muted">
              Enter your login ID and we'll email a reset code to the address on file.
            </p>

            <form onSubmit={handleRequest} className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Login ID</span>
                <input
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500"
                />
              </label>

              {requestError && (
                <p className="rounded-xl bg-[#FDEEEE] px-4 py-3 text-sm text-[#F2555A]">{requestError}</p>
              )}

              <Button type="submit" loading={requesting} className="w-full justify-center" withArrow>
                Send reset code
              </Button>
            </form>
          </>
        )}

        {phase === "reset" && (
          <>
            <div className="flex justify-center">
              <Badge>Check your email</Badge>
            </div>
            <h1 className="mt-4 text-center text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
              Enter your reset code
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-muted">
              If an account exists for <span className="font-medium text-ink">{loginId}</span>, a 6-digit
              code was sent to the email on file. Enter it below with your new password.
            </p>

            <form onSubmit={handleReset} className="mt-7 space-y-5">
              <div className="flex justify-center">
                <OtpInput value={code} onChange={setCode} disabled={resetting} />
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Confirm new password</span>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500"
                />
              </label>
              <p className="text-xs text-muted">At least 8 characters, with a mix of letters and numbers.</p>

              {resetError && <p className="rounded-xl bg-[#FDEEEE] px-4 py-3 text-sm text-[#F2555A]">{resetError}</p>}
              {notice && !resetError && <p className="text-sm text-positive">{notice}</p>}

              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="text-sm font-medium text-blue-600 disabled:text-muted"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>

              <Button
                type="submit"
                loading={resetting}
                disabled={code.length !== 6}
                className="w-full justify-center"
                withArrow
              >
                Reset password
              </Button>
            </form>
          </>
        )}
      </WizardPanel>
    </div>
  );
}
