'use client'

import React, { useState } from 'react'
import { 
  HiOutlineClock, 
  HiOutlineShieldCheck, 
  HiOutlineMapPin, 
  HiOutlineBolt, 
  HiOutlineCreditCard, 
  HiOutlineCalendarDays, 
  HiOutlineHandThumbDown, 
  HiOutlineCurrencyDollar, 
  HiOutlineWrenchScrewdriver 
} from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { cn } from "@resolve/ui"

const faqs = [
  {
    question: 'How quickly can I book a service?',
    answer: "Book in under 60 seconds: pick a service, enter your address, choose a time, and you're set—no calls needed.",
    icon: HiOutlineClock,
  },
  {
    question: 'Are your engineers verified?',
    answer: 'Every Resolv engineer is COREN & SON certified, identity-verified, and background-checked before entering your home.',
    icon: HiOutlineShieldCheck,
  },
  {
    question: 'Which cities do you currently cover?',
    answer: "We're live in Lagos, Abuja, and Port Harcourt, expanding fast to Ibadan, Enugu, and Kano.",
    icon: HiOutlineMapPin,
  },
  {
    question: 'How does emergency booking work?',
    answer: 'Tap Emergency anytime. We prioritize your job and dispatch the nearest engineer quickly.',
    icon: HiOutlineBolt,
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cards, bank transfers, and NGN via Paystack. Transactions are encrypted and receipts sent instantly.',
    icon: HiOutlineCreditCard,
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer: 'Cancel or reschedule free within 3 minutes of booking, right from the app.',
    icon: HiOutlineCalendarDays,
  },
  {
    question: "What if I'm not happy with the work?",
    answer: "Our satisfaction guarantee means if the issue isn’t fixed, we send another engineer at no cost.",
    icon: HiOutlineHandThumbDown,
  },
  {
    question: 'How do membership plans save me money?',
    answer: 'Members get up to 15% off callouts, priority access, and annual visits that pay for themselves after one job.',
    icon: HiOutlineCurrencyDollar,
  },
  {
    question: 'What services does Resolv cover?',
    answer: 'Plumbing, electrical, HVAC, appliance repair, and maintenance available on-demand or scheduled.',
    icon: HiOutlineWrenchScrewdriver,
  },
  {
    question: 'What are your operating hours?',
    answer: 'Standard bookings: 7 am–9 pm daily. Emergency cover: 24/7, year-round.',
    icon: HiOutlineClock,
  },
];

export const ContactFAQ = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.message

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section id="faq" className="w-full bg-white px-6 lg:px-16 py-20 flex flex-col gap-14 overflow-hidden">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-3"
      >
        <div className="max-w-[651px] flex flex-col gap-1">
          <span className="text-blue-700 text-xl font-bold font-heading leading-8">Frequently Asked Question</span>
          <h2 className="text-neutral-700 text-3xl font-bold font-heading leading-9">Everything you need to know.</h2>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row justify-start items-start gap-10">
        {/* Contact Form (Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-96 p-8 bg-stone-50 rounded-xl border border-zinc-100 flex flex-col gap-8 shrink-0"
        >
          <div className="flex flex-col gap-6">
            <p className="text-zinc-600 text-sm font-normal leading-5">
              Can&apos;t find your answer here? Reach us by filling the form below or call +234 800 123 4567.
            </p>
            
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  <label className="text-zinc-600 text-sm font-medium">First Name</label>
                  <span className="text-red-600 text-sm font-medium">*</span>
                </div>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g Yemi"
                  className="h-12 px-4 py-3 rounded-lg border border-zinc-300 bg-white text-sm text-neutral-700 placeholder:text-zinc-300 focus:border-blue-700 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  <label className="text-zinc-600 text-sm font-medium">Last Name</label>
                  <span className="text-red-600 text-sm font-medium">*</span>
                </div>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g Samuel"
                  className="h-12 px-4 py-3 rounded-lg border border-zinc-300 bg-white text-sm text-neutral-700 placeholder:text-zinc-300 focus:border-blue-700 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  <label className="text-zinc-600 text-sm font-medium">Email Address</label>
                  <span className="text-red-600 text-sm font-medium">*</span>
                </div>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g Yemi.fig@mail.com"
                  className="h-12 px-4 py-3 rounded-lg border border-zinc-300 bg-white text-sm text-neutral-700 placeholder:text-zinc-300 focus:border-blue-700 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  <label className="text-zinc-600 text-sm font-medium">Message</label>
                  <span className="text-red-600 text-sm font-medium">*</span>
                </div>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type here..."
                  className="h-36 p-3 rounded-lg border border-zinc-300 bg-white text-sm text-neutral-700 placeholder:text-zinc-300 focus:border-blue-700 outline-none transition-all resize-none"
                  required
                />
              </div>
            </form>
          </div>

          <button 
            disabled={!isFormValid}
            className={cn(
              "w-full px-6 py-3 rounded-xl text-neutral-50 text-sm font-medium transition-all",
              isFormValid 
                ? "bg-blue-700 hover:bg-blue-800" 
                : "bg-blue-700 opacity-40 cursor-not-allowed"
            )}
          >
            Send
          </button>
        </motion.div>

        {/* FAQ Grid (Right) */}
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
          className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 content-start"
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="p-5 rounded-xl border border-zinc-300 flex items-start gap-6 hover:border-blue-200 hover:bg-blue-50/10 transition-all group h-fit lg:h-32"
            >
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <faq.icon className="w-5 h-5 text-zinc-600 group-hover:text-blue-700 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-neutral-700 text-sm font-bold leading-5">{faq.question}</h3>
                <p className="text-zinc-600 text-sm font-normal leading-5">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
