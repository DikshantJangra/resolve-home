'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FigmaImage } from "@resolve/ui"
import { cn } from "@resolve/ui";
import { HiStar, HiClock, HiMapPin, HiCheck } from 'react-icons/hi2';

const ServiceCard = ({
  title,
  description,
  tag,
  tagColor = "bg-[#3B3B3B]",
  children
}: {
  title: string;
  description: string;
  tag: string;
  tagColor?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border-[#D9D9D9] border-[1.5px] border-solid flex flex-col gap-10 p-6 md:p-10 rounded-[24px] bg-white hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex flex-col gap-4">
      <div className={cn("px-3 py-1.5 rounded-full w-fit", tagColor)}>
        <span className="text-white text-xs font-semibold tracking-wider uppercase">{tag}</span>
      </div>
      <h3 className="font-heading text-2xl font-bold text-[#3B3B3B]">{title}</h3>
      <p className="text-[#636363] text-base leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center justify-center bg-[#F9F9F9] rounded-2xl p-6 min-h-[220px]">
      {children}
    </div>
  </motion.div>
);

const PlumbingMockup = () => (
  <div className="w-full max-w-[380px] bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex flex-col gap-4">
    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3">
        <FigmaImage
          src="/assets/workers/james.png"
          alt="James A."
          className="w-14 h-14 rounded-full"
          sizes="56px"
          fallbackInitial="JA"
        />
        <div>
          <div className="font-bold text-[#3B3B3B] text-lg">James A.</div>
          <div className="text-[#636363] text-sm">Certified Plumber · Lagos</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <HiStar className="text-amber-400 w-4 h-4" />
        <span className="font-bold text-[#3B3B3B]">4.9</span>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="bg-[#ECFDF5] px-3 py-1.5 rounded-full flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-pulse" />
        <span className="text-[#10B981] text-xs font-semibold">Available now</span>
      </div>
      <div className="flex items-center gap-1.5 text-[#64748B]">
        <HiClock className="w-4 h-4" />
        <span className="text-xs">45 min ETA</span>
      </div>
    </div>
    <div className="bg-slate-50 px-4 py-2 rounded-full flex items-center gap-2 text-[#64748B]">
      <HiMapPin className="w-4 h-4" />
      <span className="text-sm font-medium">3.2 km away · Lagos Island</span>
    </div>
  </div>
);

const ElectricalMockup = () => (
  <div className="w-full max-w-[340px] bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <span className="font-bold text-[#1E293B]">Today's Job Checklist</span>
      <span className="text-sm text-[#64748B]">2/4 done</span>
    </div>
    <div className="flex flex-col gap-3">
      {[
        { label: "DB board inspection", checked: true },
        { label: "Socket & switch test", checked: true },
        { label: "Lighting installation", inProgress: true },
        { label: "Safety certificate", checked: false },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center",
            item.checked ? "bg-blue-600 border-blue-600" : item.inProgress ? "bg-amber-50 border-amber-500" : "bg-white border-slate-200"
          )}>
            {item.checked && <HiCheck className="text-white w-3.5 h-3.5" />}
            {item.inProgress && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
          </div>
          <span className={cn(
            "text-sm font-medium",
            item.checked ? "text-slate-400 line-through" : item.inProgress ? "text-amber-600" : "text-slate-600"
          )}>
            {item.label}
          </span>
          {item.inProgress && <span className="ml-auto text-[10px] font-bold text-amber-500 uppercase">In progress</span>}
        </div>
      ))}
    </div>
  </div>
);

const HVACMockup = () => (
  <div className="w-full max-w-[280px] bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center gap-4">
    <div className="flex flex-col items-center text-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">Room Temperature</span>
      <span className="text-5xl font-black text-[#3B3B3B] tracking-tighter">27°C</span>
      <span className="text-xs font-bold text-rose-600 mt-1">Target: 21°C</span>
    </div>
    <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '70%' }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-400 to-rose-600"
      />
    </div>
    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase">
      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
      Cooling — AC running
    </div>
  </div>
);

const EmergencyMockup = () => (
  <div className="w-full max-w-[340px] bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="bg-rose-50 px-3 py-1 rounded-full flex items-center gap-2">
        <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
        <span className="text-rose-600 text-[11px] font-black uppercase tracking-widest">Live</span>
      </div>
      <span className="font-bold text-[#1E293B] text-sm">Engineer Dispatched</span>
    </div>
    <div className="h-px bg-slate-100" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FigmaImage
          src="/assets/workers/kunle.png"
          alt="Kunle B."
          className="w-12 h-12 rounded-full"
          sizes="48px"
          fallbackInitial="KB"
        />
        <div>
          <div className="font-bold text-[#1E293B] text-sm">Kunle B.</div>
          <div className="text-[#64748B] text-xs">2.1 km away · Plumber</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-black text-[#1E293B] text-lg leading-none">18 min</div>
        <div className="text-[#94A3B8] text-[10px] font-bold uppercase">ETA</div>
      </div>
    </div>
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '60%' }}
        className="absolute inset-y-0 left-0 bg-[#1E293B]"
      />
    </div>
  </div>
);

export const ServiceGrid = () => {
  return (
    <section id="services" className="bg-white py-24 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2"
          >
            <span className="text-blue-700 text-xl font-bold font-heading">Our Services</span>
            <h2 className="text-slate-800 text-4xl md:text-5xl font-bold font-heading">
              Everything your home needs, in one place.
            </h2>
            <p className="mt-2 max-w-[600px] text-zinc-600 text-lg">
              From burst pipes to faulty wiring book a vetted, certified engineer in under 60 seconds and track their arrival in real time.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <ServiceCard
            title="Pipes & leaks sorted in minutes."
            description="No guesswork. Verified plumbers show up ready to solve leaks, blockages, and pressure issues."
            tag="Plumbing"
          >
            <PlumbingMockup />
          </ServiceCard>

          <ServiceCard
            title="Safe wiring, done right."
            description="Certified electricians handle faults, installations, and inspections — done right the first time."
            tag="Electrical"
          >
            <ElectricalMockup />
          </ServiceCard>

          <ServiceCard
            title="Cool summers, warm winters."
            description="From AC maintenance to full HVAC system repairs, we've got you covered for every season."
            tag="Heating & AC"
          >
            <HVACMockup />
          </ServiceCard>

          <ServiceCard
            title="Engineer at your door in minutes."
            description="Emergency requests are prioritized and dispatched instantly with live tracking for total peace of mind."
            tag="24/7 Emergency"
            tagColor="bg-[#FB2424]"
          >
            <EmergencyMockup />
          </ServiceCard>
        </motion.div>
      </div>
    </section>
  );
};

