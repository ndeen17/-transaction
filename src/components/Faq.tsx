const FAQS = [
  {
    question: "How long does it take to open an account?",
    answer:
      "Signing up takes just a few minutes. Once you submit your identification document, our team typically completes identity verification within 24 hours.",
  },
  {
    question: "What documents do I need to sign up?",
    answer:
      "A valid government-issued photo ID — a passport, driver's license, or national ID card — along with your basic personal and contact details.",
  },
  {
    question: "Is my money and personal data secure?",
    answer:
      "Yes. We use advanced encryption and security protocols to protect your funds and data, and your identification documents are stored securely and only used for verification.",
  },
  {
    question: "Which currencies can I hold and exchange?",
    answer:
      "You can manage multiple currencies from one account and exchange between them at transparent, competitive rates with no hidden charges.",
  },
  {
    question: "What does it cost to send or exchange money?",
    answer:
      "Our fees are low and shown upfront before you confirm any transfer or exchange, so there are never any surprise charges.",
  },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" fill="none">
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Faq({ panelClass }: { panelClass: string }) {
  return (
    <div id="faq" className={`${panelClass} p-5 sm:p-10`}>
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex w-fit items-center rounded-full bg-badge-bg px-3.5 py-1.5 text-xs font-medium text-badge-text">
          Faq
        </span>
        <h2 className="mt-5 text-[32px] font-medium tracking-tight text-ink sm:mt-6 sm:text-4xl lg:text-[44px]">
          Frequently asked questions
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Can't find the answer you're looking for? Reach out to our support team any time.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-3 sm:mt-10">
        {FAQS.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-[#EEF1F5] bg-white px-5 py-4 open:bg-[#F6F8FB]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink marker:content-none">
              {item.question}
              <ChevronIcon />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
