import {
  FlagChSaudi,
  FlagEU,
  FlagGermany,
  FlagJapan,
  FlagLebanon,
  FlagNorway,
  FlagSaudi,
  FlagSouthAfrica,
  FlagSweden,
  FlagTurkey,
  FlagUK,
  FlagUSA,
  FlagUkraine,
} from "./flags";
import {
  BitcoinIcon,
  CheckCircleIcon,
  DollarIcon,
  LockIcon,
  PoundIcon,
} from "./icons";

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-[28px] bg-[#F6F8FB] p-6">
      {children}
    </div>
  );
}

function CardCaption({ title, body }: { title?: string; body?: string }) {
  if (!title) return <div className="mt-auto" />;
  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {body && <p className="mx-auto mt-1.5 max-w-[220px] text-sm text-muted">{body}</p>}
    </div>
  );
}

const LEDGER_ROWS = [
  { Flag: FlagUK, title: "Transaction fee", subtitle: "Bank charges", amount: "-3.45£", tone: "warn" as const },
  { Flag: FlagEU, title: "Euro", subtitle: "European euro", amount: "+250.00€", tone: "positive" as const },
  { Flag: FlagUSA, title: "Transaction fee", subtitle: "Bank charges", amount: "-1.45$", tone: "warn" as const },
  { Flag: FlagUSA, title: "Dollar", subtitle: "American dollar", amount: "-100.45$", tone: "danger" as const },
];

const amountTone: Record<string, string> = {
  positive: "text-positive",
  warn: "text-[#F5943D]",
  danger: "text-[#F2555A]",
};

export function LowFeesCard() {
  return (
    <CardShell>
      <div className="rounded-2xl border border-[#EEF1F5] bg-white p-4">
        <div className="flex items-center justify-between border-b border-[#EEF1F5] pb-3">
          <div className="flex items-center gap-2.5">
            <img
              src="https://i.pravatar.cc/48?img=13"
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-xs text-muted">Main account</p>
              <p className="text-sm font-semibold text-ink">$1,464.09</p>
            </div>
          </div>
          <svg viewBox="0 0 12 8" className="h-2 w-3 text-muted" fill="none">
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>

        <ul className="divide-y divide-[#F3F5F8]">
          {LEDGER_ROWS.map(({ Flag, title, subtitle, amount, tone }, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5">
                <Flag className="h-7 w-7 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[13px] font-medium text-ink">{title}</p>
                  <p className="text-xs text-muted">{subtitle}</p>
                </div>
              </div>
              <span className={`text-[13px] font-semibold ${amountTone[tone]}`}>{amount}</span>
            </li>
          ))}
        </ul>
      </div>

      <CardCaption
        title="Low Fees"
        body="Enjoy competitive rates and transparent pricing, with no hidden charges"
      />
    </CardShell>
  );
}

const TAGS: { label: string; align: "start" | "center" | "end" }[] = [
  { label: "FastTransfers", align: "center" },
  { label: "SecureTransactions", align: "end" },
  { label: "CrossBorderTransactions", align: "start" },
  { label: "GlobalFinance", align: "center" },
  { label: "FastTransfers", align: "start" },
  { label: "EfficientPayments", align: "end" },
  { label: "FinancialFreedom", align: "center" },
];

const alignClass: Record<string, string> = {
  start: "self-start",
  center: "self-center",
  end: "self-end",
};

export function TagsCard() {
  return (
    <CardShell>
      <div className="flex flex-1 flex-col justify-center gap-3 py-2">
        {TAGS.map((tag, i) => (
          <span
            key={i}
            className={`inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-[0_6px_16px_-8px_rgba(16,24,40,0.15)] ${alignClass[tag.align]}`}
          >
            <CheckCircleIcon className="h-4 w-4 shrink-0" />
            {tag.label}
          </span>
        ))}
      </div>
      <CardCaption />
    </CardShell>
  );
}

const CURRENCY_FLAGS = [
  FlagChSaudi,
  FlagSaudi,
  FlagNorway,
  FlagSweden,
  FlagUSA,
  FlagLebanon,
  FlagTurkey,
  FlagEU,
  FlagGermany,
  FlagSouthAfrica,
  FlagJapan,
  FlagUkraine,
];

