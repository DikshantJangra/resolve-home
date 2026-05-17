'use client'

import React from 'react'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { useRouter } from 'next/navigation'

export const FinalSuccessStep = () => {
  const { resetBooking, bookingId, setStep } = useBookingStore()
  const router = useRouter()

  const handleViewBooking = () => {
    const bid = bookingId
    resetBooking()
    router.push(`/bookings/${bid}`)
  }

  const handleSelectAnother = () => {
    // Go back to the engineer list (step 7) without resetting the booking
    setStep(7)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-8 bg-white rounded-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
          <HiOutlineCheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-neutral-700 text-xl font-bold font-plus-jakarta">Pro Partner Selected</h3>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Your booking request has been sent. The professional will confirm shortly.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button
          onClick={handleViewBooking}
          className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium"
        >
          Go to Booking
        </Button>
        <Button
          variant="outline"
          onClick={handleSelectAnother}
          className="w-full h-12 border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl font-medium"
        >
          Select Another Professional
        </Button>
      </div>
    </div>
  )
}
