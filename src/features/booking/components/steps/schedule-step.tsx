'use client'

import React, { useState } from 'react'
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { format, addDays } from 'date-fns'

export const ScheduleStep = () => {
  const { setStep, scheduledDate, setScheduledDate, scheduledTime, setScheduledTime } = useBookingStore()
  
  const [selectedDate, setSelectedDate] = useState(scheduledDate || format(new Date(), 'yyyy-MM-dd'))
  const [selectedTime, setSelectedTime] = useState(scheduledTime || '10:00')

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))
  
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const handleContinue = () => {
    setScheduledDate(selectedDate)
    setScheduledTime(selectedTime)
    setStep(4) // Move to Review
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-5 pt-10 space-y-8 overflow-y-auto">
        <div className="space-y-4">
          <Label className="text-neutral-700 text-base font-semibold">Select Date</Label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const isSelected = selectedDate === dateStr
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-w-[80px] p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    isSelected ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-zinc-200 text-zinc-600'
                  }`}
                >
                  <span className="text-xs font-medium">{format(date, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(date, 'd')}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-neutral-700 text-base font-semibold">Select Time</Label>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    isSelected ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-zinc-200 text-zinc-600'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="p-5 mt-auto flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(3)}
          className="flex-1 h-11 border-zinc-300 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
