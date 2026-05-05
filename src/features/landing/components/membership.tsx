'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineSupport, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi'
import { HiStar } from 'react-icons/hi2'
import { FigmaImage } from '@/components/ui/figma-image'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Basic',
    subtitle: 'For light, occasional usage best for: individuals or small households',
    price: '₦7,500',
    button: 'Subscribe to Basic',
    icon: HiOutlineUser,
    dark: false,
    features: [
      'Access to verified professionals',
      'Standard booking priority',
      'Reduced call-out fees',
      '24/7 support',
      'Track all jobs in real time',
    ],
  },
  {
    name: 'Standard',
    subtitle: 'For consistent home maintenance, best for: active homes and busy professionals',
    price: '₦15,000',
    button: 'Subscribe to Standard',
    icon: HiOutlineShieldCheck,
    dark: true,
    isPopular: true,
    features: [
      'Everything on basic',
      'Faster booking priority',
      'More call-out coverage',
      'Priority support',
      'Home health reports',
    ],
  },
  {
    name: 'Premium',
    subtitle: 'For full-service convenience, best for: landlords, large homes, and high-frequency users',
    price: '₦50,000',
    button: 'Subscribe to Premium',
    icon: HiOutlineSupport,
    dark: false,
    features: [
      'Everything on Standard',
      'Parts & labour included',
      'Same-day guarantee',
      'Annual home inspection',
      'Dedicated account manager',
    ],
  },
]

export const Membership = () => {
  return (
    <section id="membership" className="bg-white py-20 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-8 lg:px-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-3"
        >
          <div className="max-w-[651px] flex flex-col gap-1">
            <h4 className="text-blue-700 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Pricing</h4>
            <h2 className="text-neutral-700 text-3xl md:text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-9">
              Simple pricing, serious home cover.
            </h2>
          </div>
          <p className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
            No hidden call-out fees, All services in every plan, Cancel anytime
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center gap-4 h-12 mt-4">
            <div className="flex -space-x-3">
              {[
                '/assets/workers/amaka.png',
                '/assets/workers/james.png',
                '/assets/workers/ngozi.png',
                '/assets/workers/kunle.png',
                '/assets/workers/tunde.png'
              ].map((src, idx) => (
                <FigmaImage 
                  key={idx}
                  src={src}
                  alt="Happy User"
                  className="w-10 h-10 rounded-full border-2 border-white relative z-[5]"
                  style={{ zIndex: 5 - idx }}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className="w-3.5 h-3.5 text-amber-500" />
                ))}
              </div>
              <span className="text-neutral-700 text-xs font-semibold leading-4 mt-0.5">
                from 2,400+ happy homeowners
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {plans.map((plan) => (
            <motion.div 
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              className={cn(
                "relative flex flex-col p-8 rounded-xl border transition-all duration-300 hover:shadow-xl",
                plan.dark 
                  ? "bg-[radial-gradient(ellipse_115.97%_115.97%_at_82.00%_18.00%,_#4A2208_0%,_#1E1220_45%,_#111318_100%)] border-transparent"
                  : "bg-stone-50 border-zinc-300"
              )}
            >
              {plan.isPopular && (
                <div className="absolute left-1/2 -top-px -translate-x-1/2 bg-orange-600 px-6 py-1 rounded-b-[10px] z-10">
                  <span className="text-white text-[10px] font-extrabold uppercase tracking-wide">Most Popular</span>
                </div>
              )}

              <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0",
                    plan.dark ? "bg-slate-100 border-transparent" : "bg-white border-indigo-200"
                  )}>
                    <plan.icon className={cn("w-6 h-6", plan.dark ? "text-neutral-700" : "text-blue-700")} />
                  </div>
                  <div className="space-y-1">
                    <h3 className={cn("text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8", plan.dark ? "text-neutral-50" : "text-neutral-700")}>
                      {plan.name}
                    </h3>
                    <p className={cn("text-sm font-normal leading-5 h-10", plan.dark ? "text-neutral-50/80" : "text-zinc-600")}>
                      {plan.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-end">
                  <span className={cn("text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-10", plan.dark ? "text-neutral-50" : "text-slate-900")}>
                    {plan.price}
                  </span>
                  <span className={cn("text-xs font-semibold ml-1 mb-1", plan.dark ? "text-neutral-50/60" : "text-neutral-700")}>/mo</span>
                </div>
              </div>

              <Link href="/register" className="w-full mb-8">
                <button className={cn(
                  "w-full py-3 px-6 rounded-xl text-sm font-medium transition-colors",
                  plan.dark 
                    ? "bg-slate-50 text-blue-700 hover:bg-white" 
                    : "bg-transparent border border-blue-700 text-blue-700 hover:bg-blue-50"
                )}>
                  {plan.button}
                </button>
              </Link>

              <div className="flex flex-col gap-px">
                {plan.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex items-center gap-2 py-3 border-b border-zinc-300 last:border-0",
                      plan.dark ? "border-zinc-300/20" : "border-zinc-300"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-sm flex items-center justify-center shrink-0 border",
                      plan.dark ? "border-orange-600" : "border-emerald-800"
                    )}>
                       <HiOutlineCheckCircle className={cn("w-3 h-3", plan.dark ? "text-orange-600" : "text-emerald-800")} />
                    </div>
                    <span className={cn("text-sm font-normal leading-5", plan.dark ? "text-neutral-50" : "text-neutral-700")}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
