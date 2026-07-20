import { CheckboxField } from "../../components/ui/CheckboxField";
import { StepShell } from "./StepShell";

export function StepConsent() {
  return (
    <StepShell
      badge="Agreements"
      title="Agreements & consent"
      description="Please review and agree to the following before we create your account."
    >
      <div className="space-y-3">
        <CheckboxField
          name="consents.termsAccepted"
          label={
            <>
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noreferrer" className="font-medium text-blue-600 underline">
                Terms and Conditions
              </a>
            </>
          }
        />
        <CheckboxField
          name="consents.privacyPolicyAccepted"
          label={
            <>
              I agree to the{" "}
              <a href="/privacy" target="_blank" rel="noreferrer" className="font-medium text-blue-600 underline">
                Privacy Policy
              </a>
            </>
          }
        />
        <CheckboxField
          name="consents.electronicCommsConsent"
          label="I consent to receive account communications electronically (email and SMS)."
        />
        <CheckboxField
          name="consents.dataProcessingConsent"
          label="I consent to my personal data being processed to open and manage this account."
        />
        <CheckboxField
          name="consents.amlDeclaration"
          label="I declare that the funds used for this account are from lawful sources, in accordance with anti-money laundering (AML) regulations."
        />
      </div>
    </StepShell>
  );
}
