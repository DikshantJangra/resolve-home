import { Bolt, MapPin, Star, Wrench } from "lucide-react";

const professionals = [
  {
    name: "Ngozi F.",
    role: "Plumber",
    roleClass: "bg-[#EF4444]/10 text-[#EF4444]",
    status: "On the way · 25 min",
    statusClass: "bg-[#1D4ED8]/90 text-white",
    rating: "4.6",
    jobs: "75+ jobs",
    location: "Yaba",
    today: "2 jobs today",
    distance: "5.2 km",
    initials: "NF",
    skill: "Emergency Leaks",
    background: "linear-gradient(180deg, #D9E6FF 0%, #EDEDED 100%)",
  },
  {
    name: "James A.",
    role: "Plumber",
    roleClass: "bg-[#1D4ED8]/10 text-[#1D4ED8]",
    status: "Available now",
    statusClass: "bg-[#10B981]/90 text-white",
    rating: "4.9",
    jobs: "143+ jobs",
    location: "Lagos Island",
    today: "2 jobs today",
    distance: "2.3 km",
    initials: "JA",
    skill: "Pipes & Drains",
    background: "linear-gradient(180deg, #4F3027 0%, #202020 100%)",
  },
  {
    name: "Amaka O.",
    role: "Electrician",
    roleClass: "bg-[#F59E0B]/10 text-[#F59E0B]",
    status: "",
    statusClass: "",
    rating: "4.8",
    jobs: "98+ jobs",
    location: "Lekki Phase 1",
    today: "3 jobs today",
    distance: "4.1 km",
    initials: "AO",
    skill: "Wiring & DB",
    background: "linear-gradient(180deg, #B59F9D 0%, #6A5A60 100%)",
  },
  {
    name: "Kunle B.",
    role: "Heating Engineer",
    roleClass: "bg-[#10B981]/10 text-[#10B981]",
    status: "Available now",
    statusClass: "bg-[#10B981]/90 text-white",
    rating: "4.7",
    jobs: "211+ jobs",
    location: "Victoria Island",
    today: "1 jobs today",
    distance: "1.8 km",
    initials: "KB",
    skill: "AC & Boilers",
    background: "linear-gradient(180deg, #D6D6D6 0%, #4A5568 100%)",
  },
  {
    name: "Tunde M.",
    role: "General Contractor",
    roleClass: "bg-[#A855F7]/10 text-[#A855F7]",
    status: "Available now",
    statusClass: "bg-[#10B981]/90 text-white",
    rating: "4.9",
    jobs: "327+ jobs",
    location: "Ikoyi",
    today: "4 jobs today",
    distance: "3.7 km",
    initials: "TM",
    skill: "Full Repairs",
    background: "linear-gradient(180deg, #9FD4B8 0%, #838691 100%)",
  },
];

export const ProfessionalsList = () => {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white pb-10 pt-8">
      <div className="mx-auto max-w-[1440px] px-0">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-5 px-4 pb-8 lg:px-8">
            {[...professionals, professionals[0], professionals[1]].map((pro, i) => (
            <article
              key={`${pro.name}-${i}`}
              className={`w-60 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white ${i === 2 ? "outline outline-1 outline-blue-700/20" : i % 4 === 0 ? "opacity-70" : ""}`}
            >
              <div className="relative h-48 overflow-hidden" style={{ background: pro.background }}>
                {pro.status ? (
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-tight ${pro.statusClass}`}>
                    {pro.status}
                  </span>
                ) : null}
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {pro.rating}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-center">
                  <div className="mb-3 flex h-[74px] w-[74px] items-center justify-center rounded-full border-4 border-white bg-white/60 text-[24px] font-bold text-slate-700 backdrop-blur-sm">
                    {pro.initials}
                  </div>
                </div>
              </div>
              <div className="space-y-2 px-4 pb-4 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-800">{pro.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${pro.roleClass}`}>
                    {pro.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{pro.skill}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border border-emerald-500/40 bg-emerald-50" />
                    {pro.jobs}
                  </span>
                  <span className="h-[3px] w-[3px] rounded-full bg-slate-200" />
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {pro.location}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Bolt className="h-3 w-3 text-blue-700" />
                    {pro.today}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wrench className="h-3 w-3 text-slate-400" />
                    {pro.distance}
                  </span>
                </div>
              </div>
            </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
