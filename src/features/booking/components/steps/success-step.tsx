'use client'

import React, { useState } from 'react'
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCheckCircle } from 'react-icons/hi'
import { IoLocationOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { useSelectEngineer } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { usePaystackPayment } from 'react-paystack'

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
        // 2. Call select-engineer API
        // In a real app, we'd pass the reference to the backend to verify
        toast.success("Payment successful!")
        selectEngineer({ bookingId: bookingId || "", engineerId }, {
          onSuccess: () => {
            toast.success("Professional matched successfully!")
            setStep(8) // Actual Success
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

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-xl overflow-hidden m-5">
      <div className="flex-1 p-5 space-y-8 overflow-y-auto">
        <h4 className="text-neutral-700 text-sm font-semibold leading-5">Available Professionals Near You</h4>
        
        {availableEngineers.map((engineer) => (
          <div key={engineer.id} className="bg-white p-5 rounded-xl border border-zinc-200 space-y-5">
            {/* Pro Profile Header */}
            <div className="flex items-start gap-4">
              <img 
                className="w-16 h-16 rounded-full object-cover" 
                src={engineer.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"} 
                alt={engineer.name}
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-neutral-700 text-base font-semibold leading-6">{engineer.name}</h3>
                  <span className="text-orange-500 text-[10px] font-semibold px-2 py-0.5 bg-orange-50 rounded-sm uppercase tracking-wider">Pro Verified</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-600 text-xs">
                  <HiOutlineStar className="text-amber-500 w-3 h-3" />
                  <span>{engineer.rating} Rating</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full mx-1" />
                  <span>{engineer.completedJobs} Jobs completed</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500 text-xs">
                  <HiOutlineLocationMarker className="w-4 h-4" />
                  <span>{engineer.distance}km away</span>
                </div>
              </div>
            </div>

            {/* Reviews Preview */}
            {engineer.reviews && engineer.reviews.length > 0 && (
              <div className="space-y-3">
                <p className="text-zinc-600 text-xs italic">
                  "{engineer.reviews[0].comment}"
                </p>
              </div>
            )}

            <Button
              onClick={() => handleConfirmSelection(engineer.id)}
              disabled={isPending}
              className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl text-xs font-semibold"
            >
              Select and Pay ₦5,000
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
