import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ArrowRightIcon } from "./icons";

interface FooterLink {
  label: string;
  href?: string;
  to?: string;
}

const COMPANY_LINKS: FooterLink[] = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "How To", href: "#why-choose-us" },
];

const SUPPORT_LINKS: FooterLink[] = [
  { label: "FAQ", href: "#faq" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = "text-sm text-white/75 transition-colors hover:text-white";
  if (link.to) {
    return (
      <Link to={link.to} className={className}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#EAF3FF] via-[#9DC4FB] to-[#4F8CF0] p-6 shadow-[0_20px_50px_-32px_rgba(16,24,40,0.35)] sm:rounded-[32px] sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.45),transparent_55%)]" />

      <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo markClassName="h-8 w-auto" textClassName="text-base text-white" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
            Astera Banking helps individuals and businesses send, receive, and exchange
            currencies faster, cheaper, and with full transparency.
          </p>
        </div>

        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Support" links={SUPPORT_LINKS} />

        <div>
          <h3 className="text-sm font-semibold text-white">Get started</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Open a personal or business account in minutes.
          </p>
          <Link
            to="/signup"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white py-2.5 pl-4 pr-2 text-sm font-medium text-ink"
          >
            Sign up
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10">
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>

      <div className="relative mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/25 pt-6 sm:flex-row">
        <p className="text-xs text-white/70">© {year} Astera Banking. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/terms" className="text-xs text-white/70 hover:text-white">
            Terms
          </Link>
          <Link to="/privacy" className="text-xs text-white/70 hover:text-white">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
