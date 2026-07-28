import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DashField } from "../../components/dashboard/DashField";
import { dashInputClass } from "../../components/dashboard/inputStyles";
import { DASH_CARD } from "../../components/dashboard/theme";
import { VaultAdminNav } from "./VaultAdminNav";
import {
  ApiRequestError,
  adminCreateCryptoAsset,
  adminDeleteCryptoAsset,
  adminListCryptoAssets,
  adminListCryptoCatalog,
  adminUpdateCryptoAsset,
  type AdminCreateCryptoAssetPayload,
  type AdminUpdateCryptoAssetPayload,
  type CryptoAsset,
  type CryptoCatalogOption,
} from "../../lib/api";

interface CreateFormValues {
  coingeckoId: string;
  network: string;
  address: string;
}

interface EditFormValues {
  network: string;
  address: string;
}

function CreateAssetForm({
  token,
  onSubmit,
  onCancel,
}: {
  token: string;
  onSubmit: (values: AdminCreateCryptoAssetPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const [catalog, setCatalog] = useState<CryptoCatalogOption[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [values, setValues] = useState<CreateFormValues>({ coingeckoId: "", network: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminListCryptoCatalog(token)
      .then(setCatalog)
      .catch((err) =>
        setCatalogError(err instanceof ApiRequestError ? err.message : "Couldn't load available currencies."),
      )
      .finally(() => setCatalogLoading(false));
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        coingeckoId: values.coingeckoId,
        network: values.network || undefined,
        address: values.address,
      });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashField label="Currency">
          {catalogLoading && <p className="text-sm text-[#6B7280]">Loading…</p>}
          {catalogError && <p className="text-sm text-[#DC2626]">{catalogError}</p>}
          {!catalogLoading && !catalogError && (
            <select
              value={values.coingeckoId}
              onChange={(e) => setValues((v) => ({ ...v, coingeckoId: e.target.value }))}
              required
              className={dashInputClass()}
            >
              <option value="" disabled>
                Choose a currency
              </option>
              {catalog.map((coin) => (
                <option key={coin.coingeckoId} value={coin.coingeckoId}>
                  {coin.symbol} — {coin.name}
                </option>
              ))}
            </select>
          )}
        </DashField>
        <DashField label="Network" optional>
          <input
            value={values.network}
            onChange={(e) => setValues((v) => ({ ...v, network: e.target.value }))}
            placeholder="TRC-20"
            className={dashInputClass()}
          />
        </DashField>
        <DashField label="Address">
          <input
            value={values.address}
            onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
            placeholder="Deposit address"
            required
            className={dashInputClass()}
          />
        </DashField>
      </div>

      {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

      <div className="flex gap-2">
        <DashboardButton type="submit" disabled={submitting || catalogLoading}>
          {submitting ? "Saving…" : "Create asset"}
        </DashboardButton>
        <DashboardButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </DashboardButton>
      </div>
    </form>
  );
}

function EditAssetForm({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues: EditFormValues;
  onSubmit: (values: AdminUpdateCryptoAssetPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<EditFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ network: values.network || undefined, address: values.address });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashField label="Network" optional>
          <input
            value={values.network}
            onChange={(e) => setValues((v) => ({ ...v, network: e.target.value }))}
            placeholder="TRC-20"
            className={dashInputClass()}
          />
        </DashField>
        <DashField label="Address">
          <input
            value={values.address}
            onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
            placeholder="Deposit address"
            required
            className={dashInputClass()}
          />
        </DashField>
      </div>

      {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

      <div className="flex gap-2">
        <DashboardButton type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </DashboardButton>
        <DashboardButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </DashboardButton>
      </div>
    </form>
  );
}

export function VaultAdminCryptoAssetsPage() {
  const token = localStorage.getItem("adminToken");

  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  function loadAssets() {
    if (!token) return;
    setLoading(true);
    adminListCryptoAssets(token)
      .then(setAssets)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Couldn't load crypto assets."))
      .finally(() => setLoading(false));
  }

  useEffect(loadAssets, [token]);

  if (!token) {
    return <Navigate to="/vaultadmin" replace />;
  }

  async function handleCreate(payload: AdminCreateCryptoAssetPayload) {
    if (!token) return;
    await adminCreateCryptoAsset(token, payload);
    setShowAddForm(false);
    loadAssets();
  }

  async function handleUpdate(id: string, payload: AdminUpdateCryptoAssetPayload) {
    if (!token) return;
    await adminUpdateCryptoAsset(token, id, payload);
    setEditingId(null);
    loadAssets();
  }

  async function handleDelete(id: string) {
    if (!token) return;
    await adminDeleteCryptoAsset(token, id);
    setConfirmingDeleteId(null);
    loadAssets();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Vaulto Hub</p>
          <h1 className="mt-1 text-xl font-semibold text-[#111827]">VaultAdmin</h1>
        </div>

        <VaultAdminNav />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">Crypto assets</h2>
          {!showAddForm && (
            <DashboardButton onClick={() => setShowAddForm(true)}>Add asset</DashboardButton>
          )}
        </div>

        {showAddForm && token && (
          <div className={`${DASH_CARD} mt-4`}>
            <CreateAssetForm token={token} onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        <div className={`${DASH_CARD} mt-4`}>
          {loading && <p className="p-6 text-sm text-[#6B7280]">Loading…</p>}
          {error && <p className="p-6 text-sm text-[#DC2626]">{error}</p>}
          {!loading && !error && assets.length === 0 && (
            <p className="p-6 text-sm text-[#6B7280]">No crypto assets yet. Add one to get started.</p>
          )}
          {!loading && assets.length > 0 && (
            <div className="divide-y divide-[#E5E7EB]">
              {assets.map((asset) =>
                editingId === asset.id ? (
                  <EditAssetForm
                    key={asset.id}
                    initialValues={{ network: asset.network ?? "", address: asset.address }}
                    onSubmit={(payload) => handleUpdate(asset.id, payload)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div key={asset.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111827]">
                        {asset.symbol} <span className="font-normal text-[#6B7280]">— {asset.name}</span>
                        {asset.network && <span className="ml-1.5 text-xs text-[#6B7280]">({asset.network})</span>}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-[#6B7280]">{asset.address}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <DashboardButton variant="secondary" onClick={() => setEditingId(asset.id)}>
                        Edit
                      </DashboardButton>
                      {confirmingDeleteId === asset.id ? (
                        <DashboardButton variant="danger" onClick={() => handleDelete(asset.id)}>
                          Confirm delete?
                        </DashboardButton>
                      ) : (
                        <DashboardButton variant="danger" onClick={() => setConfirmingDeleteId(asset.id)}>
                          Delete
                        </DashboardButton>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
