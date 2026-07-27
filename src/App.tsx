import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { VaultAdminPage } from "./pages/admin/VaultAdminPage";
import { VaultAdminUserPage } from "./pages/admin/VaultAdminUserPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6">
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
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/vaultadmin" element={<VaultAdminPage />} />
          <Route path="/vaultadmin/users/:id" element={<VaultAdminUserPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
