'use client'

import React, { useEffect, useState } from 'react'
import { HiOutlineLightningBolt, HiOutlineBadgeCheck, HiOutlineExclamationCircle } from 'react-icons/hi'
import { useBookingStore, Priority } from '@/store/booking-store'
import { useMySubscription, useWalletBalance } from '@/hooks/api-hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const EMERGENCY_FEE = 10000

export const PriorityStep = () => {
  const { priority, setPriority, setStep, setScheduledDate, setScheduledTime, setIsOpen } = useBookingStore()
  const { data: subscription, isLoading: subLoading } = useMySubscription()
  const { data: walletBalance, isLoading: balanceLoading } = useWalletBalance()
  const router = useRouter()

  const isExpired = subscription && new Date(subscription.endDate) < new Date()
  const hasActiveSubscription = !!subscription && !isExpired

  // Subscribed → auto-set Standard and skip this step
  useEffect(() => {
    if (subLoading) return
    if (hasActiveSubscription) {
      setPriority('Standard')
      setStep(3)
    }
  }, [subLoading, hasActiveSubscription])

  const handleContinue = () => {
    if (!priority) return

    if (priority === 'Standard') {
      // Not subscribed, wants standard → redirect to subscribe
      setIsOpen(false)
      router.push('/subscriptions')
      return
    }

    if (priority === 'Emergency') {
      if (balanceLoading) return
      const balance = walletBalance?.balance ?? 0
      if (balance < EMERGENCY_FEE) {
        toast.error(`Insufficient balance. Emergency booking requires ₦${EMERGENCY_FEE.toLocaleString()}. Your balance: ₦${balance.toLocaleString()}`)
        setIsOpen(false)
        router.push('/wallet?fund=true')
        return
      }
      const today = new Date().toISOString().split('T')[0]
      setScheduledDate(today)
      setScheduledTime('ASAP')
    }

    setStep(3)
  }

  if (subLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-white">
        <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Checking your plan...</p>
      </div>
    )
  }

  const options = [
    {
      id: 'Emergency' as Priority,
      title: 'Emergency',
      description: '60-minute response time. For urgent leaks, power outages, etc.',
      icon: HiOutlineLightningBolt,
      badge: `₦${EMERGENCY_FEE.toLocaleString()} fee`,
      badgeColor: 'bg-red-50 text-red-600',
    },
    {
      id: 'Standard' as Priority,
      title: 'Subscription Booking',
      description: 'Scheduled professional service. Requires an active subscription.',
      icon: HiOutlineBadgeCheck,
      badge: 'Subscribe to use',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
  ]

  const btnLabel = () => {
    if (!priority) return 'Select an option'
    if (priority === 'Standard') return 'Subscribe to Unlock'
    if (balanceLoading) return 'Checking balance...'
    return 'Continue'
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      <div className="flex-1 px-5 pt-8 overflow-y-auto scrollbar-thin flex flex-col gap-5">

        <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
          <HiOutlineExclamationCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-blue-800 text-xs leading-relaxed">
            You don't have an active subscription. Book an emergency now, or subscribe for scheduled bookings at no extra cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = priority === option.id
            return (
              <button
                key={option.id}
                onClick={() => setPriority(option.id)}
                className={`w-full h-48 md:h-auto md:aspect-square p-5 rounded-xl transition-all flex flex-col justify-center items-center gap-4 relative ${
                  isSelected
                    ? 'bg-slate-50 outline outline-[1.5px] outline-offset-[-1.5px] outline-blue-700'
                    : 'bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex justify-center items-center shrink-0 ${isSelected ? 'bg-white' : 'bg-slate-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-700' : 'text-zinc-600'}`} />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-neutral-700 text-lg md:text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-7">{option.title}</span>
                  <span className="text-zinc-600 text-xs md:text-sm font-['Inter'] leading-5 line-clamp-3">{option.description}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${option.badgeColor}`}>{option.badge}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <button
          disabled={!priority || (priority === 'Emergency' && balanceLoading)}
          onClick={handleContinue}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-center items-center transition-all ${
            !priority || (priority === 'Emergency' && balanceLoading) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <span className="text-neutral-50 text-sm font-medium font-['Inter'] leading-5">{btnLabel()}</span>
        </button>
      </div>
    </div>
  )
}
