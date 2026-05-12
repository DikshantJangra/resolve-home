'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { BookingHeader } from './booking-header'
import { ServiceStep } from './steps/service-step'
import { PriorityStep } from './steps/priority-step'
import { IssueDetailsStep } from './steps/issue-details-step'
import { LocationStep } from './steps/location-step'
import { ReviewStep } from './steps/review-step'
import { MatchingStep } from './steps/matching-step'
import dynamic from 'next/dynamic'

const SuccessStep = dynamic(() => import('./steps/success-step').then(mod => mod.SuccessStep), { ssr: false })
const FinalSuccessStep = dynamic(() => import('./steps/final-success-step').then(mod => mod.FinalSuccessStep), { ssr: false })

export const BookingWizard = () => {
  const { currentStep } = useBookingStore()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PriorityStep />
      case 2:
        return <ServiceStep />
      case 3:
        return <IssueDetailsStep />
      case 4:
        return <LocationStep />
      case 5:
        return <ReviewStep />
      case 6:
        return <MatchingStep />
      case 7:
        return <SuccessStep />
      case 8:
        return <FinalSuccessStep />
      default:
        return <PriorityStep />
    }
  }

  return (
    <div className="w-full max-w-[669px] min-h-[600px] max-h-[95vh] md:h-[960px] mx-auto bg-white flex flex-col shadow-2xl rounded-2xl overflow-hidden relative z-[998]">
      <BookingHeader />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderStep()}
      </div>
    </div>
  )
}
