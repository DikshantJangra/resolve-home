'use client'

import React from 'react'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
    <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 overflow-hidden bg-white rounded-xl">
      <div className="w-80 flex flex-col justify-start items-center gap-4">
        <div className="w-14 h-14 relative bg-emerald-800/10 rounded-full overflow-hidden flex items-center justify-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-6 h-6 text-emerald-800" />
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-[5px]">
          <h3 className="w-64 text-center text-neutral-700 text-2xl font-semibold font-heading leading-8">Payment Successful</h3>
          <p className="self-stretch text-center text-zinc-600 text-base font-normal font-inter leading-6">
            Your payment was successfully processed and now you have access to premium service
          </p>
        </div>
      </div>
      
      <div className="self-stretch inline-flex justify-start items-start gap-5">
        <Button 
          variant="outline"
          onClick={() => toast.info("Receipt will be sent to your email")}
          className="flex-1 h-12 border-blue-700 text-blue-700 hover:bg-blue-50 rounded-xl font-medium"
        >
          View Receipt
        </Button>
        <Button 
          onClick={handleDone}
          className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium"
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
