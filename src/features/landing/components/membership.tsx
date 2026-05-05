import { CircleUserRound, Trophy, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    subtitle: 'For homeowners getting started',
    price: '₦9,000',
    button: 'Subscribe to Basic',
    icon: CircleUserRound,
    dark: false,
    features: [
      '1 service visit / year',
      'Priority booking access',
      '5% off all callouts',
      '24/7 phone support',
      'In-app live job tracking',
    ],
  },
  {
    name: 'Plus',
    subtitle: 'For most Nigerian homeowners',
    price: '₦19,000',
    button: 'Subscribe to Plus',
    icon: Zap,
    dark: true,
    features: [
      'Everything on basic',
      'Plumbing & electrical cover',
      '15% off all callouts',
      'Emergency priority queue',
      'Dedicated support line',
    ],
  },
  {
    name: 'Pro',
    subtitle: 'For complete peace of mind',
    price: '₦29,000',
    button: 'Subscribe to Pro',
    icon: Trophy,
    dark: false,
    features: [
      'Everything on Plus',
      'Parts & labour included',
      'Same-day guarantee',
      'Annual home inspection',
      'Dedicated account manager',
    ],
  },
];

export const Membership = () => {
  return (
    <section id="membership" className="bg-white py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="max-w-[620px]">
          <p className="text-xl font-bold text-blue-700">Pricing</p>
          <h2 className="mt-1 text-4xl font-bold text-neutral-700">
            Simple pricing, serious home cover.
          </h2>
          <p className="mt-3 text-sm leading-5 text-zinc-600">
            No hidden call-out fees. All services in every plan. Cancel anytime.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-[14px] text-[#6F7785]">
            <div className="flex -space-x-3">
              {['AO', 'FK', 'CN', 'TM', 'IB'].map((name, index) => (
                <span
                  key={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-[12px] font-bold text-[#44506A] shadow-sm"
                  style={{
                    backgroundColor: ['#DCE7FF', '#E7F8D8', '#FFEAAE', '#FFD3D3', '#E2D8FF'][index],
                    zIndex: 5 - index,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#F6A623]">★★★★★</span>
              <span className="text-[13px] font-medium">from 2,400+ happy homeowners</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <article
                key={plan.name}
                className={`relative flex min-h-[560px] flex-col rounded-xl border p-5 ${
                  plan.dark
                    ? 'border-transparent bg-[radial-gradient(circle_at_top_right,_rgba(234,111,17,0.25),_transparent_30%),linear-gradient(180deg,#241B2C_0%,#17141E_100%)] text-white scale-[1.02] z-10'
                    : 'border-[#E2E5EB] bg-white text-[#2E3645]'
                }`}
              >
                {plan.dark ? (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[14px] bg-[#F97316] px-6 py-1.5 text-[11px] font-black uppercase tracking-[1.2px] text-white">
                    Most Popular
                  </div>
                ) : null}

                <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${plan.dark ? 'bg-white text-[#1E2433]' : 'bg-[#F4F7FB] text-[#8D95A3]'}`}>
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-4xl text-2xl font-semibold tracking-tight">{plan.name}</h3>
                <p className={`mt-1 text-sm leading-5 ${plan.dark ? 'text-white/75' : 'text-[#505866]'}`}>
                  {plan.subtitle}
                </p>

                <div className="mt-10 flex items-end gap-1">
                  <span className="text-[48px] font-bold leading-none tracking-[-2px]">
                    {plan.price}
                  </span>
                  <span className={`mb-2 text-[15px] font-semibold ${plan.dark ? 'text-white/60' : 'text-[#9BA3B1]'}`}>
                    /mo
                  </span>
                </div>

                <button
                  className={`mt-8 h-[48px] w-full rounded-xl text-sm font-medium transition-all ${
                    plan.dark
                      ? 'bg-white text-brand-blue hover:bg-white/90 shadow-lg shadow-white/10'
                      : 'border-2 border-[#6B93FF] bg-white text-brand-blue hover:bg-[#F3F7FF]'
                  }`}
                >
                  {plan.button}
                </button>

                <div className="mt-10 space-y-0">
                  {plan.features.map((feature, index) => (
                    <div
                      key={feature}
                      className={`flex items-center gap-4 py-5 text-[16px] ${
                        index !== plan.features.length - 1
                          ? plan.dark
                            ? 'border-b border-white/10'
                            : 'border-b border-[#EEF1F5]'
                          : ''
                      }`}
                    >
                      <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-bold ${
                        plan.dark
                          ? 'border-[#F97316] text-[#F97316]'
                          : 'border-[#2F9E66] text-[#2F9E66]'
                      }`}>
                        ✓
                      </span>
                      <span className={`font-medium ${plan.dark ? 'text-white/90' : 'text-[#505866]'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
