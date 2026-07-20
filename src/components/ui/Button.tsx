import type { ButtonHTMLAttributes } from "react";
import { ArrowRightIcon } from "../icons";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  withArrow?: boolean;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 disabled:opacity-60",
  secondary: "border border-[#EEF1F5] bg-white text-ink hover:bg-[#F6F8FB]",
  ghost: "text-muted hover:text-ink",
};

export function Button({
  variant = "primary",
  withArrow = false,
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full py-3 pl-6 pr-3 text-sm font-medium transition-colors ${
        !withArrow ? "px-6" : ""
      } ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait…" : children}
      {withArrow && !loading && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
