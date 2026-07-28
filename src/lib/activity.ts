import type { BankDepositSummary, CryptoDepositSummary, TransactionSummary } from "./api";

// Builds a client-side-only TransactionSummary-shaped item from a deposit request that
// hasn't been credited yet, so it can flow through the same TransactionRow rendering as a
// real transaction on the dashboard's Recent Activity feed. Only fields TransactionRow
// actually reads are meaningful here — reference/simulated/narration/balanceAfter are
// unused placeholders.
function toActivityStatus(status: string): "pending" | "rejected" {
  return status === "rejected" ? "rejected" : "pending";
}

export function fromCryptoDeposit(d: CryptoDepositSummary): TransactionSummary {
  return {
    id: d.id,
    reference: d.reference,
    type: "crypto_deposit",
    direction: "credit",
    status: toActivityStatus(d.status),
    simulated: true,
    amount: d.amount,
    currency: d.currency,
    balanceAfter: 0,
    crypto: { symbol: d.symbol, network: d.network, amountCrypto: d.amountCrypto, address: d.address, txHash: d.txHash },
    createdAt: d.createdAt,
  };
}

export function fromBankDeposit(d: BankDepositSummary): TransactionSummary {
  return {
    id: d.id,
    reference: d.reference,
    type: "bank_deposit",
    direction: "credit",
    status: toActivityStatus(d.status),
    simulated: true,
    amount: d.amount,
    currency: d.currency,
    balanceAfter: 0,
    bankDeposit: {
      bankName: d.bankName,
      accountName: d.accountName,
      accountNumber: d.accountNumber,
      routingNumber: d.routingNumber,
    },
    createdAt: d.createdAt,
  };
}

// Not-yet-credited crypto/bank deposits route to their own status pages; everything else
// (real completed/failed Transaction docs) routes to the transaction detail page.
export function activityHref(tx: TransactionSummary): string {
  if (tx.status === "pending" || tx.status === "rejected") {
    if (tx.type === "crypto_deposit") return `/dashboard/crypto-deposits/${tx.id}`;
    if (tx.type === "bank_deposit") return `/dashboard/bank-deposits/${tx.id}`;
  }
  return `/dashboard/transactions/${tx.id}`;
}
