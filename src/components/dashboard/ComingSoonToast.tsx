export function ComingSoonToast({ label }: { label: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 sm:bottom-8">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">
        <span aria-hidden>🚧</span>
        {label} is coming soon
      </div>
    </div>
  );
}
