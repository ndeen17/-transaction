import type { SelectHTMLAttributes } from "react";
import { useFormContext, type Path } from "react-hook-form";
import type { SignupFormValues } from "../../lib/signupSchema";
import { getFieldError } from "./fieldError";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  name: Path<SignupFormValues>;
  label: string;
  options: Option[];
  placeholder?: string;
  optional?: boolean;
}

export function SelectField({
  name,
  label,
  options,
  placeholder = "Select…",
  optional,
  className = "",
  ...props
}: SelectFieldProps) {
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
      <select
        {...register(name)}
        {...props}
        defaultValue=""
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-blue-500 ${
          error ? "border-[#F2555A]" : "border-[#EEF1F5]"
        } ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1.5 block text-xs text-[#F2555A]">{error}</span>}
    </label>
  );
}