export function MultiCurrencyCard() {
  return (
    <CardShell>
      <div className="grid flex-1 grid-cols-3 place-items-center gap-4 py-2">
        {CURRENCY_FLAGS.map((Flag, i) => (
          <Flag key={i} className="h-11 w-11 shadow-[0_4px_10px_-4px_rgba(16,24,40,0.25)] rounded-full" />
        ))}
      </div>
      <CardCaption
        title="Multi-Currency Support"
        body="Manage multiple currencies from one account with ease"
      />
    </CardShell>
  );
}

export function InstantTransfersMapCard() {
  return (
    <CardShell>
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        <svg viewBox="0 0 340 220" className="h-[180px] w-full">
          <g stroke="#BFD7FB" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, r) =>
              Array.from({ length: 15 }).map((_, c) => {
                const x = 10 + c * 22 + (r % 2 === 0 ? 0 : 11);
                const y = 10 + r * 22;
                const on = (r * 13 + c * 7) % 5 !== 0;
                return on ? <circle key={`${r}-${c}`} cx={x} cy={y} r="1.6" fill="#BFD7FB" /> : null;
              }),
            )}
          </g>
          <path
            d="M60 150 C 120 90, 180 140, 260 60"
            fill="none"
            stroke="#4F9BFF"
            strokeWidth="1.6"
            strokeDasharray="1 6"
            strokeLinecap="round"
          />
          <circle cx="60" cy="150" r="4" fill="#1B4FD1" />
          <circle cx="260" cy="60" r="4" fill="#1B4FD1" />
        </svg>

        <div className="absolute right-1 top-2 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_8px_20px_-8px_rgba(16,24,40,0.25)]">
          <FlagUK className="h-7 w-7 shrink-0" />
          <div className="leading-tight">
            <p className="text-[10px] text-muted">Bank transfer</p>
            <p className="text-[10px] text-muted/70">AccountXxnfig</p>
          </div>
          <span className="text-xs font-semibold text-positive">+350.85€</span>
        </div>

        <div className="absolute bottom-2 left-1 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_8px_20px_-8px_rgba(16,24,40,0.25)]">
          <FlagUSA className="h-7 w-7 shrink-0" />
          <div className="leading-tight">
            <p className="text-[10px] text-muted">Bank transfer</p>
            <p className="text-[10px] text-muted/70">AccountXxnfig</p>
          </div>
          <span className="text-xs font-semibold text-positive">+350.85$</span>
        </div>
      </div>

      <CardCaption
        title="Instant Transfers"
        body="Exchange and send currencies across borders in seconds"
      />
    </CardShell>
  );
}

export function InstantTransfersProcessingCard() {
  return (
    <CardShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-2">
        <div className="flex w-fit items-center gap-2 self-start rounded-full bg-white px-3 py-2 shadow-[0_6px_16px_-8px_rgba(16,24,40,0.15)]">
          <FlagEU className="h-7 w-7 shrink-0" />
          <div className="leading-tight">
            <p className="text-[10px] text-muted">In processing...</p>
            <p className="text-xs font-semibold text-ink">$1,464.09</p>
          </div>
        </div>

        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#E4ECFB" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#4F9BFF"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * 0.32}
            />
          </svg>
          <span className="flex gap-1">
            <i className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <i className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <i className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 4.5V8l2.4 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          2 sec...
        </p>
      </div>

      <CardCaption
        title="Instant Transfers"
        body="Exchange and send currencies across borders in seconds"
      />
    </CardShell>
  );
}

export function SecureTransactionsCard() {
  return (
    <CardShell>
      <div className="relative flex flex-1 items-center justify-center py-4">
        <div className="absolute h-40 w-40 rounded-full border border-[#DCE7FB]" />
        <div className="absolute h-28 w-28 rounded-full border border-[#DCE7FB]" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7FB6FB] to-blue-700 shadow-[0_10px_24px_-8px_rgba(27,79,209,0.55)]">
          <LockIcon className="h-7 w-7" />
        </div>

        <BitcoinIcon className="absolute right-4 top-2 h-8 w-8 drop-shadow" />
        <DollarIcon className="absolute bottom-2 left-6 h-7 w-7 drop-shadow" />
        <PoundIcon className="absolute bottom-6 right-2 h-6 w-6 drop-shadow" />
      </div>

      <CardCaption
        title="Secure Transactions"
        body="Advanced encryption and security protocols keep your money and data safe"
      />
    </CardShell>
  );
}
