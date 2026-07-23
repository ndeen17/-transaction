import { useFormContext } from "react-hook-form";
import {
  ACCOUNT_TYPE_LABELS,
  GENDER_LABELS,
  ID_TYPE_LABELS,
  MARITAL_STATUS_LABELS,
  type SignupFormValues,
} from "../../lib/signupSchema";
import { COUNTRIES } from "../../lib/countries";
import { StepShell } from "./StepShell";

function countryName(code?: string) {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code ?? "—";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

interface Row {
  label: string;
  value: string;
}

function Section({
  title,
  step,
  rows,
  onEdit,
}: {
  title: string;
  step: number;
  rows: Row[];
  onEdit: (step: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#EEF1F5] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Edit
        </button>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs text-muted">{row.label}</dt>
            <dd className="mt-0.5 text-sm text-ink">{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { getValues } = useFormContext<SignupFormValues>();
  const v = getValues();

  return (
    <StepShell
      badge="Review"
      title="Review your information"
      description="Make sure everything looks right before you continue. You can edit any section."
    >
      <div className="space-y-4">
        <Section
          title="Account type"
          step={0}
          onEdit={onEdit}
          rows={[{ label: "Account type", value: v.accountType ? ACCOUNT_TYPE_LABELS[v.accountType] : "—" }]}
        />

        <Section
          title="Personal information"
          step={1}
          onEdit={onEdit}
          rows={[
            {
              label: "Full name",
              value: [v.personal?.firstName, v.personal?.middleName, v.personal?.lastName]
                .filter(Boolean)
                .join(" "),
            },
            { label: "Date of birth", value: formatDate(v.personal?.dateOfBirth) },
            { label: "Gender", value: v.personal?.gender ? GENDER_LABELS[v.personal.gender] : "—" },
            { label: "Nationality", value: countryName(v.personal?.nationality) },
            {
              label: "Marital status",
              value: v.personal?.maritalStatus ? MARITAL_STATUS_LABELS[v.personal.maritalStatus] : "—",
            },
          ]}
        />

        <Section
          title="Contact information"
          step={2}
          onEdit={onEdit}
          rows={[
            { label: "Email", value: v.contact?.email ?? "—" },
            { label: "Phone", value: v.contact?.phone ?? "—" },
            {
              label: "Address",
              value: [
                v.contact?.address?.line1,
                v.contact?.address?.city,
                v.contact?.address?.state,
                v.contact?.address?.postalCode,
              ]
                .filter(Boolean)
                .join(", "),
            },
            { label: "Country", value: countryName(v.contact?.address?.country) },
          ]}
        />

        <Section
          title="Identity verification"
          step={3}
          onEdit={onEdit}
          rows={[
            { label: "ID type", value: v.kyc?.idType ? ID_TYPE_LABELS[v.kyc.idType] : "—" },
            { label: "ID number", value: v.kyc?.idNumber ?? "—" },
            { label: "Document", value: v.kyc?.idDocument?.name ?? "—" },
          ]}
        />

        <Section
          title="Login"
          step={4}
          onEdit={onEdit}
          rows={[{ label: "Login ID", value: v.auth?.loginId ?? "—" }]}
        />
      </div>
    </StepShell>
  );
}
