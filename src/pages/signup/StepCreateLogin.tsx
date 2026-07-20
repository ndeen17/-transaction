import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextField } from "../../components/ui/TextField";
import type { SignupFormValues } from "../../lib/signupSchema";
import { previewLoginId } from "../../lib/api";
import { StepShell } from "./StepShell";

export function StepCreateLogin() {
  const { watch, setValue, getValues } = useFormContext<SignupFormValues>();
  const [loading, setLoading] = useState(false);
  const loginId = watch("auth.loginId");

  useEffect(() => {
    if (loginId) return;
    const { firstName, lastName } = getValues("personal");
    if (!firstName || !lastName) return;

    let cancelled = false;
    setLoading(true);
    previewLoginId(firstName, lastName)
      .then((res) => {
        if (!cancelled) setValue("auth.loginId", res.loginId);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepShell
      badge="Almost there"
      title="Create your login"
      description="We've generated a login ID for you. Set a password to secure your account."
    >
      <div className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Login ID</span>
          <div className="flex items-center justify-between rounded-2xl border border-[#EEF1F5] bg-[#F6F8FB] px-4 py-3">
            <span className="text-sm font-medium text-ink">
              {loading ? "Generating…" : loginId || "—"}
            </span>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-muted">
              Auto-generated
            </span>
          </div>
        </label>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            name="auth.password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <TextField
            name="auth.confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <p className="text-xs text-muted">
          At least 8 characters, with a mix of letters and numbers.
        </p>
      </div>
    </StepShell>
  );
}
