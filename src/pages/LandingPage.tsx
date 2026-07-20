import { AboutUs } from "../components/AboutUs";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { PANEL } from "../lib/theme";

export function LandingPage() {
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-4 sm:gap-5">
      <div className={`${PANEL} p-3 sm:p-5`}>
        <Header />
        <Hero />
        <TrustBar />
      </div>

      <AboutUs panelClass={PANEL} />

      <div className="p-2 sm:p-4">
        <WhyChooseUs panelClass={PANEL} />
      </div>
    </div>
  );
}
