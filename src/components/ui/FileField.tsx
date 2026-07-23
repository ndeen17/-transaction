import { useFormContext, type Path } from "react-hook-form";
import type { SignupFormValues } from "../../lib/signupSchema";
import { getFieldError } from "./fieldError";

interface FileFieldProps {
  name: Path<SignupFormValues>;
  label: string;
  accept?: string;
}

export function FileField({
  name,
  label,
  accept = ".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf",
}: FileFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const error = getFieldError(errors, name);
  const file = watch(name) as File | undefined;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    setValue(name, selected as never, { shouldValidate: true });
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div
        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-white px-4 py-8 text-center transition-colors ${
          error ? "border-[#F2555A]" : "border-[#D6DBE3]"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-muted" fill="none">
          <path
            d="M12 15V4m0 0 4 4m-4-4-4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {file ? (
          <span className="text-sm font-medium text-ink">{file.name}</span>
        ) : (
          <span className="text-sm text-muted">JPG, PNG, WEBP, HEIC, or PDF — up to 5MB</span>
        )}
        <span className="mt-1 inline-flex items-center rounded-full bg-[#F6F8FB] px-4 py-2 text-xs font-medium text-ink">
          {file ? "Choose a different file" : "Choose file"}
        </span>
        {/*
          Deliberately NOT using react-hook-form's register()/ref here. RHF special-cases
          type="file" inputs to read the live DOM `.files` on every trigger()/validate call,
          which silently overrides whatever we set via setValue() below — that's what caused
          "Upload your ID document" to fire even after a file was visibly selected (the DOM's
          own .files had reverted to empty by the time Next was clicked). Driving this purely
          through onChange + setValue/watch keeps one source of truth.
        */}
        <input
          type="file"
          accept={accept}
          name={name}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      {error && <span className="mt-1.5 block text-xs text-[#F2555A]">{error}</span>}
    </label>
  );
}
