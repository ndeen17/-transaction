import { ArrowRightIcon, GlobeIcon } from "./icons";

const NAV_LINKS = [
  { label: "Home", active: true },
  { label: "About Us", active: false },
  { label: "How To", active: false },
  { label: "Faq", active: false },
];

export function Header() {
  return (
    <header className="flex items-center justify-between px-2 py-2 sm:px-4">
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
        <button className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink sm:flex">
          <GlobeIcon className="h-4 w-4" />
          English
        </button>
        <button className="hidden text-sm text-ink sm:inline-block">Log in</button>
        <button className="flex items-center gap-1.5 rounded-full bg-blue-600 py-2 pl-4 pr-2 text-sm font-medium text-white">
          Sign up
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </header>
  );
}
