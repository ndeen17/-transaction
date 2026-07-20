import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-badge-bg px-3.5 py-1.5 text-xs font-medium text-badge-text">
      {children}
    </span>
  );
}
