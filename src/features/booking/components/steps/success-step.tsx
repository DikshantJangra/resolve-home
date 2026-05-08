'use client'

import React, { useState } from 'react'
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCheckCircle } from 'react-icons/hi'
import { IoLocationOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { useSelectEngineer } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { usePaystackPayment } from 'react-paystack'
import { ReviewCard } from '../review-card'

export const SuccessStep = () => {
  const { availableEngineers, resetBooking, setStep, selectedEngineerId, setSelectedEngineerId, bookingId } = useBookingStore()
  const { mutate: selectEngineer, isPending } = useSelectEngineer()
  
  // Paystack Config (Mocking amount for now)
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com",
    amount: 500000, // 5000 NGN in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  };

  const initializePayment = usePaystackPayment(config);

  const handleConfirmSelection = (engineerId: string) => {
    // 1. Pay via Paystack
    initializePayment({
      onSuccess: () => {
        toast.success("Payment successful!")
        selectEngineer({ bookingId: bookingId || "", engineerId }, {
          onSuccess: () => {
            toast.success("Professional matched successfully!")
            setStep(8) // Final Success
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to confirm engineer")
          }
        })
      },
      onClose: () => {
        toast.error("Payment cancelled")
      }
    })
  }

  if (!availableEngineers || availableEngineers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <HiOutlineCheckCircle className="w-8 h-8 text-red-500 rotate-180" />
        </div>
        <h3 className="text-xl font-bold text-neutral-700">No professionals found</h3>
        <p className="text-zinc-600">We couldn't find any professionals near you at the moment. Please try again later.</p>
        <Button onClick={() => setStep(1)} className="bg-blue-700">Go Back</Button>
      </div>
    )
  }

  const currentPro = availableEngineers[0] // For now we show the top match as per design

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 p-5 space-y-8 overflow-y-auto no-scrollbar">
        {/* Pro Profile Card */}
        <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-8 overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3">
              <img 
                className="w-20 h-20 rounded-full object-cover" 
                src={currentPro.image || "https://placehold.co/88x88"} 
                alt={currentPro.name}
              />
              <div className="space-y-3.5">
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <h3 className="text-neutral-700 text-base font-semibold leading-6">{currentPro.name}</h3>
                    <span className="text-orange-500 text-xs font-semibold leading-4">Pro Verified</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600 text-xs font-normal">
                    <span>{currentPro.specialization || 'Electrician'}</span>
                    <div className="w-1 h-1 bg-blue-700 rounded-full mx-1" />
                    <div className="w-3 h-3 bg-amber-500 rounded-sm flex items-center justify-center">
                      <HiOutlineStar className="text-white w-2 h-2" />
                    </div>
                    <span>{currentPro.rating} Rating</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-[3px] text-zinc-600 text-xs font-normal">
                    <IoLocationOutline className="w-4 h-4" />
                    <span>{currentPro.distance}km away</span>
                  </div>
                  <div className="flex items-center gap-[3px] text-zinc-600 text-xs font-normal">
                    <HiOutlineBriefcase className="w-4 h-4" />
                    <span>{currentPro.completedJobs} Jobs completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-3">
            <h4 className="text-neutral-700 text-sm font-semibold leading-5">Professional's Review</h4>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {currentPro.reviews?.map((review: any, idx: number) => (
                <ReviewCard key={idx} review={review} />
              )) || (
                <div className="w-full text-center py-4 text-zinc-400 text-sm">No reviews available</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5">
            <Button
              variant="outline"
              onClick={() => setStep(6)} // Re-match logic
              className="flex-1 h-11 border-red-600 text-red-600 hover:bg-red-50 rounded-xl font-medium"
            >
              Reject and Re-match
            </Button>
            <Button
              onClick={() => handleConfirmSelection(currentPro.id)}
              disabled={isPending}
              className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl font-medium"
            >
              Confirm and Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
