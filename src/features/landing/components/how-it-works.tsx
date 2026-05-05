const steps = [
  {
    title: "Tell us what's wrong",
    description:
      'Pick your service, describe the issue, and choose your urgency.',
    background: 'bg-[linear-gradient(180deg,#DEE8FB_0%,#D5E2FB_100%)]',
    mock: 'blank',
  },
  {
    title: 'We find your engineer',
    description:
      'We instantly match you with the nearest certified technician. Track their arrival.',
    background: 'bg-[linear-gradient(180deg,#E5F7EC_0%,#D5F6EA_100%)]',
    mock: 'match',
  },
  {
    title: 'Problem solved, pay done',
    description:
      'The technician fixes the issue, you review the invoice, and pay securely online.',
    background: 'bg-[linear-gradient(180deg,#DFE7FD_0%,#D9E2FB_100%)]',
    mock: 'invoice',
  },
];

function StepMock({ type }: { type: string }) {
  if (type === 'match') {
    return (
      <div className="mx-auto mt-12 w-[255px] rounded-[18px] bg-white p-4 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <span className="rounded-full bg-[#E8FFF4] px-3 py-1 text-[12px] font-semibold text-[#27BA88]">
          • Engineer matched!
        </span>
        <div className="mt-4 rounded-[16px] bg-[#F5F7FB] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3C73EA] text-[16px] font-bold text-white">
                JA
              </div>
              <div className="text-left">
                <div className="text-[16px] font-semibold text-[#374151]">James A.</div>
                <div className="text-[12px] text-[#8D95A3]">Plumber · ★4.9 · 2.3 km</div>
              </div>
            </div>
            <div className="text-right text-[12px]">
              <div className="font-semibold text-[#27324A]">45 min</div>
              <div className="text-[#8D95A3]">ETA</div>
            </div>
          </div>
        </div>
        <div className="mt-5 text-[12px] text-[#8D95A3]">Engineer en route...</div>
        <div className="mt-2 h-2 rounded-full bg-[#E3E8F0]">
          <div className="h-2 w-[58%] rounded-full bg-[#2AC38B]" />
        </div>
      </div>
    );
  }

  if (type === 'invoice') {
    return (
      <div className="mx-auto mt-10 w-[255px] rounded-[18px] bg-white p-5 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <div className="text-[14px] font-semibold text-[#27BA88]">✓ Job Complete</div>
        <div className="mt-5 space-y-2 text-[14px] text-[#8D95A3]">
          <div className="flex items-center justify-between">
            <span>Labour</span>
            <span className="font-semibold text-[#374151]">$45.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Parts</span>
            <span className="font-semibold text-[#374151]">$12.00</span>
          </div>
          <div className="mt-2 border-t border-[#E8EBF1] pt-3 flex items-center justify-between">
            <span className="font-semibold text-[#374151]">Total</span>
            <span className="font-bold text-brand-blue">$57.00</span>
          </div>
        </div>
        <div className="mt-6 text-center text-[#F6A623]">★ ★ ★ ★ ★</div>
      </div>
    );
  }

  return <div className="mx-auto mt-8 h-[220px] w-[255px] rounded-[18px] bg-[#D8E4FB]" />;
}

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="max-w-[620px]">
          <p className="text-xl font-bold text-blue-700">How it works</p>
          <h2 className="mt-1 text-4xl font-bold text-slate-800">
            How Resolv Works
          </h2>
          <p className="mt-3 max-w-[560px] text-base leading-6 text-zinc-600">
            From burst pipes to faulty wiring book a vetted, certified engineer in
            under 60 seconds and track their arrival in real time.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="overflow-hidden rounded-3xl bg-stone-50"
            >
              <div className={`min-h-[320px] px-8 pt-10 ${step.background}`}>
                <StepMock type={step.mock} />
              </div>
              <div className="px-8 pb-10 pt-8">
                <h3 className="text-[32px] text-xl leading-8 font-semibold text-neutral-700">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-6 text-zinc-600">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
