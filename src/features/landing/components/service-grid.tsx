import { Clock3, MapPin, ShieldCheck } from 'lucide-react';

const services = [
  {
    label: 'PLUMBING',
    labelClass: 'bg-[#3F3F46] text-white',
    title: 'Pipes & leaks sorted in minutes.',
    description:
      'No guesswork. Verified plumbers show up ready to solve leaks, blockages, and pressure issues.',
    mock: 'plumbing',
  },
  {
    label: 'ELECTRICAL',
    labelClass: 'bg-[#3F3F46] text-white',
    title: 'Safe wiring, done right.',
    description:
      'Certified electricians handle faults, installations, and inspections, done right the first time.',
    mock: 'electrical',
  },
  {
    label: 'HEATING & AC',
    labelClass: 'bg-[#3F3F46] text-white',
    title: 'Cool summers, warm winters. HVAC Solutions',
    description:
      "From AC maintenance to full HVAC system repairs, we've got you covered for every season.",
    mock: 'hvac',
  },
  {
    label: '24/7 EMERGENCY',
    labelClass: 'bg-[#FF3B30] text-white',
    title: 'Engineer at your door in minutes.',
    description:
      'Emergency requests are prioritised and dispatched instantly with live tracking for total peace of mind.',
    mock: 'emergency',
  },
];

function ServiceMock({ type }: { type: string }) {
  if (type === 'plumbing') {
    return (
      <div className="mx-auto mt-auto w-full max-w-[350px]">
        <div className="rounded-[20px] bg-white p-5 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3C73EA] text-[18px] font-bold text-white">
                JA
              </div>
              <div>
                <div className="text-[18px] font-semibold text-[#374151]">James A.</div>
                <div className="text-[14px] text-[#8D95A3]">Certified Plumber · Lagos</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[16px] font-semibold text-[#414B5A]">
              <span className="text-[#F6A623]">★</span>4.9
            </div>
          </div>

          <div className="mt-4 h-px bg-[#E8EBF1]" />

          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-[#E8FFF4] px-3 py-1 text-[12px] font-semibold text-[#27BA88]">
              Available now
            </span>
            <span className="flex items-center gap-1 text-[14px] text-[#8E97A5]">
              <Clock3 className="h-4 w-4" />
              45 min ETA
            </span>
          </div>
        </div>

        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[15px] font-semibold text-[#667085] shadow-sm">
          <MapPin className="h-4 w-4 text-[#8E97A5]" />
          3.2 km away · Lagos Island
        </div>
      </div>
    );
  }

  if (type === 'electrical') {
    return (
      <div className="mx-auto mt-auto w-full max-w-[320px] rounded-[20px] bg-white p-5 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <div className="flex items-center justify-between text-[14px] font-semibold text-[#414B5A]">
          <span>Today&apos;s Job Checklist</span>
          <span className="text-[#8A94A3]">2/4 done</span>
        </div>
        <div className="mt-4 space-y-3 text-[14px]">
          <div className="flex items-center gap-3 text-[#B4BBC7] line-through">
            <ShieldCheck className="h-4 w-4 text-[#27BA88]" />
            DB board inspection
          </div>
          <div className="flex items-center gap-3 text-[#B4BBC7] line-through">
            <ShieldCheck className="h-4 w-4 text-[#27BA88]" />
            Socket & switch test
          </div>
          <div className="flex items-center justify-between gap-3 text-[#F59E0B]">
            <span className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full border border-current" />
              Lighting installation
            </span>
            <span className="text-[12px] font-semibold">In progress</span>
          </div>
          <div className="flex items-center gap-3 text-[#9AA3B2]">
            <span className="h-4 w-4 rounded-full border border-current" />
            Safety certificate
          </div>
        </div>
      </div>
    );
  }

  if (type === 'hvac') {
    return (
      <div className="mx-auto mt-auto w-full max-w-[234px] rounded-[20px] bg-white p-6 text-center shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <div className="text-[12px] text-[#8D95A3]">Room Temperature</div>
        <div className="mt-3 text-[48px] font-bold leading-none text-[#3F444D]">27°C</div>
        <div className="mt-2 text-[12px] font-semibold text-[#FF5F5F]">Target: 21°C</div>
        <div className="mt-5 h-2 rounded-full bg-[#FFD8D8]" />
        <div className="mt-3 text-[13px] font-semibold text-[#FF5F5F]">Cooling — AC running</div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-auto w-full max-w-[330px] rounded-[20px] bg-white p-5 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
      <div className="flex items-center gap-3 text-[14px] font-semibold text-[#27324A]">
        <span className="rounded-full bg-[#FFF0F0] px-3 py-1 text-[12px] text-[#FF4D4F]">● LIVE</span>
        Engineer Dispatched
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#34435C] text-[18px] font-bold text-white">
            KB
          </div>
          <div>
            <div className="text-[18px] font-semibold text-[#374151]">Kunle B.</div>
            <div className="text-[14px] text-[#8D95A3]">2.1 km away · Plumber</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[30px] font-bold leading-none text-[#27324A]">18 min</div>
          <div className="text-[12px] text-[#A5ADBA]">ETA</div>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-[#E6EAF1]">
        <div className="h-2 w-[72%] rounded-full bg-[#364152]" />
      </div>
    </div>
  );
}

export const ServiceGrid = () => {
  return (
    <section id="services" className="bg-[#F5F5F5] py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="max-w-[620px]">
          <p className="text-xl font-bold text-blue-700">Our Services</p>
          <h2 className="mt-1 text-4xl font-bold text-slate-800">
            Every home need, one platform.
          </h2>
          <p className="mt-3 text-base leading-6 text-zinc-600">
            From burst pipes to faulty wiring book a vetted, certified engineer in under
            60 seconds and track their arrival in real time.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="flex min-h-[460px] flex-col rounded-[20px] border border-zinc-300 bg-[#FCFCFC] px-5 py-5"
            >
              <span className={`w-fit rounded-full px-3 py-2 text-xs font-semibold ${service.labelClass}`}>
                {service.label}
              </span>
              <h3 className="mt-3 max-w-[520px] text-[36px] text-2xl leading-8 font-bold text-neutral-700">
                {service.title}
              </h3>
              <p className="mt-2 max-w-[520px] text-base leading-6 text-zinc-600">
                {service.description}
              </p>
              <div className="mt-10 flex flex-1 items-center justify-center">
                <ServiceMock type={service.mock} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
