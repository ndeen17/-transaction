import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashField } from "../dashboard/DashField";
import { dashInputClass } from "../dashboard/inputStyles";
import { DashboardButton } from "../dashboard/DashboardButton";
import { CopyIcon } from "../dashboard/icons";
import { ApiRequestError, listCryptoAssets, type CryptoAsset } from "../../lib/api";
import { cryptoDepositDetailsSchema, type CryptoDepositDetailsValues } from "../../lib/transactionSchema";

interface CryptoFormInput {
  assetId: string;
  amountCrypto: string;
  txHash?: string;
}

interface CryptoDetailsStepProps {
  token: string;
  defaultValues?: Partial<CryptoDepositDetailsValues>;
  onContinue: (values: CryptoDepositDetailsValues, asset: CryptoAsset) => void;
}

function toFormInput(values?: Partial<CryptoDepositDetailsValues>): CryptoFormInput {
  return {
    assetId: values?.assetId ?? "",
    amountCrypto: values?.amountCrypto !== undefined ? String(values.amountCrypto) : "",
    txHash: values?.txHash ?? "",
  };
}

export function CryptoDetailsStep({ token, defaultValues, onContinue }: CryptoDetailsStepProps) {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
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
  } = useForm<CryptoFormInput, unknown, CryptoDepositDetailsValues>({
    resolver: zodResolver(cryptoDepositDetailsSchema),
    defaultValues: toFormInput(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) reset(toFormInput(defaultValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  useEffect(() => {
    listCryptoAssets(token)
      .then(setAssets)
      .catch((err) =>
        setLoadError(err instanceof ApiRequestError ? err.message : "Couldn't load crypto currencies."),
      )
      .finally(() => setLoading(false));
  }, [token]);

  const selectedAssetId = watch("assetId");

  async function handleCopy(address: string, id: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — fail silently, no crash.
    }
  }

  function submit(values: CryptoDepositDetailsValues) {
    const asset = assets.find((a) => a.id === values.assetId);
    if (!asset) return;
    onContinue(values, asset);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Deposit crypto</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Choose a currency, send your coins to the address shown, then tell us what you sent.
          Deposits are reviewed before they're credited.
        </p>
      </div>

      {loading && <p className="text-sm text-[#6B7280]">Loading available currencies…</p>}
      {loadError && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{loadError}</p>}

      {!loading && !loadError && (
        <div className="space-y-2.5">
          {assets.map((asset) => {
            const active = selectedAssetId === asset.id;
            return (
              <div
                key={asset.id}
                className={`rounded-xl border p-4 transition-colors ${
                  active ? "border-blue-500 bg-badge-bg" : "border-[#E5E7EB] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setValue("assetId", asset.id, { shouldValidate: true })}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#111827]">
                      {asset.symbol} <span className="font-normal text-[#6B7280]">— {asset.name}</span>
                    </span>
                    {asset.network && <span className="mt-0.5 block text-xs text-[#6B7280]">{asset.network}</span>}
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
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-white/60 px-3 py-2">
                    <span className="min-w-0 truncate font-mono text-xs text-[#111827]">{asset.address}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(asset.address, asset.id)}
                      className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[#F8FAFC]"
                    >
                      <CopyIcon className="h-3 w-3" />
                      {copiedId === asset.id ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {errors.assetId && <p className="text-xs text-[#DC2626]">{errors.assetId.message}</p>}
        </div>
      )}

      {selectedAssetId && (
        <>
          <DashField label="Amount sent" error={errors.amountCrypto?.message}>
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

          <DashField label="Transaction hash" optional error={errors.txHash?.message}>
            <input
              {...register("txHash")}
              className={dashInputClass(!!errors.txHash)}
              placeholder="Optional, for your records"
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
