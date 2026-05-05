import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#ECFDF5] to-[#F8FAFC] pt-[148px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-16">
        <div className="relative mx-auto max-w-[680px] text-center">
          <h1 className="text-[52px] leading-[60px] font-extrabold tracking-[-2px] text-[#1E293B]">
            Quality home repairs,
            <span className="text-[#6366F1]"> guaranteed.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[580px] text-[16px] leading-6 text-[#404040]">
            Connect with trusted plumbers, electricians, and heating engineers throughout
            Nigeria in under 120 seconds.
          </p>
          <form className="mx-auto mt-8 flex w-full max-w-[540px] gap-3">
            <label className="relative block flex-1">
              <input
                type="text"
                placeholder="What do you need help with?"
                className="h-11 w-full rounded-lg border border-[#525252] bg-white/90 px-4 pr-11 text-sm text-[#3F3F46] outline-none"
              />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
            </label>
            <button className="h-11 min-w-40 rounded-xl bg-[#1D4ED8] px-6 text-sm font-medium text-white">
              Find a pro
            </button>
          </form>
        </div>
      </div>
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-72 w-72 rotate-[-12deg] rounded-[210px] bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(16,185,129,0.12)_0%,rgba(0,0,0,0)_70%)]" />
    </section>
  );
};
