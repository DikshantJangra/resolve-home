'use client'

import React from 'react'
import { HiOutlineLightningBolt, HiOutlineBadgeCheck, HiOutlineLockClosed, HiOutlineExclamationCircle } from 'react-icons/hi'
import { useBookingStore, Priority } from '@/store/booking-store'
import { useMySubscription, useWalletBalance } from '@/hooks/api-hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'

const EMERGENCY_FEE = 10000

export const PriorityStep = () => {
  const { priority, setPriority, setStep, setScheduledDate, setScheduledTime, setIsOpen } = useBookingStore()
  const { data: subscription, isLoading: subLoading } = useMySubscription()
  const { data: walletBalance, isLoading: balanceLoading } = useWalletBalance()
  const router = useRouter()

  const isSubscribed = !!subscription
  const isExpired = subscription && new Date(subscription.endDate) < new Date()
  const hasActiveSubscription = isSubscribed && !isExpired

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
      if (!hasActiveSubscription) {
        setIsOpen(false)
        router.push('/subscriptions')
        return
      }
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
    }
    setStep(2)
  }

  const standardLocked = !hasActiveSubscription && !subLoading

  const options = [
    {
      id: 'Emergency' as Priority,
      title: 'Emergency',
      description: '60-minute response time. For urgent leaks, power outages, etc.',
      icon: HiOutlineLightningBolt,
      locked: false,
    },
    {
      id: 'Standard' as Priority,
      title: 'Subscription Booking',
      description: 'Scheduled professional service covered by your active plan.',
      icon: HiOutlineBadgeCheck,
      locked: standardLocked,
    },
  ]

  const continueBtnLabel = () => {
    if (subLoading || (priority === 'Emergency' && balanceLoading)) return 'Checking...'
    if (priority === 'Standard' && !hasActiveSubscription) return isExpired ? 'Resubscribe to Unlock' : 'Subscribe to Unlock'
    return 'Continue'
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-0">
      <div className="flex-1 px-5 pt-8 overflow-y-auto scrollbar-thin flex flex-col gap-5">

        {/* Subscription status banner */}
        {!subLoading && (
          hasActiveSubscription ? (
            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex flex-col">
                <span className="text-blue-900 text-xs font-semibold uppercase tracking-wide">Active Plan</span>
                <span className="text-blue-800 text-base font-bold capitalize">{subscription.planName || subscription.planId} Plan</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-blue-600 text-[10px] font-medium">Expires</span>
                <span className="text-blue-800 text-xs font-semibold">
                  {subscription.endDate ? format(new Date(subscription.endDate), 'MMM d, yyyy') : '—'}
                </span>
              </div>
            </div>
          ) : isExpired ? (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
              <HiOutlineExclamationCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-amber-800 text-xs leading-relaxed">
                  Your subscription has expired. You can still do an emergency booking, or resubscribe to unlock scheduled bookings.
                </p>
                <button
                  onClick={() => { setIsOpen(false); router.push('/subscriptions') }}
                  className="text-amber-900 text-xs font-bold underline text-left"
                >
                  Resubscribe now →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
              <HiOutlineExclamationCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-blue-800 text-xs leading-relaxed">
                  You don't have a subscription. Emergency booking is available now, or subscribe to unlock scheduled bookings.
                </p>
                <button
                  onClick={() => { setIsOpen(false); router.push('/subscriptions') }}
                  className="text-blue-900 text-xs font-bold underline text-left"
                >
                  View subscription plans →
                </button>
              </div>
            </div>
          )
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = priority === option.id

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full h-48 md:h-auto md:aspect-square p-5 rounded-xl transition-all flex flex-col justify-center items-center gap-4 overflow-hidden relative ${
                  isSelected
                    ? 'bg-slate-50 outline outline-[1.50px] outline-offset-[-1.50px] outline-blue-700'
                    : 'bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300'
                } ${option.locked && !isSelected ? 'opacity-70' : ''}`}
              >
                {option.locked && (
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
                  {option.id === 'Emergency' && (
                    <div className="px-2 py-0.5 bg-red-50 rounded text-red-600 text-[10px] font-semibold">
                      ₦{EMERGENCY_FEE.toLocaleString()} fee
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <button
          disabled={!priority || subLoading || (priority === 'Emergency' && balanceLoading)}
          onClick={handleContinue}
          className={`w-full h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-between items-center transition-all ${
            (!priority || subLoading || (priority === 'Emergency' && balanceLoading)) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-800'
          }`}
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">
            {continueBtnLabel()}
          </div>
        </button>
      </div>
    </div>
  )
}
