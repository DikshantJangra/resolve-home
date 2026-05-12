'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { Button } from "@resolve/ui"
import { Label } from "@resolve/ui"
export const ReviewStep = () => {
  const { 
    priority, 
    serviceType, 
    issueDetails, 
    location, 
    setStep 
  } = useBookingStore()

  const handleConfirm = () => {
    setStep(6) // Move to matching state
  }

  const reviewItems = [
    {
      label: 'Urgency',
      value: priority === 'Emergency' ? 'Emergency fix' : 'Standard fix',
    },
    {
      label: 'Service Required',
      value: serviceType,
    },
    {
      label: 'Details',
      value: issueDetails,
    },
    {
      label: 'Location Details',
      value: location 
        ? `${location.state}, ${location.city}, ${location.streetAddress} (${location.landmark})`
        : 'Not provided',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 px-5 pt-10 space-y-8 overflow-y-auto no-scrollbar">
        {reviewItems.map((item, index) => (
          <div key={index} className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch inline-flex justify-start items-start gap-0.5">
              <Label className="text-neutral-700 text-base font-semibold font-['Inter'] leading-6">
                {item.label}
              </Label>
            </div>
            <div className="self-stretch rounded-lg inline-flex justify-start items-start gap-2.5">
              <div className="flex-1 justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 mt-auto bg-white border-t border-zinc-100">
        <button
          onClick={handleConfirm}
          className="w-full h-11 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl flex justify-between items-center transition-all shadow-lg active:scale-[0.98]"
        >
          <div className="justify-start text-neutral-50 text-sm font-medium font-['Inter'] leading-5">Confirm and Match With a Pro</div>
        </button>
      </div>
    </div>
  )
}
