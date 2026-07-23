import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField, dashInputClass } from "../dashboard/DashField";
import { DashboardButton } from "../dashboard/DashboardButton";
import { transferDetailsSchema, type TransferDetailsValues } from "../../lib/transactionSchema";

interface TransferDetailsStepProps {
  defaultValues?: Partial<TransferDetailsValues>;
  onContinue: (values: TransferDetailsValues) => void;
}

export function TransferDetailsStep({ defaultValues, onContinue }: TransferDetailsStepProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferDetailsValues>({
    resolver: zodResolver(transferDetailsSchema),
    defaultValues: {
      recipientName: "",
      bankName: "",
      recipientAccountNumber: "",
      amount: undefined as unknown as number,
      narration: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset((current) => ({ ...current, ...defaultValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onContinue)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Send money</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Enter the recipient's details. This is a simulated transfer for demo purposes.
        </p>
      </div>

      <DashField label="Recipient name" error={errors.recipientName?.message}>
        <input
          {...register("recipientName")}
          className={dashInputClass(!!errors.recipientName)}
          placeholder="Jane Doe"
        />
      </DashField>

      <DashField label="Bank name" error={errors.bankName?.message}>
        <input
          {...register("bankName")}
          className={dashInputClass(!!errors.bankName)}
          placeholder="First National Bank"
        />
      </DashField>

      <DashField label="Account number" error={errors.recipientAccountNumber?.message}>
        <input
          {...register("recipientAccountNumber")}
          className={dashInputClass(!!errors.recipientAccountNumber)}
          placeholder="0123456789"
        />
      </DashField>

      <DashField label="Amount" error={errors.amount?.message}>
        <input
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          {...register("amount")}
          className={dashInputClass(!!errors.amount)}
          placeholder="0.00"
        />
      </DashField>

      <DashField label="Description" optional error={errors.narration?.message}>
        <input
          {...register("narration")}
          className={dashInputClass(!!errors.narration)}
          placeholder="What's this for?"
        />
      </DashField>

      <DashboardButton type="submit" className="w-full justify-center">
        Continue
      </DashboardButton>
    </form>
  );
}
