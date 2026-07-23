export function ProcessingStep({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-[#E5E7EB] border-t-blue-600" />
      <p className="mt-5 text-sm font-medium text-[#111827]">{label}</p>
      <p className="mt-1 text-xs text-[#6B7280]">This will only take a moment.</p>
    </div>
  );
}
