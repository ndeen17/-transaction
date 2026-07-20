import type { ReactNode } from "react";
import { useFormContext, type Path } from "react-hook-form";
import type { SignupFormValues } from "../../lib/signupSchema";
import { getFieldError } from "./fieldError";

interface CheckboxFieldProps {
  name: Path<SignupFormValues>;
  label: ReactNode;
}

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const error = getFieldError(errors, name);

  return (
    <label className="flex items-start gap-3 rounded-2xl border border-[#EEF1F5] bg-white p-4">
      <input
        type="checkbox"
        {...register(name)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D6DBE3] text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm leading-relaxed text-ink">
        {label}
        {error && <span className="mt-1 block text-xs text-[#F2555A]">{error}</span>}
      </span>
    </label>
  );
}
