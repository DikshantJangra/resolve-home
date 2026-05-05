'use client'

import React, { useEffect, useRef } from 'react'
import { useBookingStore } from '@/store/booking-store'
import { useCreateBooking } from '@/hooks/api-hooks'
import { toast } from 'sonner'

export const MatchingStep = () => {
  const { 
    setStep, 
    priority, 
    serviceId, 
    issueDetails, 
    location, 
    photos 
  } = useBookingStore()
  
  const { mutate: createBooking, isPending } = useCreateBooking()
  const hasCalled = useRef(false)

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    // Real API Call
    createBooking({
      serviceId,
      urgency: priority,
      description: issueDetails,
      address: location?.streetAddress,
      city: location?.city,
      state: location?.state,
      images: photos,
    }, {
      onSuccess: () => {
        setStep(6)
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create booking")
        setStep(4) // Go back to review on error
      }
    })
  }, [createBooking, serviceId, priority, issueDetails, location, photos, setStep])

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
