import { useState, type InputHTMLAttributes } from "react";
import { useFormContext, type Path } from "react-hook-form";
import type { SignupFormValues } from "../../lib/signupSchema";
import { EyeIcon, EyeOffIcon } from "../icons";
import { getFieldError } from "./fieldError";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: Path<SignupFormValues>;
  label: string;
  optional?: boolean;
}

export function TextField({ name, label, optional, type, className = "", ...props }: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const [visible, setVisible] = useState(false);

  const error = getFieldError(errors, name);
  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </span>
      <div className="relative">
        <input
          {...register(name)}
          {...props}
          type={isPassword ? (visible ? "text" : "password") : type}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500 ${
            isPassword ? "pr-11" : ""
          } ${error ? "border-[#F2555A]" : "border-[#EEF1F5]"} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
          >
            {visible ? <EyeOffIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
          </button>
        )}
      </div>
      {error && <span className="mt-1.5 block text-xs text-[#F2555A]">{error}</span>}
    </label>
  );
}
