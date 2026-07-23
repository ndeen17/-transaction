import { z } from "zod";

export const ACCOUNT_TYPES = ["savings", "current"] as const;
export const GENDERS = ["male", "female", "other", "prefer_not_to_say"] as const;
export const MARITAL_STATUSES = [
  "single",
  "married",
  "divorced",
  "widowed",
  "separated",
] as const;
export const ID_TYPES = ["passport", "drivers_license", "national_id"] as const;

export const ACCOUNT_TYPE_LABELS: Record<(typeof ACCOUNT_TYPES)[number], string> = {
  savings: "Savings Account",
  current: "Current / Checking Account",
};

export const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export const MARITAL_STATUS_LABELS: Record<(typeof MARITAL_STATUSES)[number], string> = {
  single: "Single",
  married: "Married",
  divorced: "Divorced",
  widowed: "Widowed",
  separated: "Separated",
};

export const ID_TYPE_LABELS: Record<(typeof ID_TYPES)[number], string> = {
  passport: "Passport",
  drivers_license: "Driver's License",
  national_id: "National ID",
};

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
];
// Fallback for browsers that report an empty/generic MIME type for HEIC/HEIF photos
// (common on some mobile camera-roll pickers) — fall back to the file extension.
const ACCEPTED_FILE_EXTENSIONS_RE = /\.(jpe?g|png|webp|heic|heif|pdf)$/i;

function isAtLeast18(dob: string) {
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

const nameField = z.string().trim().min(1, "Required").max(60);

export const accountTypeSchema = z.object({
  accountType: z.enum(ACCOUNT_TYPES, "Choose an account type"),
});

export const personalSchema = z.object({
  firstName: nameField,
  middleName: z.string().trim().max(60).optional().or(z.literal("")),
  lastName: nameField,
  dateOfBirth: z
    .string()
    .min(1, "Required")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Enter a valid date")
    .refine(isAtLeast18, "You must be at least 18 years old"),
  gender: z.enum(GENDERS, "Select a gender"),
  nationality: z.string().trim().length(2, "Select a nationality"),
  maritalStatus: z.enum(MARITAL_STATUSES).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  email: z.string().trim().min(1, "Required").email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number"),
  address: z.object({
    line1: z.string().trim().min(1, "Required").max(120),
    city: z.string().trim().min(1, "Required").max(80),
    state: z.string().trim().min(1, "Required").max(80),
    postalCode: z.string().trim().min(1, "Required").max(20),
    country: z.string().trim().length(2, "Select a country"),
  }),
});

export const kycSchema = z.object({
  idType: z.enum(ID_TYPES, "Select an ID type"),
  idNumber: z.string().trim().min(3, "Required").max(40),
  idDocument: z
    .instanceof(File, { message: "Upload your ID document" })
    .refine((f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024, `File must be under ${MAX_FILE_SIZE_MB}MB`)
    .refine(
      (f) => ACCEPTED_FILE_TYPES.includes(f.type) || ACCEPTED_FILE_EXTENSIONS_RE.test(f.name),
      "Upload a JPG, PNG, WEBP, HEIC, or PDF",
    ),
});

const passwordField = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number");

export const authSchema = z
  .object({
    loginId: z.string().min(1),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const consentsSchema = z.object({
  termsAccepted: z.literal(true, "Required"),
  privacyPolicyAccepted: z.literal(true, "Required"),
  electronicCommsConsent: z.literal(true, "Required"),
  dataProcessingConsent: z.literal(true, "Required"),
  amlDeclaration: z.literal(true, "Required"),
});

export const signupFormSchema = z.object({
  accountType: accountTypeSchema.shape.accountType,
  personal: personalSchema,
  contact: contactSchema,
  kyc: kycSchema,
  auth: authSchema,
  consents: consentsSchema,
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export const defaultSignupValues = {
  personal: {
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: undefined,
    nationality: "",
    maritalStatus: undefined,
  },
  contact: {
    email: "",
    phone: "",
    address: { line1: "", city: "", state: "", postalCode: "", country: "" },
  },
  kyc: { idType: undefined, idNumber: "" },
  auth: { loginId: "", password: "", confirmPassword: "" },
  consents: {
    termsAccepted: false as unknown as true,
    privacyPolicyAccepted: false as unknown as true,
    electronicCommsConsent: false as unknown as true,
    dataProcessingConsent: false as unknown as true,
    amlDeclaration: false as unknown as true,
  },
};

export const STEP_FIELDS = {
  accountType: ["accountType"] as const,
  personal: [
    "personal.firstName",
    "personal.middleName",
    "personal.lastName",
    "personal.dateOfBirth",
    "personal.gender",
    "personal.nationality",
    "personal.maritalStatus",
  ] as const,
  contact: [
    "contact.email",
    "contact.phone",
    "contact.address.line1",
    "contact.address.city",
    "contact.address.state",
    "contact.address.postalCode",
    "contact.address.country",
  ] as const,
  kyc: ["kyc.idType", "kyc.idNumber", "kyc.idDocument"] as const,
  auth: ["auth.loginId", "auth.password", "auth.confirmPassword"] as const,
  consents: [
    "consents.termsAccepted",
    "consents.privacyPolicyAccepted",
    "consents.electronicCommsConsent",
    "consents.dataProcessingConsent",
    "consents.amlDeclaration",
  ] as const,
};
