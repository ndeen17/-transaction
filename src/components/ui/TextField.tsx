import type { InputHTMLAttributes } from "react";
import { useFormContext, type Path } from "react-hook-form";
import type { SignupFormValues } from "../../lib/signupSchema";
import { getFieldError } from "./fieldError";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: Path<SignupFormValues>;
  label: string;
  optional?: boolean;
}

export function TextField({ name, label, optional, className = "", ...props }: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const error = getFieldError(errors, name);

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </span>
      <input
        {...register(name)}
        {...props}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500 ${
          error ? "border-[#F2555A]" : "border-[#EEF1F5]"
        } ${className}`}
      />
      {error && <span className="mt-1.5 block text-xs text-[#F2555A]">{error}</span>}
    </label>
  );
}
