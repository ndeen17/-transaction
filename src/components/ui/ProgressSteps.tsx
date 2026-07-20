interface ProgressStepsProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressSteps({ current, total, label }: ProgressStepsProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="mb-2.5 flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Step {current} of {total}
        </span>
        <span className="text-ink">{label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F5]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
