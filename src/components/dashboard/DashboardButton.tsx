import type { ButtonHTMLAttributes } from "react";
import { DASH_FOCUS_RING } from "./theme";

interface DashboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const VARIANT_CLASSES: Record<NonNullable<DashboardButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60",
  secondary:
    "border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC] active:scale-[0.98]",
};

export function DashboardButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: DashboardButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out ${DASH_FOCUS_RING} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
