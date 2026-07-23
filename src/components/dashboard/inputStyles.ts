export function dashInputClass(hasError?: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-blue-500 ${
    hasError ? "border-[#DC2626]" : "border-[#E5E7EB]"
  }`;
}
