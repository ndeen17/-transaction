export function AboutPhoto() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#9DC4FB] to-[#4F8CF0]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.55),transparent_65%)]" />

      <div className="absolute bottom-10 left-1/2 h-6 w-56 -translate-x-1/2 rounded-full bg-[#3A6FD8]/25 blur-sm sm:bottom-14" />

      <img
        src="/apply.png"
        alt="A customer celebrating a fast transfer, holding their phone and cash"
        className="absolute bottom-0 left-1/2 h-[74%] w-auto -translate-x-1/2 object-contain object-bottom sm:h-[95%]"
      />

      <div className="absolute right-3 top-3 flex w-[140px] animate-float-a items-center gap-2 rounded-full bg-white/95 px-2.5 py-2 shadow-[0_10px_24px_-8px_rgba(16,24,40,0.35)] backdrop-blur-sm sm:right-8 sm:top-10 sm:w-[168px] sm:gap-2.5 sm:px-3 sm:py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FDEEEE] text-[#EE4A4A] sm:h-8 sm:w-8">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none">
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
          <span className="block text-[9px] text-muted sm:text-[10px]">Transaction fee</span>
          <span className="block text-[11px] font-semibold text-[#EE4A4A] sm:text-[13px]">-60.45$</span>
        </span>
      </div>

      <div className="absolute left-3 top-3 flex w-[140px] animate-float-b items-center gap-2 rounded-full bg-white/95 px-2.5 py-2 shadow-[0_10px_24px_-8px_rgba(16,24,40,0.35)] backdrop-blur-sm sm:left-auto sm:right-6 sm:top-32 sm:w-[168px] sm:gap-2.5 sm:px-3 sm:py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B1C3D] text-white sm:h-8 sm:w-8">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none">
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
          <span className="block text-[9px] text-muted sm:text-[10px]">Bank transfer</span>
          <span className="block text-[11px] font-semibold text-positive sm:text-[13px]">+350.85$</span>
        </span>
      </div>
    </div>
  );
}
