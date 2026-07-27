import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockIcon } from "../components/icons";
import { Button } from "../components/ui/Button";
import { WizardPanel } from "../components/ui/WizardPanel";
import { Logo } from "../components/Logo";

export function AccountSuspendedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }, []);

  return (
    <div className="mx-auto max-w-[480px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <WizardPanel>
        <div className="text-center">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDEEEE] text-[#F2555A]">
              <LockIcon className="h-8 w-8" />
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
            Your account has been suspended
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Your account is currently under review and you won't be able to log in while
            this is in place. If you believe this is a mistake, please contact support.
          </p>

          <div className="mt-8 flex justify-center">
            <Button type="button" variant="secondary" onClick={() => navigate("/login")}>
              Back to login
            </Button>
          </div>
        </div>
      </WizardPanel>
    </div>
  );
}
