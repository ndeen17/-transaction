import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField } from "../dashboard/DashField";
import { dashInputClass } from "../dashboard/inputStyles";
import { DashboardButton } from "../dashboard/DashboardButton";
import { ApiRequestError, listCryptoAssets, type CryptoAsset } from "../../lib/api";
import { cryptoWithdrawDetailsSchema, type CryptoWithdrawDetailsValues } from "../../lib/transactionSchema";

interface CryptoWithdrawFormInput {
  assetId: string;
  amountCrypto: string;
  walletAddress: string;
  network?: string;
}

interface CryptoWithdrawDetailsStepProps {
  token: string;
  defaultValues?: Partial<CryptoWithdrawDetailsValues>;
  onContinue: (values: CryptoWithdrawDetailsValues, asset: CryptoAsset) => void;
}

function toFormInput(values?: Partial<CryptoWithdrawDetailsValues>): CryptoWithdrawFormInput {
  return {
    assetId: values?.assetId ?? "",
    amountCrypto: values?.amountCrypto !== undefined ? String(values.amountCrypto) : "",
    walletAddress: values?.walletAddress ?? "",
    network: values?.network ?? "",
  };
}

export function CryptoWithdrawDetailsStep({ token, defaultValues, onContinue }: CryptoWithdrawDetailsStepProps) {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CryptoWithdrawFormInput, unknown, CryptoWithdrawDetailsValues>({
    resolver: zodResolver(cryptoWithdrawDetailsSchema),
    defaultValues: toFormInput(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) reset(toFormInput(defaultValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  useEffect(() => {
    listCryptoAssets(token)
      .then((fetched) => setAssets(fetched.slice(0, 3)))
      .catch((err) =>
        setLoadError(err instanceof ApiRequestError ? err.message : "Couldn't load crypto currencies."),
      )
      .finally(() => setLoading(false));
  }, [token]);

  const selectedAssetId = watch("assetId");

  function submit(values: CryptoWithdrawDetailsValues) {
    const asset = assets.find((a) => a.id === values.assetId);
    if (!asset) return;
    onContinue(values, asset);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Withdraw crypto</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Choose a currency and the wallet you'd like it sent to. The amount is deducted from
          your balance immediately.
        </p>
      </div>

      {loading && <p className="text-sm text-[#6B7280]">Loading available currencies…</p>}
      {loadError && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{loadError}</p>}

      {!loading && !loadError && (
        <div className="space-y-2.5">
          {assets.map((asset) => {
            const active = selectedAssetId === asset.id;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => setValue("assetId", asset.id, { shouldValidate: true })}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                  active ? "border-blue-500 bg-badge-bg" : "border-[#E5E7EB] bg-white"
                }`}
              >
                <span>
                  <span className="block text-lg font-bold text-[#111827]">
                    {asset.symbol} <span className="text-sm font-normal text-[#6B7280]">— {asset.name}</span>
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
            );
          })}
          {errors.assetId && <p className="text-xs text-[#DC2626]">{errors.assetId.message}</p>}
        </div>
      )}

      {selectedAssetId && (
        <>
          <DashField label="Amount to withdraw" error={errors.amountCrypto?.message}>
            <input
              type="number"
              step="any"
              min="0"
              inputMode="decimal"
              {...register("amountCrypto")}
              className={dashInputClass(!!errors.amountCrypto)}
              placeholder="0.00"
            />
          </DashField>

          <DashField label="Your wallet address" error={errors.walletAddress?.message}>
            <input
              {...register("walletAddress")}
              className={dashInputClass(!!errors.walletAddress)}
              placeholder="Destination wallet address"
            />
          </DashField>

          <DashField label="Network" optional error={errors.network?.message}>
            <input
              {...register("network")}
              className={dashInputClass(!!errors.network)}
              placeholder="e.g. TRC-20"
            />
          </DashField>
        </>
      )}

      <DashboardButton type="submit" className="w-full justify-center" disabled={!assets.length}>
        Continue
      </DashboardButton>
    </form>
  );
}
