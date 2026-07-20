import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import {
  EMPLOYMENT_STATUSES,
  EMPLOYMENT_STATUS_LABELS,
  INCOME_RANGES,
  INCOME_RANGE_LABELS,
  INDUSTRIES,
} from "../../lib/signupSchema";
import { StepShell } from "./StepShell";

const statusOptions = EMPLOYMENT_STATUSES.map((s) => ({ value: s, label: EMPLOYMENT_STATUS_LABELS[s] }));
const incomeOptions = INCOME_RANGES.map((r) => ({ value: r, label: INCOME_RANGE_LABELS[r] }));
const industryOptions = INDUSTRIES.map((i) => ({ value: i, label: i }));

export function StepEmploymentFinancial() {
  return (
    <StepShell
      badge="Employment & finances"
      title="Employment & financial information"
      description="This helps us tailor your account and meet regulatory requirements."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField name="employment.status" label="Employment status" options={statusOptions} />
        <TextField name="employment.occupation" label="Occupation" optional />
        <SelectField name="employment.industry" label="Industry" options={industryOptions} optional />
        <SelectField
          name="employment.annualIncomeRange"
          label="Annual income range"
          options={incomeOptions}
        />
      </div>
    </StepShell>
  );
}
