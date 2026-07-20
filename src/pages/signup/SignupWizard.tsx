import { useState } from "react";
import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/Button";
import { ProgressSteps } from "../../components/ui/ProgressSteps";
import { WizardPanel } from "../../components/ui/WizardPanel";
import { Logo } from "../../components/Logo";
import {
  STEP_FIELDS,
  defaultSignupValues,
  signupFormSchema,
  type SignupFormValues,
} from "../../lib/signupSchema";
import { ApiRequestError, submitSignup, type SubmitSignupResult, type VerifyOtpResult } from "../../lib/api";
import { StepAccountType } from "./StepAccountType";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepContactInfo } from "./StepContactInfo";
import { StepIdentityVerification } from "./StepIdentityVerification";
import { StepEmploymentFinancial } from "./StepEmploymentFinancial";
import { StepCreateLogin } from "./StepCreateLogin";
import { StepReview } from "./StepReview";
import { StepConsent } from "./StepConsent";
import { StepEmailVerification } from "./StepEmailVerification";
import { StepAccountVerification } from "./StepAccountVerification";
import { StepSuccess } from "./StepSuccess";

const FORM_STEPS = [
  { key: "accountType" as const, label: "Account type", Component: StepAccountType },
  { key: "personal" as const, label: "Personal info", Component: StepPersonalInfo },
  { key: "contact" as const, label: "Contact info", Component: StepContactInfo },
  { key: "kyc" as const, label: "Identity verification", Component: StepIdentityVerification },
  { key: "employment" as const, label: "Employment", Component: StepEmploymentFinancial },
  { key: "auth" as const, label: "Create login", Component: StepCreateLogin },
  { key: null, label: "Review", Component: null },
  { key: "consents" as const, label: "Consent", Component: StepConsent },
];

type Phase = "form" | "otp" | "verification" | "success";

export function SignupWizard() {
  const [phase, setPhase] = useState<Phase>("form");
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupResult, setSignupResult] = useState<SubmitSignupResult | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyOtpResult | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: defaultSignupValues,
    mode: "onBlur",
  });

  async function handleNext() {
    const stepKey = FORM_STEPS[step]?.key;
    if (stepKey) {
      const valid = await form.trigger(STEP_FIELDS[stepKey]);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onCreateAccount(values: SignupFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitSignup(values);
      setSignupResult(result);
      setPhase("otp");
    } catch (err) {
      setSubmitError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleVerified(result: VerifyOtpResult) {
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("authUser", JSON.stringify(result.user));
    setVerifyResult(result);
    setPhase("verification");
  }

  const ActiveStep = FORM_STEPS[step]?.Component ?? null;
  const isReviewStep = FORM_STEPS[step]?.key === null;
  const isLastFormStep = step === FORM_STEPS.length - 1;

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <Link to="/">
          <Logo />
        </Link>
        {phase === "form" && (
          <Link to="/" className="text-sm text-muted hover:text-ink">
            Cancel
          </Link>
        )}
      </div>

      <WizardPanel>
        {phase === "form" && (
          <FormProvider {...form}>
            <ProgressSteps current={step + 1} total={FORM_STEPS.length} label={FORM_STEPS[step]?.label ?? ""} />

            {isReviewStep || !ActiveStep ? <StepReview onEdit={setStep} /> : <ActiveStep />}

            {submitError && (
              <p className="mt-4 rounded-xl bg-[#FDEEEE] px-4 py-3 text-sm text-[#F2555A]">{submitError}</p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-[#EEF1F5] pt-6">
              {step > 0 ? (
                <Button type="button" variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <span />
              )}

              {isLastFormStep ? (
                <Button
                  type="button"
                  withArrow
                  loading={submitting}
                  onClick={form.handleSubmit(onCreateAccount)}
                >
                  Create Account
                </Button>
              ) : (
                <Button type="button" withArrow onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </FormProvider>
        )}

        {phase === "otp" && signupResult && (
          <StepEmailVerification
            userId={signupResult.userId}
            email={form.getValues("contact.email")}
            initialExpiresInSeconds={signupResult.otpExpiresInSeconds}
            onVerified={handleVerified}
          />
        )}

        {phase === "verification" && (
          <StepAccountVerification onContinue={() => setPhase("success")} />
        )}

        {phase === "success" && verifyResult && (
          <StepSuccess firstName={verifyResult.user.firstName} loginId={verifyResult.user.loginId} />
        )}
      </WizardPanel>
    </div>
  );
}
