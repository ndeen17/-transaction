import { Link } from "react-router-dom";
import { PANEL } from "../lib/theme";

export function PrivacyPage() {
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
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: template version</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="text-base font-semibold">1. Information we collect</h2>
            <p className="mt-2 text-muted">
              When you open an account, we collect personal details (name, date of birth, gender,
              nationality), contact information, identification documents, and employment and
              financial information, as required by banking regulations.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">2. How we use your information</h2>
            <p className="mt-2 text-muted">
              We use your information to open and manage your account, verify your identity,
              prevent fraud and money laundering, and communicate with you about your account.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">3. Data security</h2>
            <p className="mt-2 text-muted">
              We apply administrative and technical safeguards to protect your information,
              including your identification documents, against unauthorized access.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">4. Data sharing</h2>
            <p className="mt-2 text-muted">
              We do not sell your personal information. We may share it with regulators, auditors,
              and service providers as required to operate your account and comply with the law.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold">5. Your rights</h2>
            <p className="mt-2 text-muted">
              You may request access to, correction of, or deletion of your personal data, subject
              to our regulatory recordkeeping obligations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
