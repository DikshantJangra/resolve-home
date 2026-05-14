'use client'

import React from 'react'
import { HiOutlineLightningBolt, HiOutlineCalendar } from 'react-icons/hi'
import { useBookingStore, Priority } from '@/store/booking-store'
import { Button } from "@resolve/ui"
export const PriorityStep = () => {
  const { priority, setPriority, setStep, setScheduledDate, setScheduledTime } = useBookingStore()

  const handleSelect = (id: Priority) => {
    setPriority(id)
    if (id === 'Emergency') {
      const today = new Date().toISOString().split('T')[0]
      setScheduledDate(today)
      setScheduledTime('ASAP')
    }
  }

  const options = [
    {
      id: 'Emergency' as Priority,
      title: 'Emergency',
      description: '60-minutes response time. use for urgent leaks, power outages, etc',
      icon: HiOutlineLightningBolt,
    },
    {
      id: 'Standard' as Priority,
      title: 'Standard',
      description: 'Book for today or later date. Reliable and professional',
      icon: HiOutlineCalendar,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      <div className="flex-1 px-5 pt-10 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-5">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = priority === option.id

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full h-48 p-5 rounded-xl transition-all flex flex-col justify-center items-center gap-5 overflow-hidden ${
                  isSelected
                    ? 'bg-slate-50 outline outline-[1.50px] outline-offset-[-1.50px] outline-blue-700'
                    : 'bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300'
                }`}
              >
                <div className={`w-11 h-11 px-2.5 rounded-xl flex justify-center items-center ${
                  isSelected ? 'bg-white' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-700' : 'text-zinc-600'}`} />
                </div>
                <div className="self-stretch flex flex-col justify-start items-center gap-3">
                  <div className="self-stretch text-center text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                    {option.title}
                  </div>
                  <div className="self-stretch text-center text-zinc-600 text-base font-normal font-['Inter'] leading-6">
                    {option.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <button
          disabled={!priority}
          onClick={() => setStep(2)}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${
            !priority ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Continue</div>
        </button>
      </div>
    </div>
  )
}
