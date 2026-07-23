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
    employment: values.employment,
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

export function fetchMe(token: string) {
  return request<UserSummary>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
