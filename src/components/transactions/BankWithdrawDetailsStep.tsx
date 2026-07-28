import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField } from "../dashboard/DashField";
import { dashInputClass } from "../dashboard/inputStyles";
import { DashboardButton } from "../dashboard/DashboardButton";
import { bankWithdrawDetailsSchema, type BankWithdrawDetailsValues } from "../../lib/transactionSchema";

interface BankWithdrawFormInput {
  amount: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
}

interface BankWithdrawDetailsStepProps {
  defaultValues?: Partial<BankWithdrawDetailsValues>;
  onContinue: (values: BankWithdrawDetailsValues) => void;
}

function toFormInput(values?: Partial<BankWithdrawDetailsValues>): BankWithdrawFormInput {
  return {
    amount: values?.amount !== undefined ? String(values.amount) : "",
    bankName: values?.bankName ?? "",
    accountName: values?.accountName ?? "",
    accountNumber: values?.accountNumber ?? "",
    routingNumber: values?.routingNumber ?? "",
  };
}

export function BankWithdrawDetailsStep({ defaultValues, onContinue }: BankWithdrawDetailsStepProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankWithdrawFormInput, unknown, BankWithdrawDetailsValues>({
    resolver: zodResolver(bankWithdrawDetailsSchema),
    defaultValues: toFormInput(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) reset(toFormInput(defaultValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onContinue)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Withdraw to your bank</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Enter the bank account you'd like the funds sent to. The amount is deducted from your
          balance immediately.
        </p>
      </div>

      <DashField label="Bank name" error={errors.bankName?.message}>
        <input
          {...register("bankName")}
          className={dashInputClass(!!errors.bankName)}
          placeholder="Chase Bank"
        />
      </DashField>

      <DashField label="Account name" error={errors.accountName?.message}>
        <input
          {...register("accountName")}
          className={dashInputClass(!!errors.accountName)}
          placeholder="Your full name"
        />
      </DashField>

      <DashField label="Account number" error={errors.accountNumber?.message}>
        <input
          {...register("accountNumber")}
          className={dashInputClass(!!errors.accountNumber)}
          placeholder="0123456789"
        />
      </DashField>

      <DashField label="Routing number" optional error={errors.routingNumber?.message}>
        <input
          {...register("routingNumber")}
          className={dashInputClass(!!errors.routingNumber)}
          placeholder="021000021"
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

      <DashboardButton type="submit" className="w-full justify-center">
        Continue
      </DashboardButton>
    </form>
  );
}
