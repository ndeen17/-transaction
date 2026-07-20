import { useFormContext } from "react-hook-form";
import type { SignupFormValues } from "../../lib/signupSchema";
import { StepShell } from "./StepShell";

const OPTIONS = [
  {
    value: "savings" as const,
    title: "Savings Account",
    description: "Earn interest on your balance while keeping easy access to your money.",
  },
  {
    value: "current" as const,
    title: "Current / Checking Account",
    description: "Built for everyday spending, transfers, and bill payments.",
  },
];

export function StepAccountType() {
  const { watch, setValue, formState } = useFormContext<SignupFormValues>();
  const selected = watch("accountType");
  const error = formState.errors.accountType?.message;

  return (
    <StepShell badge="Get started" title="Choose an account type" description="You can open a second account later.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue("accountType", opt.value, { shouldValidate: true })}
            className={`rounded-2xl border p-6 text-left transition-colors ${
              selected === opt.value
                ? "border-blue-600 bg-badge-bg"
                : "border-[#EEF1F5] bg-white hover:border-[#D6DBE3]"
            }`}
          >
            <span
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
                selected === opt.value ? "bg-blue-600 text-white" : "bg-[#F6F8FB] text-muted"
              }`}
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                <path
                  d="M3 8.5 10 3l7 5.5M4.5 8v7.5A1.5 1.5 0 0 0 6 17h8a1.5 1.5 0 0 0 1.5-1.5V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-base font-semibold text-ink">{opt.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{opt.description}</p>
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-xs text-[#F2555A]">{error}</p>}
    </StepShell>
  );
}
