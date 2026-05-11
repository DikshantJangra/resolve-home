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
    photos,
    setAvailableEngineers,
    setBookingId 
  } = useBookingStore()
  
  const { mutate: createBooking, isPending } = useCreateBooking()
  const hasCalled = useRef(false)

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    // Real API Call
    createBooking({
      serviceId,
      priority: priority?.toLowerCase() as 'emergency' | 'standard',
      issueDetails,
      location: {
        state: location?.state,
        city: location?.city,
        streetAddress: location?.streetAddress,
        nearestLandmark: location?.landmark,
        latitude: 0, // Placeholder or get from geolocation
        longitude: 0,
      },
      photos,
    }, {
      onSuccess: (data: any) => {
        if (data.success) {
          setAvailableEngineers(data.data.availableEngineers || [])
          setBookingId(data.data.booking.id)
          setStep(7) // Move to selection
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create booking")
        setStep(4) // Go back to review on error
      }
    })
  }, [createBooking, serviceId, priority, issueDetails, location, photos, setStep, setAvailableEngineers])

  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-20 space-y-10">
      <div className="w-80 h-72 flex items-center justify-center relative overflow-hidden">
        <div className="w-20 h-20 relative">
          {/* Pulsing Dots Animation */}
          <div className="absolute left-[33px] top-[16px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse" />
          <div className="absolute left-[33px] top-[50px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-75" />
          <div className="absolute left-[16px] top-[33px] w-3.5 h-3.5 bg-blue-700 rounded-full animate-ping" />
          <div className="absolute left-[50px] top-[33px] w-3.5 h-3.5 bg-blue-700 rounded-full animate-ping delay-150" />
        </div>
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
