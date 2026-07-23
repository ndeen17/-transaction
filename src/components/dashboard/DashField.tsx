import type { ReactNode } from "react";

interface DashFieldProps {
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}

export function DashField({ label, optional, error, children }: DashFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-[#111827]">
        {label}
        {optional && <span className="text-xs font-normal text-[#6B7280]">Optional</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-[#DC2626]">{error}</span>}
    </label>
  );
}
