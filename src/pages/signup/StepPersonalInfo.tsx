import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { COUNTRIES } from "../../lib/countries";
import { GENDER_LABELS, GENDERS, MARITAL_STATUSES, MARITAL_STATUS_LABELS } from "../../lib/signupSchema";
import { StepShell } from "./StepShell";

const genderOptions = GENDERS.map((g) => ({ value: g, label: GENDER_LABELS[g] }));
const maritalOptions = MARITAL_STATUSES.map((m) => ({ value: m, label: MARITAL_STATUS_LABELS[m] }));
const nationalityOptions = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

export function StepPersonalInfo() {
  return (
    <StepShell badge="About you" title="Personal information" description="Tell us a bit about yourself.">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField name="personal.firstName" label="First name" autoComplete="given-name" />
        <TextField name="personal.middleName" label="Middle name" optional autoComplete="additional-name" />
        <TextField name="personal.lastName" label="Last name" autoComplete="family-name" />
        <TextField name="personal.dateOfBirth" label="Date of birth" type="date" autoComplete="bday" />
        <SelectField name="personal.gender" label="Gender" options={genderOptions} />
        <SelectField name="personal.nationality" label="Nationality" options={nationalityOptions} />
        <SelectField
          name="personal.maritalStatus"
          label="Marital status"
          options={maritalOptions}
          optional
        />
      </div>
    </StepShell>
  );
}
