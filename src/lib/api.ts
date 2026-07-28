import type { SignupFormValues } from "./signupSchema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export class ApiRequestError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  const body = (await res.json().catch(() => ({}))) as Envelope<T>;

  if (!res.ok || !body.success) {
    throw new ApiRequestError(body.message ?? "Something went wrong", res.status, body.code);
  }

  return body.data as T;
}

export function previewLoginId(firstName: string, lastName: string) {
  return request<{ loginId: string }>("/signup/login-id/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName }),
  });
}

export interface SubmitSignupResult {
  userId: string;
  loginId: string;
  status: string;
  otpExpiresInSeconds: number;
}

export function submitSignup(values: SignupFormValues) {
  const { idDocument, ...kycRest } = values.kyc;

  const payload = {
    accountType: values.accountType,
    personal: values.personal,
    contact: values.contact,
    kyc: { idType: kycRest.idType, idNumber: kycRest.idNumber },
    auth: values.auth,
    consents: values.consents,
  };

  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  formData.append("idDocument", idDocument);

  return request<SubmitSignupResult>("/signup", {
    method: "POST",
    body: formData,
  });
}

export interface AccountSummary {
  accountNumber: string;
  balance: number;
  currency: string;
  totalCredit: number;
  totalDebit: number;
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  loginId: string;
  accountType: string;
  status: string;
  kycReviewStatus: string;
  hasPin: boolean;
  avatarUrl?: string;
  account: AccountSummary;
}

export interface VerifyOtpResult {
  token: string;
  user: UserSummary;
}

export function verifyOtp(userId: string, code: string) {
  return request<VerifyOtpResult>("/signup/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, code }),
  });
}

export function resendOtp(userId: string) {
  return request<{ message: string; otpExpiresInSeconds?: number }>("/signup/otp/resend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}

export function login(loginId: string, password: string) {
  return request<VerifyOtpResult>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password }),
  });
}

export function requestPasswordReset(loginId: string) {
  return request<{ message: string }>("/auth/password-reset/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId }),
  });
}

