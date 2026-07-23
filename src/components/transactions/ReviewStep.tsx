import { DashboardButton } from "../dashboard/DashboardButton";

interface ReviewRow {
  label: string;
  value: string;
}

interface ReviewStepProps {
  title: string;
  rows: ReviewRow[];
  onBack: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

export function ReviewStep({ title, rows, onBack, onConfirm, confirmLabel = "Confirm & continue" }: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
      <p className="mt-1 text-sm text-[#6B7280]">Double-check the details before you continue.</p>

      <dl className="mt-6 divide-y divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <dt className="text-sm text-[#6B7280]">{row.label}</dt>
            <dd className="text-right text-sm font-medium text-[#111827]">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex items-center justify-between gap-3">
        <DashboardButton type="button" variant="secondary" onClick={onBack} className="flex-1 justify-center">
          Back
        </DashboardButton>
        <DashboardButton type="button" onClick={onConfirm} className="flex-1 justify-center">
          {confirmLabel}
        </DashboardButton>
      </div>
    </div>
  );
}
