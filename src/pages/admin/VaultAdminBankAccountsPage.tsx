import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { DashboardButton } from "../../components/dashboard/DashboardButton";
import { DashField } from "../../components/dashboard/DashField";
import { dashInputClass } from "../../components/dashboard/inputStyles";
import { DASH_CARD } from "../../components/dashboard/theme";
import { VaultAdminNav } from "./VaultAdminNav";
import {
  ApiRequestError,
  adminCreateBankAccount,
  adminDeleteBankAccount,
  adminListBankAccounts,
  adminUpdateBankAccount,
  type AdminBankAccountPayload,
  type BankAccount,
} from "../../lib/api";

interface FormValues {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
}

const EMPTY_FORM: FormValues = { bankName: "", accountName: "", accountNumber: "", routingNumber: "" };

function BankAccountForm({
  initialValues = EMPTY_FORM,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues?: FormValues;
  submitLabel: string;
  onSubmit: (values: AdminBankAccountPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        bankName: values.bankName,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
        routingNumber: values.routingNumber || undefined,
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
        <DashField label="Bank name">
          <input
            value={values.bankName}
            onChange={(e) => setValues((v) => ({ ...v, bankName: e.target.value }))}
            placeholder="Chase Bank"
            required
            className={dashInputClass()}
          />
        </DashField>
        <DashField label="Account name">
          <input
            value={values.accountName}
            onChange={(e) => setValues((v) => ({ ...v, accountName: e.target.value }))}
            placeholder="Vaulto Hub Ltd"
            required
            className={dashInputClass()}
          />
        </DashField>
        <DashField label="Account number">
          <input
            value={values.accountNumber}
            onChange={(e) => setValues((v) => ({ ...v, accountNumber: e.target.value }))}
            placeholder="1234567890"
            required
            className={dashInputClass()}
          />
        </DashField>
        <DashField label="Routing number" optional>
          <input
            value={values.routingNumber}
            onChange={(e) => setValues((v) => ({ ...v, routingNumber: e.target.value }))}
            placeholder="021000021"
            className={dashInputClass()}
          />
        </DashField>
      </div>

      {error && <p className="rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}

      <div className="flex gap-2">
        <DashboardButton type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </DashboardButton>
        <DashboardButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </DashboardButton>
      </div>
    </form>
  );
}

export function VaultAdminBankAccountsPage() {
  const token = localStorage.getItem("adminToken");

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  function loadAccounts() {
    if (!token) return;
    setLoading(true);
    adminListBankAccounts(token)
      .then(setAccounts)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Couldn't load bank accounts."))
      .finally(() => setLoading(false));
  }

  useEffect(loadAccounts, [token]);

  if (!token) {
    return <Navigate to="/vaultadmin" replace />;
  }

  async function handleCreate(payload: AdminBankAccountPayload) {
    if (!token) return;
    await adminCreateBankAccount(token, payload);
    setShowAddForm(false);
    loadAccounts();
  }

  async function handleUpdate(id: string, payload: AdminBankAccountPayload) {
    if (!token) return;
    await adminUpdateBankAccount(token, id, payload);
    setEditingId(null);
    loadAccounts();
  }

  async function handleDelete(id: string) {
    if (!token) return;
    await adminDeleteBankAccount(token, id);
    setConfirmingDeleteId(null);
    loadAccounts();
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
          <h2 className="text-lg font-semibold text-[#111827]">Bank accounts</h2>
          {!showAddForm && (
            <DashboardButton onClick={() => setShowAddForm(true)}>Add account</DashboardButton>
          )}
        </div>

        {showAddForm && (
          <div className={`${DASH_CARD} mt-4`}>
            <BankAccountForm submitLabel="Create account" onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        <div className={`${DASH_CARD} mt-4`}>
          {loading && <p className="p-6 text-sm text-[#6B7280]">Loading…</p>}
          {error && <p className="p-6 text-sm text-[#DC2626]">{error}</p>}
          {!loading && !error && accounts.length === 0 && (
            <p className="p-6 text-sm text-[#6B7280]">No bank accounts yet. Add one to get started.</p>
          )}
          {!loading && accounts.length > 0 && (
            <div className="divide-y divide-[#E5E7EB]">
              {accounts.map((account) =>
                editingId === account.id ? (
                  <BankAccountForm
                    key={account.id}
                    initialValues={{
                      bankName: account.bankName,
                      accountName: account.accountName,
                      accountNumber: account.accountNumber,
                      routingNumber: account.routingNumber ?? "",
                    }}
                    submitLabel="Save changes"
                    onSubmit={(payload) => handleUpdate(account.id, payload)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div key={account.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111827]">
                        {account.bankName} <span className="font-normal text-[#6B7280]">— {account.accountName}</span>
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-[#6B7280]">
                        {account.accountNumber}
                        {account.routingNumber && ` · Routing ${account.routingNumber}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <DashboardButton variant="secondary" onClick={() => setEditingId(account.id)}>
                        Edit
                      </DashboardButton>
                      {confirmingDeleteId === account.id ? (
                        <DashboardButton variant="danger" onClick={() => handleDelete(account.id)}>
                          Confirm delete?
                        </DashboardButton>
                      ) : (
                        <DashboardButton variant="danger" onClick={() => setConfirmingDeleteId(account.id)}>
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
