import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SupportChat } from "./components/SupportChat";
import { LandingPage } from "./pages/LandingPage";
import { SignupWizard } from "./pages/signup/SignupWizard";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AccountSuspendedPage } from "./pages/AccountSuspendedPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TransferPage } from "./pages/transactions/TransferPage";
import { DepositPage } from "./pages/transactions/DepositPage";
import { TransactionsListPage } from "./pages/transactions/TransactionsListPage";
import { TransactionDetailPage } from "./pages/transactions/TransactionDetailPage";
import { CryptoDepositPage } from "./pages/transactions/CryptoDepositPage";
import { CryptoDepositsListPage } from "./pages/transactions/CryptoDepositsListPage";
import { CryptoDepositDetailPage } from "./pages/transactions/CryptoDepositDetailPage";
import { BankDepositPage } from "./pages/transactions/BankDepositPage";
import { BankDepositsListPage } from "./pages/transactions/BankDepositsListPage";
import { BankDepositDetailPage } from "./pages/transactions/BankDepositDetailPage";
import { CryptoWithdrawPage } from "./pages/transactions/CryptoWithdrawPage";
import { CryptoWithdrawalsListPage } from "./pages/transactions/CryptoWithdrawalsListPage";
import { CryptoWithdrawalDetailPage } from "./pages/transactions/CryptoWithdrawalDetailPage";
import { BankWithdrawPage } from "./pages/transactions/BankWithdrawPage";
import { BankWithdrawalsListPage } from "./pages/transactions/BankWithdrawalsListPage";
import { BankWithdrawalDetailPage } from "./pages/transactions/BankWithdrawalDetailPage";
import { VaultAdminPage } from "./pages/admin/VaultAdminPage";
import { VaultAdminUserPage } from "./pages/admin/VaultAdminUserPage";
import { VaultAdminCryptoAssetsPage } from "./pages/admin/VaultAdminCryptoAssetsPage";
import { VaultAdminCryptoDepositsPage } from "./pages/admin/VaultAdminCryptoDepositsPage";
import { VaultAdminCryptoDepositDetailPage } from "./pages/admin/VaultAdminCryptoDepositDetailPage";
import { VaultAdminBankAccountsPage } from "./pages/admin/VaultAdminBankAccountsPage";
import { VaultAdminBankDepositsPage } from "./pages/admin/VaultAdminBankDepositsPage";
import { VaultAdminBankDepositDetailPage } from "./pages/admin/VaultAdminBankDepositDetailPage";
import { VaultAdminCryptoWithdrawalsPage } from "./pages/admin/VaultAdminCryptoWithdrawalsPage";
import { VaultAdminCryptoWithdrawalDetailPage } from "./pages/admin/VaultAdminCryptoWithdrawalDetailPage";
import { VaultAdminBankWithdrawalsPage } from "./pages/admin/VaultAdminBankWithdrawalsPage";
import { VaultAdminBankWithdrawalDetailPage } from "./pages/admin/VaultAdminBankWithdrawalDetailPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6">
        <SupportChat />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupWizard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account-suspended" element={<AccountSuspendedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/send" element={<TransferPage />} />
          <Route path="/dashboard/deposit" element={<DepositPage />} />
          <Route path="/dashboard/transactions" element={<TransactionsListPage />} />
          <Route path="/dashboard/transactions/:id" element={<TransactionDetailPage />} />
          <Route path="/dashboard/crypto-deposit" element={<CryptoDepositPage />} />
          <Route path="/dashboard/crypto-deposits" element={<CryptoDepositsListPage />} />
          <Route path="/dashboard/crypto-deposits/:id" element={<CryptoDepositDetailPage />} />
          <Route path="/dashboard/bank-deposit" element={<BankDepositPage />} />
          <Route path="/dashboard/bank-deposits" element={<BankDepositsListPage />} />
          <Route path="/dashboard/bank-deposits/:id" element={<BankDepositDetailPage />} />
          <Route path="/dashboard/crypto-withdraw" element={<CryptoWithdrawPage />} />
          <Route path="/dashboard/crypto-withdrawals" element={<CryptoWithdrawalsListPage />} />
          <Route path="/dashboard/crypto-withdrawals/:id" element={<CryptoWithdrawalDetailPage />} />
          <Route path="/dashboard/bank-withdraw" element={<BankWithdrawPage />} />
          <Route path="/dashboard/bank-withdrawals" element={<BankWithdrawalsListPage />} />
          <Route path="/dashboard/bank-withdrawals/:id" element={<BankWithdrawalDetailPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/vaultadmin" element={<VaultAdminPage />} />
          <Route path="/vaultadmin/users/:id" element={<VaultAdminUserPage />} />
          <Route path="/vaultadmin/crypto-assets" element={<VaultAdminCryptoAssetsPage />} />
          <Route path="/vaultadmin/crypto-deposits" element={<VaultAdminCryptoDepositsPage />} />
          <Route path="/vaultadmin/crypto-deposits/:id" element={<VaultAdminCryptoDepositDetailPage />} />
          <Route path="/vaultadmin/bank-accounts" element={<VaultAdminBankAccountsPage />} />
          <Route path="/vaultadmin/bank-deposits" element={<VaultAdminBankDepositsPage />} />
          <Route path="/vaultadmin/bank-deposits/:id" element={<VaultAdminBankDepositDetailPage />} />
          <Route path="/vaultadmin/crypto-withdrawals" element={<VaultAdminCryptoWithdrawalsPage />} />
          <Route path="/vaultadmin/crypto-withdrawals/:id" element={<VaultAdminCryptoWithdrawalDetailPage />} />
          <Route path="/vaultadmin/bank-withdrawals" element={<VaultAdminBankWithdrawalsPage />} />
          <Route path="/vaultadmin/bank-withdrawals/:id" element={<VaultAdminBankWithdrawalDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
