import { AboutIllustration } from "./AboutIllustration";
import { ArrowRightIcon } from "./icons";

export function AboutUs() {
  return (
    <div id="about" className="grid grid-cols-1 gap-5 p-2 sm:p-4 lg:grid-cols-2">
      <div className="flex flex-col justify-center rounded-[28px] bg-white p-8 sm:p-12">
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

        <button className="mt-8 flex w-fit items-center gap-2 rounded-full bg-ink py-3 pl-6 pr-3 text-sm font-medium text-white">
          Get Started
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </button>
      </div>

      <div className="min-h-[380px] overflow-hidden rounded-[28px] bg-[#EAF3FF] sm:min-h-[460px]">
        <AboutIllustration />
      </div>
    </div>
  );
}
