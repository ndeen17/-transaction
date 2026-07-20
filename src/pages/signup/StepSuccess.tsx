import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function StepSuccess({ firstName, loginId }: { firstName: string; loginId: string }) {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-positive/10 text-positive">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
            <path
              d="M5 12.5 10 17l9-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <h1 className="mt-5 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
        Account successfully created
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Welcome, {firstName}. Your login ID is{" "}
        <span className="font-medium text-ink">{loginId}</span>. You're now signed in.
      </p>

      <div className="mt-8 flex justify-center">
        <Button type="button" onClick={() => navigate("/dashboard")} withArrow>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
