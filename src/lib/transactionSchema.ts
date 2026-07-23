import { z } from "zod";

// Kept as a string field (not z.coerce.number()) so the schema's input type matches what
// react-hook-form actually holds for a text input — z.coerce's input type is `unknown`, which
// breaks the zodResolver's generic inference against a concrete form-values type.
const amountField = z
  .string()
  .trim()
  .refine((v) => v.length > 0 && !Number.isNaN(Number(v)), "Enter an amount")
  .transform((v) => Number(v))
  .refine((v) => v > 0, "Enter an amount greater than 0")
  .refine((v) => v <= 1_000_000, "Amount is too large")
  .refine((v) => Number.isInteger(Math.round(v * 100)), "Amount can have at most 2 decimal places");

export const transferDetailsSchema = z.object({
  recipientName: z.string().trim().min(1, "Required").max(120),
  bankName: z.string().trim().min(1, "Required").max(120),
  recipientAccountNumber: z.string().trim().min(1, "Required").max(40),
  amount: amountField,
  narration: z.string().trim().max(200).optional().or(z.literal("")),
});

export type TransferDetailsValues = z.infer<typeof transferDetailsSchema>;

export const depositDetailsSchema = z.object({
  amount: amountField,
});

export type DepositDetailsValues = z.infer<typeof depositDetailsSchema>;

const pinDigits = z.string().trim().regex(/^[0-9]{4,6}$/, "PIN must be 4 to 6 digits");

export const pinSetupSchema = z
  .object({
    pin: pinDigits,
    confirmPin: z.string(),
    currentPassword: z.string().min(1, "Enter your password"),
  })
  .refine((v) => v.pin === v.confirmPin, {
    message: "PINs do not match",
    path: ["confirmPin"],
  });

export type PinSetupValues = z.infer<typeof pinSetupSchema>;

export const pinEntrySchema = z.object({
  pin: z.string().trim().regex(/^[0-9]{4,6}$/, "Enter your PIN"),
});

export type PinEntryValues = z.infer<typeof pinEntrySchema>;
