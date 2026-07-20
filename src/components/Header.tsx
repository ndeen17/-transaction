import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, GlobeIcon } from "./icons";

const NAV_LINKS = [
  { label: "Home", active: true },
  { label: "About Us", active: false },
  { label: "How To", active: false },
  { label: "Faq", active: false },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
      {open ? (
        <path
          d="M5 5l10 10M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 5.5h14M3 10h14M3 14.5h14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative">
      <div className="flex items-center justify-between px-2 py-2 sm:px-4">
        <span className="text-[15px] font-medium tracking-tight text-ink">
          Currency Exchange
        </span>

        <nav className="hidden items-center gap-1 rounded-full bg-[#F4F6F9] p-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                link.active
                  ? "bg-white text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink md:flex">
            <GlobeIcon className="h-4 w-4" />
            English
          </button>
          <button className="hidden text-sm text-ink md:inline-block">Log in</button>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 rounded-full bg-blue-600 py-2 pl-4 pr-2 text-sm font-medium text-white"
          >
            Sign up
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF1F5] text-ink md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-2 mb-2 flex flex-col gap-1 rounded-2xl border border-[#EEF1F5] bg-[#F9FAFC] p-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`rounded-xl px-4 py-2.5 text-sm ${
                link.active ? "bg-white font-medium text-ink shadow-sm" : "text-muted"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-[#EEF1F5] px-4 pt-3">
            <button className="flex items-center gap-1.5 text-sm text-ink">
              <GlobeIcon className="h-4 w-4" />
              English
            </button>
            <button className="text-sm text-ink">Log in</button>
          </div>
        </nav>
      )}
    </header>
  );
}
