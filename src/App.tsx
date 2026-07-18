import { AboutUs } from "./components/AboutUs";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { WhyChooseUs } from "./components/WhyChooseUs";

function App() {
  return (
    <div className="min-h-screen bg-page px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5">
        <div className="rounded-[32px] bg-white p-3 sm:p-5">
          <Header />
          <Hero />
          <TrustBar />
        </div>

        <AboutUs />

        <div className="p-2 sm:p-4">
          <WhyChooseUs />
        </div>
      </div>
    </div>
  );
}

export default App;
