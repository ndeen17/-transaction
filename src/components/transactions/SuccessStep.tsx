import { CheckCircleIcon } from "../dashboard/icons";
import { DashboardButton } from "../dashboard/DashboardButton";

interface SuccessStepProps {
  message: string;
  amountLabel: string;
  reference: string;
  onViewReceipt: () => void;
  onDone: () => void;
}

export function SuccessStep({ message, amountLabel, reference, onViewReceipt, onDone }: SuccessStepProps) {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A]">
          <CheckCircleIcon className="h-8 w-8" />
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold text-[#111827]">{message}</h2>
      <p className="mt-2 text-2xl font-bold tabular-nums text-[#111827]">{amountLabel}</p>
      <p className="mt-1 font-mono text-xs text-[#6B7280]">Ref: {reference}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <DashboardButton variant="secondary" onClick={onViewReceipt} className="flex-1 justify-center">
          View receipt
        </DashboardButton>
        <DashboardButton onClick={onDone} className="flex-1 justify-center">
          Back to dashboard
        </DashboardButton>
      </div>
    </div>
  );
}
