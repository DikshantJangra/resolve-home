'use client'

import React from 'react'
import { HiOutlineLightningBolt, HiOutlineCalendar } from 'react-icons/hi'
import { useBookingStore, Priority } from '@/store/booking-store'
import { Button } from "@resolve/ui"
export const PriorityStep = () => {
  const { priority, setPriority, setStep } = useBookingStore()

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
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-10">
        <div className="flex gap-5">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = priority === option.id

            return (
              <button
                key={option.id}
                onClick={() => setPriority(option.id)}
                className={`flex-1 h-64 p-5 rounded-xl border transition-all flex flex-col justify-center items-center gap-5 overflow-hidden ${
                  isSelected
                    ? 'bg-slate-50 border-blue-700 border-[1.5px]'
                    : 'bg-white border-zinc-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex justify-center items-center ${
                  isSelected ? 'bg-white' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-700' : 'text-zinc-600'}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-center text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                    {option.title}
                  </h3>
                  <p className="text-center text-zinc-600 text-sm font-normal font-['Inter'] leading-5 px-2">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <Button
          disabled={!priority}
          onClick={() => setStep(3)}
          className="w-full h-11 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-neutral-50 text-sm font-medium rounded-xl disabled:opacity-40 transition-all"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
