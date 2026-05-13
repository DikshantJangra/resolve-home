'use client'

import React, { useState } from 'react'
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCheckCircle } from 'react-icons/hi'
import { IoLocationOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { useSelectEngineer } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { usePaystackPayment } from 'react-paystack'
import { ReviewCard } from '../review-card'
import { useAuthSession } from '@/hooks/api-hooks'

export const SuccessStep = () => {
  const { mutate: selectEngineer, isPending } = useSelectEngineer()
  const { availableEngineers, resetBooking, setStep, selectedEngineerId, setSelectedEngineerId, bookingId } = useBookingStore()
  const { data: session } = useAuthSession()
  const user = session?.user

  const currentPro = availableEngineers[0]
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "customer@email.com",
    amount: (currentPro?.price || 10000) * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  };

  const initializePayment = usePaystackPayment(config);

  const handleConfirmSelection = (engineerId: string) => {
    initializePayment({
      onSuccess: (response) => {
        toast.success("Payment successful!")
        selectEngineer({ 
          bookingId: bookingId || "", 
          engineerId,
          paymentReference: (response as any).reference
        }, {
          onSuccess: () => {
            toast.success("Professional matched successfully!")
            setStep(8)
          },
          onError: (err: any) => {
            console.error('[SuccessStep] Failed to confirm engineer:', err)
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
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4 bg-white">
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
        <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col justify-center items-start gap-8 overflow-hidden">
          <div className="self-stretch inline-flex justify-start items-start gap-4">
            <div className="flex justify-start items-center gap-3">
              <img 
                className="w-20 h-20 rounded-full object-cover shadow-sm" 
                src={currentPro.image || "https://placehold.co/88x88"} 
                alt={currentPro.name}
              />
              <div className="inline-flex flex-col justify-start items-start gap-3.5">
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="inline-flex justify-start items-end gap-2">
                    <div className="justify-start text-neutral-700 text-base font-semibold font-['Inter'] leading-6">{currentPro.name}</div>
                    <div className="w-16 h-5 justify-center text-orange-500 text-[10px] font-semibold font-['Inter'] leading-4">Pro Verified</div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-1">
                    <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4">{currentPro.specialization || 'Professional'}</div>
                    <div className="w-1 bg-blue-700 rounded-full h-1" />
                    <div className="w-3 h-3 bg-amber-500 rounded-sm flex items-center justify-center">
                       <HiOutlineStar className="text-white w-2 h-2" />
                    </div>
                    <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4">{currentPro.rating} Rating</div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-5">
                  <div className="flex justify-start items-center gap-[3px]">
                    <IoLocationOutline className="w-4 h-4 text-zinc-600" />
                    <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4">{currentPro.distance}km away</div>
                  </div>
                  <div className="flex justify-start items-center gap-[3px]">
                    <HiOutlineBriefcase className="w-4 h-4 text-zinc-600" />
                    <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4">{currentPro.completedJobs} Jobs completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="justify-start text-neutral-700 text-sm font-semibold font-['Inter'] leading-5">Professional's Review</div>
            <div className="self-stretch inline-flex justify-start items-start gap-3 overflow-x-auto no-scrollbar pb-2">
              {currentPro.reviews?.map((review: any, idx: number) => (
                <ReviewCard key={idx} review={review} />
              )) || (
                <div className="w-full text-center py-4 text-zinc-400 text-sm italic">No reviews available yet</div>
              )}
            </div>
          </div>

          <div className="self-stretch inline-flex justify-start items-start gap-5">
            <button
              onClick={() => setStep(6)}
              className="flex-1 h-11 px-6 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-red-600 flex justify-center items-center gap-2.5 transition-all hover:bg-red-50 active:scale-[0.98]"
            >
              <div className="justify-start text-red-600 text-sm font-medium font-['Inter'] leading-5">Reject and Re-match</div>
            </button>
            <button
              onClick={() => handleConfirmSelection(currentPro.id)}
              disabled={isPending}
              className={`flex-1 h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-center items-center gap-2.5 transition-all shadow-md active:scale-[0.98] ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'
              }`}
            >
              <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Confirm and Message</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