export interface ConfirmPasswordResetPayload {
  loginId: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function confirmPasswordReset(payload: ConfirmPasswordResetPayload) {
  return request<VerifyOtpResult>("/auth/password-reset/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchMe(token: string) {
  return request<UserSummary>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function pinStatus(token: string) {
  return request<{ hasPin: boolean }>("/pin/status", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface SetupPinPayload {
  pin: string;
  confirmPin: string;
  currentPassword: string;
}

export function setupPin(token: string, payload: SetupPinPayload) {
  return request<{ hasPin: boolean }>("/pin/setup", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function resetPin(token: string, payload: SetupPinPayload) {
  return request<{ hasPin: boolean }>("/pin/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export interface TransactionRecipient {
  name: string;
  bankName: string;
  accountNumber: string;
}

export interface TransactionCrypto {
  symbol: string;
  network?: string;
  amountCrypto: number;
  address: string;
  txHash?: string;
}

export interface TransactionBankDeposit {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
}

export interface TransactionSummary {
  id: string;
  reference: string;
  type: "transfer" | "deposit" | "adjustment" | "crypto_deposit" | "bank_deposit";
  direction: "debit" | "credit";
  status: "completed" | "failed";
  simulated: boolean;
  amount: number;
  currency: string;
  narration?: string;
  balanceAfter: number;
  recipient?: TransactionRecipient;
  crypto?: TransactionCrypto;
  bankDeposit?: TransactionBankDeposit;
  failureReason?: string;
  createdAt: string;
}

export interface SubmitTransferPayload {
  recipientName: string;
  bankName: string;
  recipientAccountNumber: string;
  amount: number;
  narration?: string;
  pin: string;
}

export function submitTransfer(token: string, payload: SubmitTransferPayload) {
  return request<TransactionSummary>("/transactions/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export interface SubmitDepositPayload {
  amount: number;
  pin: string;
}

export function submitDeposit(token: string, payload: SubmitDepositPayload) {
  return request<TransactionSummary>("/transactions/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export interface TransactionListResult {
  items: TransactionSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function listTransactions(token: string, params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<TransactionListResult>(`/transactions${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getTransaction(token: string, id: string) {
  return request<TransactionSummary>(`/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin (/vaultadmin) ----

export function adminLogin(password: string) {
  return request<{ token: string }>("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export interface AdminUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  loginId: string;
  accountType: string;
  status: string;
  kycReviewStatus: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface AdminUserListResult {
  items: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminListUsersParams {
  status?: string;
  kycStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function adminListUsers(token: string, params: AdminListUsersParams = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.kycStatus) query.set("kycStatus", params.kycStatus);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<AdminUserListResult>(`/admin/users${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface AdminUserDetail {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  loginId: string;
  accountType: string;
  status: string;
  kyc: {
    idType: string;
    idNumber: string;
    reviewStatus: string;
    documentUrl: string;
    documentMimeType?: string;
  };
  account: AccountSummary;
  createdAt: string;
}

export function adminGetUser(token: string, id: string) {
  return request<AdminUserDetail>(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminApproveKyc(token: string, id: string) {
  return request<{ kycReviewStatus: string }>(`/admin/users/${id}/kyc/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminSuspendUser(token: string, id: string) {
  return request<{ status: string }>(`/admin/users/${id}/suspend`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminUnsuspendUser(token: string, id: string) {
  return request<{ status: string }>(`/admin/users/${id}/unsuspend`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface AdminBalanceAdjustmentPayload {
  direction: "credit" | "debit";
  amount: number;
  note?: string;
}

export function adminAdjustBalance(token: string, id: string, payload: AdminBalanceAdjustmentPayload) {
  return request<{ balance: number; transaction: TransactionSummary }>(
    `/admin/users/${id}/balance-adjustment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    },
  );
}

// ---- Account settings ----

export function uploadProfileImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  return request<UserSummary>("/account/profile-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export function removeProfileImage(token: string) {
  return request<UserSummary>("/account/profile-image", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Crypto deposits (client) ----

export interface CryptoAsset {
  id: string;
  coingeckoId: string;
  symbol: string;
  name: string;
  network?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export function listCryptoAssets(token: string) {
  return request<CryptoAsset[]>("/crypto/assets", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type CryptoDepositStatus = "pending" | "accepted" | "rejected" | "crediting" | "credited";

export interface CryptoDepositSummary {
  id: string;
  symbol: string;
  network?: string;
  address: string;
  amountCrypto: number;
  amount: number;
  priceUsdAtSubmission: number;
  currency: string;
  txHash?: string;
  reference: string;
  status: CryptoDepositStatus;
  adminNote?: string;
  reviewedAt?: string;
  scheduledCreditAt?: string;
  creditedAt?: string;
  transactionId?: string;
  createdAt: string;
}

export interface SubmitCryptoDepositPayload {
  assetId: string;
  amountCrypto: number;
  txHash?: string;
  pin: string;
}

export function submitCryptoDeposit(token: string, payload: SubmitCryptoDepositPayload) {
  return request<CryptoDepositSummary>("/crypto/deposits", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export interface CryptoDepositListResult {
  items: CryptoDepositSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function listMyCryptoDeposits(token: string, params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<CryptoDepositListResult>(`/crypto/deposits${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getMyCryptoDeposit(token: string, id: string) {
  return request<CryptoDepositSummary>(`/crypto/deposits/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Bank deposits (client) ----

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export function listBankAccounts(token: string) {
  return request<BankAccount[]>("/bank-accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type BankDepositStatus = "pending" | "rejected" | "crediting" | "credited";

export interface BankDepositSummary {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  amount: number;
  currency: string;
  senderReference?: string;
  reference: string;
  status: BankDepositStatus;
  adminNote?: string;
  reviewedAt?: string;
  creditedAt?: string;
  transactionId?: string;
  createdAt: string;
}

export interface SubmitBankDepositPayload {
  bankAccountId: string;
  amount: number;
  senderReference?: string;
  pin: string;
}

export function submitBankDeposit(token: string, payload: SubmitBankDepositPayload) {
  return request<BankDepositSummary>("/bank-deposits", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export interface BankDepositListResult {
  items: BankDepositSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function listMyBankDeposits(token: string, params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<BankDepositListResult>(`/bank-deposits${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getMyBankDeposit(token: string, id: string) {
  return request<BankDepositSummary>(`/bank-deposits/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Notifications ----

export interface NotificationItem {
  id: string;
  type:
    | "crypto_deposit_accepted"
    | "crypto_deposit_rejected"
    | "crypto_deposit_credited"
    | "bank_deposit_initiated"
    | "bank_deposit_approved"
    | "bank_deposit_rejected";
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function listNotifications(token: string, params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<NotificationListResult>(`/notifications${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function markNotificationRead(token: string, id: string) {
  return request<NotificationItem>(`/notifications/${id}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function markAllNotificationsRead(token: string) {
  return request<{ message: string }>("/notifications/read-all", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin: crypto assets ----

export interface CryptoCatalogOption {
  coingeckoId: string;
  symbol: string;
  name: string;
}

export function adminListCryptoCatalog(token: string) {
  return request<CryptoCatalogOption[]>("/admin/crypto-catalog", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface AdminCreateCryptoAssetPayload {
  coingeckoId: string;
  network?: string;
  address: string;
}

export interface AdminUpdateCryptoAssetPayload {
  network?: string;
  address: string;
}

export function adminListCryptoAssets(token: string) {
  return request<CryptoAsset[]>("/admin/crypto-assets", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminCreateCryptoAsset(token: string, payload: AdminCreateCryptoAssetPayload) {
  return request<CryptoAsset>("/admin/crypto-assets", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function adminUpdateCryptoAsset(token: string, id: string, payload: AdminUpdateCryptoAssetPayload) {
  return request<CryptoAsset>(`/admin/crypto-assets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function adminDeleteCryptoAsset(token: string, id: string) {
  return request<{ message: string }>(`/admin/crypto-assets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin: crypto deposits ----

export interface AdminCryptoDepositSummary extends CryptoDepositSummary {
  submitter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    loginId: string;
  } | null;
}

export interface AdminCryptoDepositListResult {
  items: AdminCryptoDepositSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function adminListCryptoDeposits(
  token: string,
  params: { status?: string; page?: number; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<AdminCryptoDepositListResult>(`/admin/crypto-deposits${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminGetCryptoDeposit(token: string, id: string) {
  return request<AdminCryptoDepositSummary>(`/admin/crypto-deposits/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminAcceptCryptoDeposit(token: string, id: string) {
  return request<{ status: string; scheduledCreditAt?: string }>(`/admin/crypto-deposits/${id}/accept`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminRejectCryptoDeposit(token: string, id: string, note?: string) {
  return request<{ status: string }>(`/admin/crypto-deposits/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ note }),
  });
}

// ---- Admin: bank accounts ----

export interface AdminBankAccountPayload {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
}

export function adminListBankAccounts(token: string) {
  return request<BankAccount[]>("/admin/bank-accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminCreateBankAccount(token: string, payload: AdminBankAccountPayload) {
  return request<BankAccount>("/admin/bank-accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function adminUpdateBankAccount(token: string, id: string, payload: AdminBankAccountPayload) {
  return request<BankAccount>(`/admin/bank-accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function adminDeleteBankAccount(token: string, id: string) {
  return request<{ message: string }>(`/admin/bank-accounts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin: bank deposits ----

export interface AdminBankDepositSummary extends BankDepositSummary {
  submitter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    loginId: string;
  } | null;
}

export interface AdminBankDepositListResult {
  items: AdminBankDepositSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function adminListBankDeposits(
  token: string,
  params: { status?: string; page?: number; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  return request<AdminBankDepositListResult>(`/admin/bank-deposits${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminGetBankDeposit(token: string, id: string) {
  return request<AdminBankDepositSummary>(`/admin/bank-deposits/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminAcceptBankDeposit(token: string, id: string) {
  return request<{ status: string }>(`/admin/bank-deposits/${id}/accept`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminRejectBankDeposit(token: string, id: string, note?: string) {
  return request<{ status: string }>(`/admin/bank-deposits/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ note }),
  });
}
