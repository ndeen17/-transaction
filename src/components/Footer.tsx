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
  const className = "text-sm text-muted transition-colors hover:text-ink";
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
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
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

export function Footer({ panelClass }: { panelClass: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`${panelClass} p-6 sm:p-10`}>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo markClassName="h-8 w-auto" textClassName="text-base" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Astera Banking helps individuals and businesses send, receive, and exchange
            currencies faster, cheaper, and with full transparency.
          </p>
        </div>

        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Support" links={SUPPORT_LINKS} />

        <div>
          <h3 className="text-sm font-semibold text-ink">Get started</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Open a personal or business account in minutes.
          </p>
          <Link
            to="/signup"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink py-2.5 pl-4 pr-2 text-sm font-medium text-white"
          >
            Sign up
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#EEF1F5] pt-6 sm:flex-row">
        <p className="text-xs text-muted">© {year} Astera Banking. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/terms" className="text-xs text-muted hover:text-ink">
            Terms
          </Link>
          <Link to="/privacy" className="text-xs text-muted hover:text-ink">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
