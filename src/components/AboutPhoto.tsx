export function AboutPhoto() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#9DC4FB] to-[#4F8CF0]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.55),transparent_65%)]" />

      <div className="absolute bottom-10 left-1/2 h-6 w-56 -translate-x-1/2 rounded-full bg-[#3A6FD8]/25 blur-sm sm:bottom-14" />

      <img
        src="/apply.png"
        alt="A customer celebrating a fast transfer, holding their phone and cash"
        className="absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2 object-contain object-bottom sm:h-[95%]"
      />

      <div className="absolute right-5 top-8 flex w-[168px] animate-float-a items-center gap-2.5 rounded-full bg-white/95 px-3 py-2.5 shadow-[0_10px_24px_-8px_rgba(16,24,40,0.35)] backdrop-blur-sm sm:right-8 sm:top-10">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDEEEE] text-[#EE4A4A]">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path
              d="M4 10h12M10 4l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block text-[10px] text-muted">Transaction fee</span>
          <span className="block text-[13px] font-semibold text-[#EE4A4A]">-60.45$</span>
        </span>
      </div>

      <div className="absolute right-3 top-28 flex w-[168px] animate-float-b items-center gap-2.5 rounded-full bg-white/95 px-3 py-2.5 shadow-[0_10px_24px_-8px_rgba(16,24,40,0.35)] backdrop-blur-sm sm:right-6 sm:top-32">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1C3D] text-white">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path
              d="M3 8.5 10 3l7 5.5M4.5 8v7.5A1.5 1.5 0 0 0 6 17h8a1.5 1.5 0 0 0 1.5-1.5V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block text-[10px] text-muted">Bank transfer</span>
          <span className="block text-[13px] font-semibold text-positive">+350.85$</span>
        </span>
      </div>
    </div>
  );
}
