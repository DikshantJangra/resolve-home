'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FigmaImage } from '@/components/ui/figma-image';
import { cn } from '@/lib/utils';
import { HiOutlineWrench, HiOutlineClock, HiOutlineDocumentText, HiStar, HiCheck } from 'react-icons/hi2';

const StepMock = ({ type }: { type: string }) => {
  if (type === 'request') {
    return (
      <div className="mx-auto mt-8 w-[255px] rounded-[18px] bg-white p-5 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <div className="text-[14px] font-semibold text-zinc-800">What do you need?</div>
        <div className="mt-4 space-y-3">
          {[
            { icon: HiOutlineWrench, label: 'Plumbing', active: true },
            { icon: HiOutlineClock, label: 'Electrical', active: false },
            { icon: HiOutlineDocumentText, label: 'HVAC', active: false },
          ].map((item, i) => (
            <div key={i} className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-colors",
              item.active ? "border-blue-100 bg-blue-50/50" : "border-zinc-100 bg-white"
            )}>
              <item.icon className={cn("h-4 w-4", item.active ? "text-blue-600" : "text-zinc-400")} />
              <div className={cn("flex-1 text-[13px] font-medium", item.active ? "text-zinc-700" : "text-zinc-500")}>
                {item.label}
              </div>
              <div className={cn(
                "h-3.5 w-3.5 rounded-full border-2",
                item.active ? "border-blue-600 bg-blue-600" : "border-zinc-200"
              )} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'match') {
    return (
      <div className="mx-auto mt-12 w-[255px] rounded-[18px] bg-white p-4 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#27BA88] rounded-full animate-pulse" />
          <span className="text-[12px] font-semibold text-[#27BA88]">Engineer matched!</span>
        </div>
        <div className="mt-4 rounded-[16px] bg-[#F5F7FB] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FigmaImage 
                src="/assets/workers/james.png" 
                alt="James A." 
                className="w-10 h-10 rounded-full"
                fallbackInitial="JA"
              />
              <div className="text-left">
                <div className="text-[14px] font-bold text-[#374151]">James A.</div>
                <div className="text-[11px] text-[#8D95A3]">Plumber · Lagos</div>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <div className="font-bold text-[#374151]">45 min</div>
              <div className="text-[#8D95A3]">ETA</div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between text-[11px]">
          <span className="text-[#8D95A3]">Engineer en route...</span>
          <span className="font-bold text-[#374151]">58%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-[#E3E8F0] overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '58%' }}
            className="h-full rounded-full bg-[#2AC38B]" 
          />
        </div>
      </div>
    );
  }

  if (type === 'invoice') {
    return (
      <div className="mx-auto mt-10 w-[255px] rounded-[18px] bg-white p-5 shadow-[0_18px_50px_rgba(26,43,78,0.08)]">
        <div className="flex items-center gap-2 text-[#27BA88]">
          <div className="w-5 h-5 bg-[#27BA88] rounded-full flex items-center justify-center">
            <HiCheck className="text-white w-3.5 h-3.5" />
          </div>
          <span className="text-[14px] font-bold">Job Complete</span>
        </div>
        <div className="mt-5 space-y-2 text-[13px] text-[#8D95A3]">
          <div className="flex items-center justify-between">
            <span>Labour</span>
            <span className="font-bold text-[#374151]">₦4,500</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Parts</span>
            <span className="font-bold text-[#374151]">₦1,200</span>
          </div>
          <div className="mt-3 border-t border-dashed border-[#E8EBF1] pt-3 flex items-center justify-between">
            <span className="font-bold text-[#374151]">Total Paid</span>
            <span className="font-black text-blue-700 text-lg">₦5,700</span>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <HiStar key={s} className="text-[#F6A623] w-4 h-4" />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const steps = [
  {
    title: "Tell us what's wrong",
    description: 'Pick your service, describe the issue, and choose your urgency.',
    background: 'bg-[linear-gradient(180deg,#DEE8FB_0%,#D5E2FB_100%)]',
    mock: 'request',
  },
  {
    title: 'We find your engineer',
    description: 'We instantly match you with the nearest certified technician. Track their arrival.',
    background: 'bg-[linear-gradient(180deg,#E5F7EC_0%,#D5F6EA_100%)]',
    mock: 'match',
  },
  {
    title: 'Problem solved, pay done',
    description: 'The technician fixes the issue, you review the invoice, and pay securely online.',
    background: 'bg-[linear-gradient(180deg,#DFE7FD_0%,#D9E2FB_100%)]',
    mock: 'invoice',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-24 px-6 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="self-stretch inline-flex flex-col justify-start items-start gap-3 mb-16"
        >
          <div className="max-w-[651px] flex flex-col justify-start items-start gap-1">
            <div className="self-stretch justify-start text-blue-700 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-8">How it works</div>
            <div className="self-stretch justify-start text-slate-800 text-3xl md:text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-9">How Resolv Works</div>
          </div>
          <div className="max-w-[558px] justify-start text-zinc-600 text-base font-normal font-['Inter'] leading-6">From burst pipes to faulty wiring book a vetted, certified engineer in under 60 seconds and track their arrival in real time.</div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="overflow-hidden rounded-[32px] bg-stone-50 border border-zinc-100 flex flex-col hover:shadow-2xl transition-all duration-500 group"
            >
              <div className={cn(
                "min-h-[340px] px-8 pt-12 relative flex items-center justify-center overflow-hidden",
                step.background
              )}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <StepMock type={step.mock} />
              </div>
              <div className="px-10 pb-12 pt-10 flex-1 flex flex-col text-center">
                <h3 className="text-2xl font-bold text-[#3B3B3B]">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#636363]">
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
