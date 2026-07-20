import { Link } from "react-router-dom";
import { AboutPhoto } from "./AboutPhoto";
import { ArrowRightIcon } from "./icons";

export function AboutUs({ panelClass }: { panelClass: string }) {
  return (
    <div id="about" className="grid grid-cols-1 gap-4 p-2 sm:gap-5 sm:p-4 lg:grid-cols-2">
      <div className={`${panelClass} flex flex-col justify-center p-6 sm:p-10 lg:p-12`}>
        <span className="inline-flex w-fit items-center rounded-full bg-badge-bg px-3.5 py-1.5 text-xs font-medium text-badge-text">
          About us
        </span>

        <h2 className="mt-6 text-4xl font-medium tracking-tight text-ink sm:text-[44px]">
          Who We Are?
        </h2>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
          We're a global platform dedicated to simplifying currency exchange
          and cross-border transactions. Our mission is to provide
          individuals and businesses with an efficient, cost-effective, and
          secure way to manage their international finances. Trusted by
          thousands of users worldwide, we strive to make global business as
          seamless as local
        </p>

        <Link
          to="/signup"
          className="mt-8 flex w-fit items-center gap-2 rounded-full bg-ink py-3 pl-6 pr-3 text-sm font-medium text-white"
        >
          Get Started
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="min-h-[300px] overflow-hidden rounded-[24px] sm:min-h-[380px] sm:rounded-[32px] lg:min-h-[460px]">
        <AboutPhoto />
      </div>
    </div>
  );
}
