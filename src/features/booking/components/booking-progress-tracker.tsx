'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ProgressStep } from '../types'

interface BookingProgressTrackerProps {
  steps: ProgressStep[]
}

export const BookingProgressTracker = ({ steps }: BookingProgressTrackerProps) => {
  return (
    <div className="w-full h-10 relative flex justify-between items-start mt-2">
      {/* Background Lines */}
      <div className="absolute top-2 left-0 w-full flex justify-between px-4">
        {steps.slice(0, -1).map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-[3px] flex-1 mx-1 rounded-[10px]",
              steps[index].status === 'completed' ? "bg-blue-600" : "bg-zinc-200"
            )}
          />
        ))}
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <div 
          key={index}
          className="flex flex-col items-center gap-1 z-10"
        >
          <div className={cn(
            "w-4 h-4 rounded-full transition-colors",
            step.status === 'completed' ? "bg-blue-600" : 
            step.status === 'current' ? "bg-blue-600 border-2 border-white ring-2 ring-blue-600" : 
            "bg-zinc-200"
          )} />
          <span className={cn(
            "text-[10px] md:text-xs font-medium font-['Inter'] leading-4 transition-colors",
            step.status === 'pending' ? "text-stone-400" : "text-stone-600"
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}
