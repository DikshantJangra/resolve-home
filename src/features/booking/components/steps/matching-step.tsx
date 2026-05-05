'use client'

import React, { useEffect } from 'react'
import { useBookingStore } from '@/store/booking-store'

export const MatchingStep = () => {
  const { setStep } = useBookingStore()

  useEffect(() => {
    // Simulate finding a pro
    const timer = setTimeout(() => {
      setStep(6)
    }, 3000)
    return () => clearTimeout(timer)
  }, [setStep])

  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-20 space-y-10">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-700 rounded-full border-t-transparent animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-700 rounded-full" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
          Finding professional...
        </h3>
        <p className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5 max-w-[280px]">
          We are matching your request with the best professional near you.
        </p>
      </div>
    </div>
  )
}
