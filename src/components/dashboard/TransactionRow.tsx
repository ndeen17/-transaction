import type { TransactionSummary } from "../../lib/api";
import { formatCurrency } from "../../lib/format";
import { ArrowDownLeftIcon, ArrowUpRightIcon } from "./icons";

function relativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMin = Math.round((Date.now() - date.getTime()) / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface TransactionRowProps {
  transaction: TransactionSummary;
  onClick: () => void;
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  const isCredit = transaction.direction === "credit";
  const counterparty = transaction.recipient?.name ?? (transaction.type === "deposit" ? "Deposit" : "Transfer");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-150 ease-in-out hover:bg-[#F8FAFC] sm:px-5"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isCredit ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#F3F4F6] text-[#6B7280]"
        }`}
      >
        {isCredit ? <ArrowDownLeftIcon className="h-4 w-4" /> : <ArrowUpRightIcon className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[#111827]">{counterparty}</span>
        <span className="mt-0.5 block text-xs text-[#6B7280]">{relativeDate(transaction.createdAt)}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className={`block text-sm font-semibold tabular-nums ${isCredit ? "text-[#16A34A]" : "text-[#111827]"}`}>
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
        <span
          className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
            transaction.status === "completed" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"
          }`}
        >
          {transaction.status === "completed" ? "Completed" : "Failed"}
        </span>
      </span>
    </button>
  );
}
