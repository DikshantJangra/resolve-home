'use client'

import React from 'react'
import { HiOutlineLightningBolt, HiOutlineBadgeCheck, HiOutlineLockClosed } from 'react-icons/hi'
import { useBookingStore, Priority } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { useMySubscription } from '@/hooks/api-hooks'
import { useRouter } from 'next/navigation'
export const PriorityStep = () => {
  const { priority, setPriority, setStep, setScheduledDate, setScheduledTime, setIsOpen } = useBookingStore()
  const { data: subscription, isLoading: subLoading } = useMySubscription()
  const router = useRouter()

  const handleSelect = (id: Priority) => {
    setPriority(id)
    if (id === 'Emergency') {
      const today = new Date().toISOString().split('T')[0]
      setScheduledDate(today)
      setScheduledTime('ASAP')
    }
  }

  const handleContinue = () => {
    if (priority === 'Standard') {
      if (subLoading) return
      if (!subscription) {
        setIsOpen(false)
        router.push('/subscriptions')
        return
      }
    }
    setStep(2)
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
      title: 'Subscription Booking',
      description: 'Scheduled professional service covered by your plan',
      icon: HiOutlineBadgeCheck,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      <div className="flex-1 px-5 pt-10 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = priority === option.id
            const isLocked = option.id === 'Standard' && !subscription && !subLoading

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full h-48 md:h-auto md:aspect-square p-5 rounded-xl transition-all flex flex-col justify-center items-center gap-4 overflow-hidden relative ${
                  isSelected
                    ? 'bg-slate-50 outline outline-[1.50px] outline-offset-[-1.50px] outline-blue-700'
                    : 'bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300'
                } ${isLocked && !isSelected ? 'opacity-80' : ''}`}
              >
                {isLocked && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200">
                    <HiOutlineLockClosed className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex justify-center items-center shrink-0 ${
                  isSelected ? 'bg-white' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-700' : 'text-zinc-600'}`} />
                </div>
                <div className="self-stretch flex flex-col justify-start items-center gap-2">
                  <div className="self-stretch text-center text-neutral-700 text-lg md:text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                    {option.title}
                  </div>
                  <div className="self-stretch text-center text-zinc-600 text-xs md:text-sm font-normal font-['Inter'] leading-5 line-clamp-3">
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
          disabled={!priority || (priority === 'Standard' && subLoading)}
          onClick={handleContinue}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${
            (!priority || (priority === 'Standard' && subLoading)) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">
            {priority === 'Standard' && !subscription && !subLoading ? 'Subscribe to Unlock' : 'Continue'}
          </div>
        </button>
      </div>
    </div>
  )
}
