import { Navigate, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { WizardPanel } from "../components/ui/WizardPanel";

interface StoredUser {
  firstName: string;
  loginId: string;
  accountType: string;
  kycReviewStatus: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const rawUser = localStorage.getItem("authUser");

  if (!token || !rawUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(rawUser) as StoredUser;

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-sm font-medium text-ink">Currency Exchange</span>
        <button type="button" onClick={handleLogout} className="text-sm text-muted hover:text-ink">
          Log out
        </button>
      </div>

      <WizardPanel>
        <div className="py-10 text-center">
          <div className="flex justify-center">
            <Badge>Dashboard</Badge>
          </div>
          <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
            Welcome, {user.firstName}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Login ID <span className="font-medium text-ink">{user.loginId}</span> ·{" "}
            {user.accountType === "savings" ? "Savings Account" : "Current / Checking Account"}
          </p>

          <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-dashed border-[#D6DBE3] bg-[#F6F8FB] px-6 py-10">
            <p className="text-lg font-semibold text-ink">Dashboard coming soon</p>
            <p className="mt-2 text-sm text-muted">
              We're building your account overview, transfers, and statements.
            </p>
          </div>

          <p className="mt-6 text-xs text-muted">
            Identity review status: <span className="font-medium text-ink">{user.kycReviewStatus}</span>
          </p>

          <div className="mt-8 flex justify-center">
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </WizardPanel>
    </div>
  );
}
