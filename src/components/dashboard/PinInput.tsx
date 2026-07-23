interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

export function PinInput({ value, onChange, maxLength = 6, disabled }: PinInputProps) {
  return (
    <input
      type="password"
      inputMode="numeric"
      autoComplete="off"
      maxLength={maxLength}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, maxLength))}
      placeholder="••••"
      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] text-[#111827] outline-none transition-colors focus:border-blue-500"
    />
  );
}
