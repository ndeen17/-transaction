import { Link } from "react-router-dom";
import type { TransactionSummary } from "../../lib/api";
import { TransactionRow } from "./TransactionRow";

interface RecentActivityProps {
  transactions: TransactionSummary[];
  onSelect: (id: string) => void;
}

export function RecentActivity({ transactions, onSelect }: RecentActivityProps) {
  return (
    <div>
      <div className="divide-y divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB]">
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} onClick={() => onSelect(tx.id)} />
        ))}
      </div>
      <div className="mt-3 text-right">
        <Link to="/dashboard/transactions" className="text-xs font-medium text-blue-600 hover:underline">
          See all
        </Link>
      </div>
    </div>
  );
}
