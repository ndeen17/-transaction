import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField } from "../dashboard/DashField";
import { dashInputClass } from "../dashboard/inputStyles";
import { DashboardButton } from "../dashboard/DashboardButton";
import { PinInput } from "../dashboard/PinInput";
import { LockIcon } from "../dashboard/icons";
import { ApiRequestError, setupPin } from "../../lib/api";
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
  if (!hasPin) {
    return <CreatePinForm token={token} onAuthenticated={onAuthenticated} />;
  }
  return <EnterPinForm errorMessage={errorMessage} onAuthenticated={onAuthenticated} />;
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
      <DashField label="Current password" error={errors.currentPassword?.message}>
        <input
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
          className={dashInputClass(!!errors.currentPassword)}
          placeholder="Your login password"
        />
      </DashField>

      {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

      <DashboardButton type="submit" disabled={submitting} className="w-full justify-center">
        {submitting ? "Creating PIN…" : "Create PIN & continue"}
      </DashboardButton>
    </form>
  );
}

function EnterPinForm({
  errorMessage,
  onAuthenticated,
}: {
  errorMessage?: string | null;
  onAuthenticated: (pin: string) => void;
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
    </form>
  );
}
