'use client'

import React from 'react'
import { useBookingStore } from '@/store/booking-store'
import { BookingHeader } from './booking-header'
import { PriorityStep } from './steps/priority-step'
import { IssueDetailsStep } from './steps/issue-details-step'
import { LocationStep } from './steps/location-step'
import { ScheduleStep } from './steps/schedule-step'
import { ReviewStep } from './steps/review-step'
import { MatchingStep } from './steps/matching-step'
import { SuccessStep } from './steps/success-step'
import { FinalSuccessStep } from './steps/final-success-step'

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
        return <ScheduleStep />
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

  const getStepTitle = () => {
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
        return 'Schedule'
      case 5:
        return 'Review and checkout'
      case 6:
        return 'Finding professional'
      case 7:
        return 'Select Professional'
      case 8:
        return 'Booking Confirmed'
      default:
        return 'Select Priority'
    }
  }

  return (
    <div className="w-full max-w-[669px] h-[960px] mx-auto bg-white flex flex-col shadow-2xl rounded-2xl overflow-hidden relative">
      <BookingHeader 
        title={getStepTitle()}
        subtitle={getStepSubtitle()}
        currentStep={currentStep > 5 ? 4 : (currentStep > 3 ? 3 : currentStep)} 
        totalSteps={4}
      />
      <div className="flex-1 overflow-hidden">
        {renderStep()}
      </div>
    </div>
  )
}
