import { Link } from "react-router-dom";
import { PANEL } from "../lib/theme";

export function TermsPage() {
  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-4 px-1">
        <Link to="/" className="text-sm font-medium text-ink">
          Currency Exchange
        </Link>
      </div>

      <div className={`${PANEL} p-6 sm:p-10`}>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Placeholder document — replace with reviewed legal copy before launch
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-muted">Last updated: template version</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="text-base font-semibold">1. Acceptance of terms</h2>
            <p className="mt-2 text-muted">
              By creating an account with Currency Exchange, you agree to be bound by these Terms
              and Conditions and all applicable laws and regulations governing the provision of
              banking and currency exchange services.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">2. Eligibility</h2>
            <p className="mt-2 text-muted">
              You must be at least 18 years old and able to form a legally binding contract to open
              an account. You agree to provide accurate, current, and complete information during
              signup and to keep it updated.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">3. Account verification</h2>
            <p className="mt-2 text-muted">
              We are required to verify your identity before your account is fully activated. We
              may request additional documentation at any time to comply with know-your-customer
              (KYC) and anti-money laundering (AML) obligations.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">4. Fees</h2>
            <p className="mt-2 text-muted">
              Applicable fees for transfers, currency exchange, and account maintenance will be
              disclosed to you before you confirm a transaction.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">5. Termination</h2>
            <p className="mt-2 text-muted">
              We may suspend or close your account if we reasonably believe you have violated these
              terms or applicable law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
