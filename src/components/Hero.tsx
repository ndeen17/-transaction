import { ArrowRightIcon, PencilIcon } from "./icons";

function ExchangeCard() {
  return (
    <div className="flex flex-1 flex-col rounded-[28px] border border-[#EEF1F5] bg-white">
      <div className="flex flex-1 flex-col justify-between gap-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">From USD</p>
            <p className="mt-2 text-2xl font-semibold text-ink">$150.00</p>
          </div>
          <PencilIcon className="h-4 w-4 text-muted" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">To GBR</p>
            <p className="mt-2 text-2xl font-semibold text-ink">£112.00</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8EC0FA] to-blue-600" />
        </div>
      </div>

      <div className="border-t border-[#EEF1F5] px-6 py-4 text-center">
        <p className="text-xs text-muted">Indicative Exchange Rate</p>
        <p className="mt-1 text-sm font-semibold text-ink">1$=0.75£</p>
      </div>
    </div>
  );
}

function PromoCard() {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#7FB6FB] via-[#4C86EF] to-[#1B4FD1] p-7 text-white sm:min-h-[280px]">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path
            d="M2 8h12M9 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Astera Banking
      </span>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold leading-snug sm:text-[26px]">
          Send. Receive. Transact
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          With a modern account, you can send, receive, and transact across
          currencies faster, cheaper, and more easily. Instant transfers with
          transparent fees and no hidden costs or complications
        </p>
      </div>
    </div>
  );
}

function ChartCard() {
  return (
    <div className="flex flex-1 flex-col rounded-[28px] border border-[#EEF1F5] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">GBR (Pound)</p>
        <div className="flex -space-x-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-ink text-[10px] font-medium text-white">
            8
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-700 text-[10px] font-medium text-white">
            JP
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-ink">£112.00</p>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        <span className="flex items-center gap-0.5 font-medium text-positive">
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="currentColor">
            <path d="M5 1l4 6H1z" />
          </svg>
          4.2%
        </span>
        <span className="text-muted">142£</span>
      </div>

      <div className="relative mt-4 flex-1">
        <div className="pointer-events-none absolute left-[38%] top-0 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1 text-[10px] font-medium text-white">
          4:00 am
          <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-ink" />
        </div>
        <svg viewBox="0 0 220 90" className="mt-6 h-16 w-full" preserveAspectRatio="none">
          <path
            d="M0 55 C 14 60, 22 30, 36 34 S 58 66, 72 58 90 20 104 26 124 60 138 50 156 18 170 22 190 46 206 34 218 38 220 40"
            fill="none"
            stroke="#4F9BFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="84" cy="34" r="3.5" fill="#0B1C3D" />
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>Dec</span>
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span className="font-semibold text-ink">Apr</span>
        <span>May</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <div className="px-2 pb-6 pt-6 sm:px-4 sm:pb-10 sm:pt-8">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-badge-bg px-3.5 py-1.5 text-xs font-medium text-badge-text">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path
              d="M2 8h12M9 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Astera Banking
        </span>

        <h1 className="mt-5 max-w-4xl text-[36px] font-medium leading-[1.08] tracking-tight text-ink sm:mt-6 sm:text-[56px] lg:text-[76px]">
          Global. Online. Banking.
        </h1>

        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted sm:mt-5 sm:max-w-md">
          We are offers personal and business accounts that are easy to open
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-b from-blue-600 to-blue-700 py-3 pl-6 pr-3 text-sm font-medium text-white shadow-lg shadow-blue-600/25 sm:mt-7">
          Get Started
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
        <ExchangeCard />
        <PromoCard />
        <ChartCard />
      </div>
    </div>
  );
}
