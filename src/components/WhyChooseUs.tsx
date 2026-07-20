import {
  InstantTransfersMapCard,
  InstantTransfersProcessingCard,
  LowFeesCard,
  MultiCurrencyCard,
  SecureTransactionsCard,
  TagsCard,
} from "./FeatureCards";

export function WhyChooseUs({ panelClass }: { panelClass: string }) {
  return (
    <div className={`${panelClass} p-5 sm:p-10`}>
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex w-fit items-center rounded-full bg-badge-bg px-3.5 py-1.5 text-xs font-medium text-badge-text">
          Features
        </span>
        <h2 className="mt-5 text-[32px] font-medium tracking-tight text-ink sm:mt-6 sm:text-4xl lg:text-[44px]">
          Why Choose Us?
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Discover why thousands of users trust our platform for fast and
          secure currency exchanges
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
        <LowFeesCard />
        <TagsCard />
        <MultiCurrencyCard />
        <InstantTransfersMapCard />
        <InstantTransfersProcessingCard />
        <SecureTransactionsCard />
      </div>
    </div>
  );
}
