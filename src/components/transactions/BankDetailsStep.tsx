import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField } from "../dashboard/DashField";
import { dashInputClass } from "../dashboard/inputStyles";
import { DashboardButton } from "../dashboard/DashboardButton";
import { CopyIcon } from "../dashboard/icons";
import { ApiRequestError, listBankAccounts, type BankAccount } from "../../lib/api";
import { bankDepositDetailsSchema, type BankDepositDetailsValues } from "../../lib/transactionSchema";

interface BankFormInput {
  bankAccountId: string;
  amount: string;
  senderReference?: string;
}

interface BankDetailsStepProps {
  token: string;
  defaultValues?: Partial<BankDepositDetailsValues>;
  onContinue: (values: BankDepositDetailsValues, account: BankAccount) => void;
}

function toFormInput(values?: Partial<BankDepositDetailsValues>): BankFormInput {
  return {
    bankAccountId: values?.bankAccountId ?? "",
    amount: values?.amount !== undefined ? String(values.amount) : "",
    senderReference: values?.senderReference ?? "",
  };
}

export function BankDetailsStep({ token, defaultValues, onContinue }: BankDetailsStepProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BankFormInput, unknown, BankDepositDetailsValues>({
    resolver: zodResolver(bankDepositDetailsSchema),
    defaultValues: toFormInput(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) reset(toFormInput(defaultValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  useEffect(() => {
    listBankAccounts(token)
      .then(setAccounts)
      .catch((err) =>
        setLoadError(err instanceof ApiRequestError ? err.message : "Couldn't load bank accounts."),
      )
      .finally(() => setLoading(false));
  }, [token]);

  const selectedAccountId = watch("bankAccountId");

  async function handleCopy(accountNumber: string, id: string) {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — fail silently, no crash.
    }
  }

  function submit(values: BankDepositDetailsValues) {
    const account = accounts.find((a) => a.id === values.bankAccountId);
    if (!account) return;
    onContinue(values, account);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Deposit via bank transfer</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Choose an account, send your transfer to the details shown, then tell us what you sent.
          Deposits are reviewed before they're credited.
        </p>
      </div>

      {loading && <p className="text-sm text-[#6B7280]">Loading available accounts…</p>}
      {loadError && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{loadError}</p>}

      {!loading && !loadError && (
        <div className="space-y-2.5">
          {accounts.map((account) => {
            const active = selectedAccountId === account.id;
            return (
              <div
                key={account.id}
                className={`rounded-xl border p-4 transition-colors ${
                  active ? "border-blue-500 bg-badge-bg" : "border-[#E5E7EB] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setValue("bankAccountId", account.id, { shouldValidate: true })}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#111827]">
                      {account.bankName} <span className="font-normal text-[#6B7280]">— {account.accountName}</span>
                    </span>
                  </span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-blue-600 bg-blue-600" : "border-[#D1D5DB]"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>

                {active && (
                  <div className="mt-3 space-y-1.5 rounded-lg bg-white/60 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-mono text-xs text-[#111827]">
                        {account.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(account.accountNumber, account.id)}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[#F8FAFC]"
                      >
                        <CopyIcon className="h-3 w-3" />
                        {copiedId === account.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                    {account.routingNumber && (
                      <p className="font-mono text-xs text-[#6B7280]">Routing: {account.routingNumber}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {errors.bankAccountId && <p className="text-xs text-[#DC2626]">{errors.bankAccountId.message}</p>}
        </div>
      )}

      {selectedAccountId && (
        <>
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

          <DashField label="Transfer reference" optional error={errors.senderReference?.message}>
            <input
              {...register("senderReference")}
              className={dashInputClass(!!errors.senderReference)}
              placeholder="Optional, for your records"
            />
          </DashField>
        </>
      )}

      <DashboardButton type="submit" className="w-full justify-center" disabled={!accounts.length}>
        Continue
      </DashboardButton>
    </form>
  );
}
