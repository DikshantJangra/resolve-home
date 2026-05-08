'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export const ReviewStep = () => {
  const { 
    priority, 
    serviceType, 
    issueDetails, 
    location, 
    scheduledDate,
    scheduledTime,
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
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-10 space-y-8 overflow-y-auto no-scrollbar">
        {reviewItems.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <Label className="text-neutral-700 text-base font-semibold font-['Inter'] leading-6">
              {item.label}
            </Label>
            <div className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 mt-auto flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(4)}
          className="flex-1 h-11 border-zinc-300 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl"
        >
          Confirm and Match With a Pro
        </Button>
      </div>
    </div>
  )
}
