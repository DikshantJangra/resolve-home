'use client'

import React from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'

interface BookingHeaderProps {
  title?: string
  subtitle?: string
  currentStep: number
  totalSteps: number
}

function getStepDescription(step: number) {
  switch (step) {
    case 1:
      return 'What service do you need help with?'
    case 2:
      return 'How quickly do you need our professional?'
    case 3:
      return 'Be as detailed as possible to help the person coming to prepare.'
    case 4:
      return 'Provide the location where the Pro will be working.'
    case 5:
      return 'Review your request and proceed to check out'
    default:
      return ''
  }
}

export const BookingHeader = ({ 
  title = 'Book a Pro', 
  subtitle = 'Request Details', 
  currentStep, 
  totalSteps 
}: BookingHeaderProps) => {
  const { resetBooking, setStep } = useBookingStore()

  return (
    <div className="w-full space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-700 font-['Plus_Jakarta_Sans'] leading-8">
          {title}
        </h1>
        <button 
          onClick={() => {
            if (currentStep > 1) {
              setStep(currentStep - 1)
            } else {
              resetBooking()
            }
          }}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
        >
          <div className="relative w-6 h-6 border-1.5 border-blue-700 rounded-sm flex items-center justify-center">
            <IoCloseOutline className="w-5 h-5" />
          </div>
          <span className="text-base font-normal font-['Inter'] leading-6">
            {currentStep > 1 ? 'Go Back' : 'Close'}
          </span>
        </button>
      </div>

      {currentStep <= 5 && (
        <div className="space-y-2.5">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-neutral-700 font-['Inter'] leading-6">
              {subtitle}
            </h2>
            <p className="text-sm font-normal text-zinc-600 font-['Inter'] leading-5">
              {getStepDescription(currentStep)}
            </p>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-[100px] transition-colors duration-300 ${
                  index + 1 <= currentStep ? 'bg-blue-700' : 'bg-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {currentStep > 5 && (
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-neutral-700 font-['Inter'] leading-6">
            {subtitle}
          </h2>
          {currentStep === 6 && (
            <p className="text-sm font-normal text-zinc-600 font-['Inter'] leading-5">
              A professional has been matched with you, check below for professional's detail and contact them.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
