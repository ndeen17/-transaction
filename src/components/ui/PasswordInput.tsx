import { useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "../icons";

export function PasswordInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3 pr-11 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
      >
        {visible ? <EyeOffIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
}
