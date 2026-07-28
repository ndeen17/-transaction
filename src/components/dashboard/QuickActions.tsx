import { useState, type ComponentType, type SVGProps } from "react";
import { Link } from "react-router-dom";
import { BankIcon, CryptoIcon, MoreIcon, TransferIcon } from "./icons";
import { TransferSheet } from "./TransferSheet";
import { DASH_FOCUS_RING } from "./theme";

interface Action {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  to?: string;
}

const ACTIONS: Action[] = [
  { label: "Transfer", Icon: TransferIcon },
  { label: "Bank Deposit", Icon: BankIcon, to: "/dashboard/bank-deposit" },
  { label: "Crypto Deposit", Icon: CryptoIcon, to: "/dashboard/crypto-deposit" },
  { label: "Withdraw via Bank", Icon: BankIcon, to: "/dashboard/bank-withdraw" },
  { label: "Withdraw via Crypto", Icon: CryptoIcon, to: "/dashboard/crypto-withdraw" },
];

const MOBILE_VISIBLE_COUNT = 3;

const tileClassName = `group flex min-w-0 flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition-colors duration-150 ease-in-out hover:bg-[#F8FAFC] ${DASH_FOCUS_RING}`;
const tileLabelClassName = "w-full text-[11px] font-medium leading-tight text-[#111827] sm:text-xs";

function ActionIcon({ Icon }: { Icon: ComponentType<SVGProps<SVGSVGElement>> }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-badge-bg text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function ActionTile({ label, Icon, to, onOpenTransfer }: Action & { onOpenTransfer: () => void }) {
  if (!to) {
    return (
      <button type="button" onClick={onOpenTransfer} className={tileClassName}>
        <ActionIcon Icon={Icon} />
        <span className={tileLabelClassName}>{label}</span>
      </button>
    );
  }

  return (
    <Link to={to} className={tileClassName}>
      <ActionIcon Icon={Icon} />
      <span className={tileLabelClassName}>{label}</span>
    </Link>
  );
}

export function QuickActions() {
  const [expanded, setExpanded] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const primary = ACTIONS.slice(0, MOBILE_VISIBLE_COUNT);
  const rest = ACTIONS.slice(MOBILE_VISIBLE_COUNT);

  return (
    <>
      {/* Mobile / tablet: fixed row + expandable "More" */}
      <div className="lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {primary.map((action) => (
            <ActionTile key={action.label} {...action} onOpenTransfer={() => setTransferOpen(true)} />
          ))}
          <button type="button" onClick={() => setExpanded((v) => !v)} className={tileClassName}>
            <ActionIcon Icon={MoreIcon} />
            <span className={tileLabelClassName}>{expanded ? "Less" : "More"}</span>
          </button>
        </div>
        {expanded && (
          <div className="mt-2 flex gap-1">
            {rest.map((action) => (
              <ActionTile key={action.label} {...action} onOpenTransfer={() => setTransferOpen(true)} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: full row, evenly distributed */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-2">
        {ACTIONS.map((action) => (
          <ActionTile key={action.label} {...action} onOpenTransfer={() => setTransferOpen(true)} />
        ))}
      </div>

      <TransferSheet open={transferOpen} onClose={() => setTransferOpen(false)} />
    </>
  );
}
