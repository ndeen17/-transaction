import type { ReactNode } from "react";
import { PANEL } from "../../lib/theme";

export function WizardPanel({ children }: { children: ReactNode }) {
  return <div className={`${PANEL} p-5 sm:p-8 lg:p-10`}>{children}</div>;
}
