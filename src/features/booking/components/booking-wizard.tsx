'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { BookingHeader } from './booking-header'
import { PriorityStep } from './steps/priority-step'
import { IssueDetailsStep } from './steps/issue-details-step'
import { LocationStep } from './steps/location-step'
import { ReviewStep } from './steps/review-step'
import { MatchingStep } from './steps/matching-step'
import { SuccessStep } from './steps/success-step'

export const BookingWizard = () => {
  const { currentStep } = useBookingStore()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PriorityStep />
      case 2:
        return <IssueDetailsStep />
      case 3:
        return <LocationStep />
      case 4:
        return <ReviewStep />
      case 5:
        return <MatchingStep />
      case 6:
        return <SuccessStep />
      default:
        return <PriorityStep />
    }
  }

  const getStepTitle = () => {
    if (currentStep === 6) return 'Book a service'
    return 'Book a service'
  }

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Select Priority'
      case 2:
        return 'Describe the issue'
      case 3:
        return 'Where are you?'
      case 4:
        return 'Review and checkout'
      case 5:
        return 'Finding professional'
      case 6:
        return 'Professional matched'
      default:
        return 'Select Priority'
    }
  }

  return (
    <div className="w-full max-w-[669px] h-[960px] mx-auto bg-white flex flex-col shadow-2xl rounded-2xl overflow-hidden relative">
      <BookingHeader 
        title={getStepTitle()}
        subtitle={getStepSubtitle()}
        currentStep={currentStep > 4 ? 4 : currentStep} // Progress bar stays at 4 for review/success
        totalSteps={4}
      />
      <div className="flex-1 overflow-hidden">
        {renderStep()}
      </div>
    </div>
  )
}
