export function ComingSoonToast({ label }: { label: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
      <div className="pointer-events-auto flex animate-toast-in items-center gap-2 rounded-xl bg-[#111827] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <span aria-hidden>🚧</span>
        {label} is coming soon
      </div>
    </div>
  );
}
