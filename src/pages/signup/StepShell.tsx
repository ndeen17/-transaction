import type { ReactNode } from "react";
import { Badge } from "../../components/ui/Badge";

interface StepShellProps {
  badge: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function StepShell({ badge, title, description, children }: StepShellProps) {
  return (
    <div>
      <Badge>{badge}</Badge>
      <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">{title}</h1>
      {description && <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}
