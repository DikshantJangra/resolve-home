'use client'

import React from 'react'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const FinalSuccessStep = () => {
  const { resetBooking } = useBookingStore()
  const router = useRouter()

  const handleDone = () => {
    resetBooking()
    router.push('/dashboard/bookings')
  }

  const handleMessage = () => {
    resetBooking()
    router.push('/dashboard/messages')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
        <HiOutlineCheckCircle className="w-12 h-12 text-green-500" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-neutral-700 font-heading">Booking Confirmed!</h3>
        <p className="text-zinc-600 text-sm leading-relaxed max-w-sm">
          Your professional is on their way. You can now chat with them to provide more details or track their progress.
        </p>
      </div>

      <div className="flex flex-col w-full gap-4 pt-4">
        <Button 
          onClick={handleMessage}
          className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium"
        >
          Message Professional
        </Button>
        <Button 
          variant="outline"
          onClick={handleDone}
          className="w-full h-12 border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl font-medium"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
