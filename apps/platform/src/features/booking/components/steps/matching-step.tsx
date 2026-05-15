'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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

    const { scheduledDate, scheduledTime } = useBookingStore.getState()

    // Real API Call
    createBooking({
      serviceId,
      priority: priority?.toLowerCase() as 'emergency' | 'standard',
      issueDetails,
      scheduledDate,
      scheduledTime,
      location: {
        country: location?.country,
        state: location?.state,
        city: location?.city,
        streetAddress: location?.streetAddress,
        nearestLandmark: location?.landmark,
        latitude: 0,
        longitude: 0,
      },
      photos,
    }, {
      onSuccess: (data: any) => {
        if (data.success) {
          if (data.data.availableEngineers && data.data.availableEngineers.length > 0) {
            setAvailableEngineers(data.data.availableEngineers);
            setBookingId(data.data.booking.id);
            setStep(7); // Move to selection
          } else {
            setAvailableEngineers([]);
            setBookingId(data.data.booking.id);
            setStep(6); // Stay on MatchingStep, but render the 'no engineers' state
          }
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create booking");
        setStep(5); // Go back to review on error
      }
    })
  }, [createBooking, serviceId, priority, issueDetails, location, photos, setStep, setAvailableEngineers, setBookingId])

  // Conditional rendering for no engineers found
  if (!isPending && useBookingStore.getState().availableEngineers.length === 0 && useBookingStore.getState().bookingId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4 bg-white">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <HiOutlineExclamationCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-neutral-700">No Pro Partners found</h3>
        <p className="text-zinc-600">We couldn't find any Pro Partners near you at the moment. Please try again later or adjust your location/time.</p>
        <Button onClick={() => setStep(4)} className="bg-blue-700">Adjust Location/Time</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-5 space-y-10 bg-white">
      <div className="w-80 h-72 relative overflow-hidden flex items-center justify-center">
        <motion.div 
          animate={{ 
            rotate: 360,
            y: [0, -10, 0] 
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-20 h-20 relative"
        >
          {/* Pulsing Dots Animation */}
          <div className="absolute left-[33.33px] top-[16.67px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse" />
          <div className="absolute left-[33.33px] top-[50px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-75" />
          <div className="absolute left-[16.67px] top-[33.33px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-150" />
          <div className="absolute left-[50px] top-[33.33px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-200" />
          
          <div className="absolute left-[16.67px] top-[33.33px] w-3.5 h-3.5 bg-blue-700 rounded-full animate-ping" />
          <div className="absolute left-[50px] top-[33.33px] w-3.5 h-3.5 bg-blue-700 rounded-full animate-ping delay-150" />
        </motion.div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
          Finding Pro Partner...
        </h3>
        <p className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5 max-w-[280px]">
          We are matching your request with the best Pro Partner near you.
        </p>
      </div>
    </div>
  )
}
