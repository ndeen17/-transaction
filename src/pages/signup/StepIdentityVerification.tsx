import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { FileField } from "../../components/ui/FileField";
import { ID_TYPES, ID_TYPE_LABELS } from "../../lib/signupSchema";
import { StepShell } from "./StepShell";

const idTypeOptions = ID_TYPES.map((t) => ({ value: t, label: ID_TYPE_LABELS[t] }));

export function StepIdentityVerification() {
  return (
    <StepShell
      badge="Identity verification"
      title="Verify your identity"
      description="We're required to confirm your identity before opening your account (KYC). Your document is stored securely and only used for verification."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField name="kyc.idType" label="Government-issued ID type" options={idTypeOptions} />
        <TextField name="kyc.idNumber" label="ID number" autoComplete="off" />
        <div className="sm:col-span-2">
          <FileField name="kyc.idDocument" label="Upload a photo or scan of your ID" />
        </div>
      </div>
    </StepShell>
  );
}
