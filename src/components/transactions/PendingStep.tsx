import { ClockIcon } from "../dashboard/icons";
import { DashboardButton } from "../dashboard/DashboardButton";

interface PendingStepProps {
  title: string;
  message: string;
  reference: string;
  onViewStatus: () => void;
  onDone: () => void;
}

export function PendingStep({ title, message, reference, onViewStatus, onDone }: PendingStepProps) {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFBEB] text-[#B45309]">
          <ClockIcon className="h-8 w-8" />
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold text-[#111827]">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6B7280]">{message}</p>
      <p className="mt-3 font-mono text-xs text-[#6B7280]">Ref: {reference}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <DashboardButton variant="secondary" onClick={onViewStatus} className="flex-1 justify-center">
          View status
        </DashboardButton>
        <DashboardButton onClick={onDone} className="flex-1 justify-center">
          Back to dashboard
        </DashboardButton>
      </div>
    </div>
  );
}
