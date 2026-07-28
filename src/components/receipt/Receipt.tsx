import { forwardRef } from "react";
import type { TransactionSummary } from "../../lib/api";
import { formatCurrency, maskAccountNumber } from "../../lib/format";

interface ReceiptProps {
  transaction: TransactionSummary;
  accountHolderName: string;
  accountNumber: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(function Receipt(
  { transaction, accountHolderName, accountNumber },
  ref,
) {
  const isCredit = transaction.direction === "credit";
  const createdAt = new Date(transaction.createdAt);
  const isCompleted = transaction.status === "completed";

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[420px] rounded-[20px] border border-[#E5E7EB] bg-white p-6 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold tracking-tight text-[#0B0B0F]">Vaulto Hub</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
            isCompleted ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"
          }`}
        >
          {isCompleted ? "Completed" : "Failed"}
        </span>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B7280]">
          {isCredit ? "Amount received" : "Amount sent"}
        </p>
        <p className="mt-2 text-[34px] font-bold tracking-tight text-[#111827]">
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </div>

      <div className="mt-8 space-y-3.5 border-t border-[#E5E7EB] pt-5">
        <Row label="Reference" value={transaction.reference} mono />
        <Row
          label="Date"
          value={createdAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        />
        <Row
          label="Type"
          value={
            transaction.type === "transfer"
              ? "Transfer"
              : transaction.type === "deposit"
                ? "Deposit"
                : transaction.type === "crypto_deposit"
                  ? "Crypto Deposit"
                  : transaction.type === "bank_deposit"
                    ? "Bank Deposit"
                    : "Balance adjustment"
          }
        />
        <Row label="From" value={`${accountHolderName} (${maskAccountNumber(accountNumber)})`} />
        {transaction.recipient && (
          <>
            <Row label="To" value={transaction.recipient.name} />
            <Row label="Bank" value={transaction.recipient.bankName} />
            <Row label="Account number" value={transaction.recipient.accountNumber} />
          </>
        )}
        {transaction.crypto && (
          <>
            <Row
              label="Asset"
              value={
                transaction.crypto.network
                  ? `${transaction.crypto.symbol} (${transaction.crypto.network})`
                  : transaction.crypto.symbol
              }
            />
            <Row label="Amount sent" value={`${transaction.crypto.amountCrypto} ${transaction.crypto.symbol}`} />
            <Row label="Address" value={transaction.crypto.address} mono />
            {transaction.crypto.txHash && <Row label="Transaction hash" value={transaction.crypto.txHash} mono />}
          </>
        )}
        {transaction.bankDeposit && (
          <>
            <Row label="Bank" value={transaction.bankDeposit.bankName} />
            <Row label="Account name" value={transaction.bankDeposit.accountName} />
            <Row label="Account number" value={transaction.bankDeposit.accountNumber} mono />
            {transaction.bankDeposit.routingNumber && (
              <Row label="Routing number" value={transaction.bankDeposit.routingNumber} mono />
            )}
          </>
        )}
        {transaction.narration && <Row label="Narration" value={transaction.narration} />}
        <Row label="Balance after" value={formatCurrency(transaction.balanceAfter, transaction.currency)} />
      </div>
    </div>
  );
});

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-[#6B7280]">{label}</span>
      <span className={`text-right text-sm font-medium text-[#111827] ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
