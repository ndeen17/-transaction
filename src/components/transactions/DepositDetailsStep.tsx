import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField, dashInputClass } from "../dashboard/DashField";
import { DashboardButton } from "../dashboard/DashboardButton";
import { depositDetailsSchema, type DepositDetailsValues } from "../../lib/transactionSchema";

interface DepositDetailsStepProps {
  defaultValues?: Partial<DepositDetailsValues>;
  onContinue: (values: DepositDetailsValues) => void;
}

export function DepositDetailsStep({ defaultValues, onContinue }: DepositDetailsStepProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepositDetailsValues>({
    resolver: zodResolver(depositDetailsSchema),
    defaultValues: { amount: undefined as unknown as number, ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset((current) => ({ ...current, ...defaultValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onContinue)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Deposit funds</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Add money to your own account. This is a simulated deposit for demo purposes.
        </p>
      </div>

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

      <DashboardButton type="submit" className="w-full justify-center">
        Continue
      </DashboardButton>
    </form>
  );
}
