import Image from 'next/image';

const nodes = [
  { city: 'Enugu', initials: 'EN', border: '#FFC7AE', left: '8%', top: '24%' },
  { city: 'Osun', initials: 'OS', border: '#B0F9B7', left: '31%', top: '18%' },
  { city: 'Lagos', initials: 'LG', border: '#9D7AFF', left: '62%', top: '18%' },
  { city: 'Abuja', initials: 'AB', border: '#F3A3F9', left: '84%', top: '30%' },
  { city: 'Ibadan', initials: 'IB', border: '#FFC7AE', left: '5%', top: '49%' },
  { city: 'Imo', initials: 'IM', border: '#BCA7FF', left: '22%', top: '72%' },
  { city: 'Ogun', initials: 'OG', border: '#CDE6FF', left: '69%', top: '76%' },
  { city: 'Ekiti', initials: 'EK', border: '#FFE763', left: '86%', top: '59%' },
];

const paths = [
  'M620 390 C 470 360, 320 320, 180 240',
  'M620 390 C 560 330, 470 270, 430 220',
  'M620 390 C 700 330, 760 250, 830 210',
  'M620 390 C 770 340, 900 310, 1020 300',
  'M620 390 C 470 430, 280 430, 145 480',
  'M620 390 C 520 430, 400 520, 300 620',
  'M620 390 C 720 430, 760 520, 850 620',
  'M620 390 C 840 385, 980 420, 1060 540',
];

export const AboutNetwork = () => {
  return (
    <section className="bg-[#19316C] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[14px] font-semibold text-white/90 uppercase tracking-wider">Our Network</p>
          <h2 className="mt-4 font-heading text-[40px] leading-[1.1] font-bold tracking-tight text-white md:text-[54px]">
            Engineers everywhere you need them.
          </h2>
          <p className="mt-6 text-[18px] leading-[1.6] text-[#E3E8FF]/90">
            Our certified engineers are on-call across every major city in Nigeria,
            connected through a single smart dispatch platform.
          </p>
        </div>

        <div className="relative mt-16 hidden h-[720px] overflow-hidden lg:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1240 720" fill="none">
            {paths.map((path) => (
              <path
                key={path}
                d={path}
                stroke="rgba(255,255,255,0.52)"
                strokeWidth="2.4"
                strokeDasharray="6 10"
                strokeLinecap="round"
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-[52%] flex h-[98px] w-[98px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <Image src="/resolve_home.svg" alt="Resolve Home" width={58} height={58} className="h-auto w-[58px]" />
          </div>

          {nodes.map((node) => (
            <div
              key={node.city}
              className="absolute"
              style={{ left: node.left, top: node.top }}
            >
              <div className="mb-3 text-[16px] font-semibold text-white">{node.city}</div>
              <div
                className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full border-[5px] bg-[linear-gradient(135deg,#274993,#5A79C8)] text-[26px] font-bold text-white shadow-lg"
                style={{ borderColor: node.border }}
              >
                {node.initials}
                <span className="absolute -right-1 top-1 h-4 w-4 rounded-full border-2 border-white bg-[#2AC38B]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:hidden">
          {nodes.map((node) => (
            <div key={node.city} className="flex items-center gap-4 rounded-[20px] bg-white/8 p-4">
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 bg-[linear-gradient(135deg,#274993,#5A79C8)] text-lg font-bold text-white"
                style={{ borderColor: node.border }}
              >
                {node.initials}
                <span className="absolute -right-1 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2AC38B]" />
              </div>
              <div className="text-lg font-semibold text-white">{node.city}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
