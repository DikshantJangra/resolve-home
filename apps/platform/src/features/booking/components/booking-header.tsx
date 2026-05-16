'use client'

import React from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'

interface BookingHeaderProps {
  title?: string
}

export const BookingHeader = ({
  title = 'Book a service',
  onClose,
}: { title?: string; onClose?: () => void }) => {
  const { currentStep, resetBooking, setStep } = useBookingStore()

  const handleClose = () => {
    if (onClose) onClose()
    else resetBooking()
  }

  const stepTitle = React.useMemo(() => {
    switch (currentStep) {
      case 1: return 'Select Service'
      case 2: return 'Select Priority'
      case 3: return 'Describe the issue'
      case 4: return 'Where are you?'
      case 5: return 'Review and checkout'
      case 6: return 'Finding Pro Partner'
      case 7: return 'Professional matched'
      default: return 'Book a service'
    }
  }, [currentStep])

  const stepDescription = React.useMemo(() => {
    switch (currentStep) {
      case 1: return 'What service do you need help with?'
      case 2: return 'How quickly do you need our professional?'
      case 3: return 'Be as detailed as possible to help the person coming to prepare.'
      case 4: return 'Provide the location where the Pro will be working.'
      case 5: return 'Review your request and proceed to check out'
      case 6: return 'We are searching for the best Pro Partner near you.'
      case 7: return 'A professional has been matched with you, check below for professional\'s detail and contact them.'
      default: return ''
    }
  }, [currentStep])

  return (
    <div className="w-full space-y-6 p-5 bg-white shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-700 font-['Plus_Jakarta_Sans'] leading-8">
          {title}
        </h1>
        {currentStep > 1 && currentStep !== 6 ? (
          <button
            onClick={() => setStep(currentStep - 1)}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
          >
            <div className="w-6 h-6 relative flex items-center justify-center">
              <div className="w-2 h-4 border-l-[1.5px] border-b-[1.5px] border-blue-700 rotate-45 translate-x-1" />
            </div>
            <span className="text-base font-normal font-['Inter'] leading-6">Go Back</span>
          </button>
        ) : (
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 transition-colors text-neutral-600 hover:text-neutral-900"
            aria-label="Close"
          >
            <IoCloseOutline size={22} />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-neutral-700 font-['Inter'] leading-6">
            {stepTitle}
          </h2>
          {stepDescription && (
            <p className="text-sm font-normal text-zinc-600 font-['Inter'] leading-5">
              {stepDescription}
            </p>
          )}
        </div>

        {currentStep <= 5 && (
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-[100px] transition-all duration-300 ${index + 1 <= currentStep ? 'bg-blue-700' : 'bg-zinc-300'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
