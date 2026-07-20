import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

export function StepAccountVerification({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-badge-bg text-blue-600">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <div className="mt-4 flex justify-center">
        <Badge>Identity review</Badge>
      </div>
      <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
        Your account is under review
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Your email is verified. Our team is now reviewing the identification document you
        submitted — this usually takes about 24 hours. We'll notify you by email once it's
        approved.
      </p>

      <div className="mt-8 flex justify-center">
        <Button type="button" onClick={onContinue} withArrow>
          Continue
        </Button>
      </div>
    </div>
  );
}
