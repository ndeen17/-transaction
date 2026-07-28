import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField } from "../dashboard/DashField";
import { dashInputClass } from "../dashboard/inputStyles";
import { DashboardButton } from "../dashboard/DashboardButton";
import { PinInput } from "../dashboard/PinInput";
import { EyeIcon, EyeOffIcon, LockIcon } from "../dashboard/icons";
import { ApiRequestError, resetPin, setupPin } from "../../lib/api";
import {
  pinEntrySchema,
  pinSetupSchema,
  type PinEntryValues,
  type PinSetupValues,
} from "../../lib/transactionSchema";

interface AuthenticateStepProps {
  token: string;
  hasPin: boolean;
  errorMessage?: string | null;
  onAuthenticated: (pin: string) => void;
}

export function AuthenticateStep({ token, hasPin, errorMessage, onAuthenticated }: AuthenticateStepProps) {
  const [mode, setMode] = useState<"enter" | "reset">("enter");

  if (!hasPin) {
    return <CreatePinForm token={token} onAuthenticated={onAuthenticated} />;
  }
  if (mode === "reset") {
    return (
      <ResetPinForm
        token={token}
        onAuthenticated={onAuthenticated}
        onCancel={() => setMode("enter")}
      />
    );
  }
  return (
    <EnterPinForm
      errorMessage={errorMessage}
      onAuthenticated={onAuthenticated}
      onForgotPin={() => setMode("reset")}
    />
  );
}

function PasswordField({
  label,
  error,
  register,
}: {
  label: string;
  error?: string;
  register: UseFormRegister<PinSetupValues>;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <DashField label={label} error={error}>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          {...register("currentPassword")}
          className={`${dashInputClass(!!error)} pr-11`}
          placeholder="Your login password"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#111827]"
        >
          {visible ? <EyeOffIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </DashField>
  );
}

function CreatePinForm({ token, onAuthenticated }: { token: string; onAuthenticated: (pin: string) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PinSetupValues>({
    resolver: zodResolver(pinSetupSchema),
    defaultValues: { pin: "", confirmPin: "", currentPassword: "" },
  });

  async function onSubmit(values: PinSetupValues) {
    setSubmitting(true);
    setError(null);
    try {
      await setupPin(token, values);
      onAuthenticated(values.pin);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-badge-bg text-blue-600">
          <LockIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Create your transaction PIN</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            You'll use this PIN to authorize transfers and deposits. Choose 4 to 6 digits.
          </p>
        </div>
      </div>

      <DashField label="New PIN" error={errors.pin?.message}>
        <PinInput value={watch("pin")} onChange={(v) => setValue("pin", v, { shouldValidate: true })} />
      </DashField>
      <DashField label="Confirm PIN" error={errors.confirmPin?.message}>
        <PinInput value={watch("confirmPin")} onChange={(v) => setValue("confirmPin", v, { shouldValidate: true })} />
      </DashField>
      <PasswordField label="Current password" error={errors.currentPassword?.message} register={register} />

      {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

      <DashboardButton type="submit" disabled={submitting} className="w-full justify-center">
        {submitting ? "Creating PIN…" : "Create PIN & continue"}
      </DashboardButton>
    </form>
  );
}

function ResetPinForm({
  token,
  onAuthenticated,
  onCancel,
}: {
  token: string;
  onAuthenticated: (pin: string) => void;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PinSetupValues>({
    resolver: zodResolver(pinSetupSchema),
    defaultValues: { pin: "", confirmPin: "", currentPassword: "" },
  });

  async function onSubmit(values: PinSetupValues) {
    setSubmitting(true);
    setError(null);
    try {
      await resetPin(token, values);
      onAuthenticated(values.pin);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-badge-bg text-blue-600">
          <LockIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Reset your transaction PIN</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Enter a new PIN and confirm it's you with your account password.
          </p>
        </div>
      </div>

      <DashField label="New PIN" error={errors.pin?.message}>
        <PinInput value={watch("pin")} onChange={(v) => setValue("pin", v, { shouldValidate: true })} />
      </DashField>
      <DashField label="Confirm PIN" error={errors.confirmPin?.message}>
        <PinInput value={watch("confirmPin")} onChange={(v) => setValue("confirmPin", v, { shouldValidate: true })} />
      </DashField>
      <PasswordField label="Current password" error={errors.currentPassword?.message} register={register} />

      {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

      <div className="flex gap-2">
        <DashboardButton type="submit" disabled={submitting} className="flex-1 justify-center">
          {submitting ? "Resetting…" : "Reset PIN & continue"}
        </DashboardButton>
        <DashboardButton type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </DashboardButton>
      </div>
    </form>
  );
}

function EnterPinForm({
  errorMessage,
  onAuthenticated,
  onForgotPin,
}: {
  errorMessage?: string | null;
  onAuthenticated: (pin: string) => void;
  onForgotPin: () => void;
}) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PinEntryValues>({
    resolver: zodResolver(pinEntrySchema),
    defaultValues: { pin: "" },
  });

  function onSubmit(values: PinEntryValues) {
    onAuthenticated(values.pin);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-badge-bg text-blue-600">
          <LockIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Enter your transaction PIN</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Confirm it's you before we complete this.</p>
        </div>
      </div>

      <DashField label="Transaction PIN" error={errors.pin?.message}>
        <PinInput value={watch("pin")} onChange={(v) => setValue("pin", v, { shouldValidate: true })} />
      </DashField>

      {errorMessage && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{errorMessage}</p>}

      <DashboardButton type="submit" className="w-full justify-center">
        Confirm
      </DashboardButton>

      <button
        type="button"
        onClick={onForgotPin}
        className="block w-full text-center text-sm font-medium text-blue-600 hover:underline"
      >
        Forgot PIN?
      </button>
    </form>
  );
}
