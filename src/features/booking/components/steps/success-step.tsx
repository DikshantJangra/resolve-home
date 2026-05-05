'use client'

import React from 'react'
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCheckCircle } from 'react-icons/hi'
import { IoLocationOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'
import { Button } from '@/components/ui/button'

export const SuccessStep = () => {
  const { resetBooking } = useBookingStore()

  const reviews = [
    {
      id: 1,
      rating: 5,
      location: 'Lagos, Nigeria',
      title: 'Fix our 3phase inverter pumping machine',
      content: 'From the first consultation to the final touches, Refit delivered on every promise. Our home extension is exactly what we wanted.',
    },
    {
      id: 2,
      rating: 5,
      location: 'Lagos, Nigeria',
      title: 'Fix our 3phase inverter pumping machine',
      content: 'From the first consultation to the final touches, Refit delivered on every promise. Our home extension is exactly what we wanted.',
    }
  ]

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-xl overflow-hidden m-5">
      <div className="flex-1 p-5 space-y-8 overflow-y-auto">
        {/* Pro Profile Header */}
        <div className="flex items-start gap-4">
          <img 
            className="w-20 h-20 rounded-full object-cover" 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
            alt="Pro"
          />
          <div className="space-y-3.5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-neutral-700 text-base font-semibold leading-6">Engr Adeoye Tololopo</h3>
                <span className="text-orange-500 text-xs font-semibold px-2 py-0.5 bg-orange-50 rounded-sm">Pro Verified</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600 text-xs">
                <span>Electrician</span>
                <span className="w-1 h-1 bg-blue-700 rounded-full" />
                <HiOutlineStar className="text-amber-500 w-3 h-3" />
                <span>4.9 Rating</span>
              </div>
            </div>
            
            <div className="flex items-center gap-5 text-zinc-600 text-xs">
              <div className="flex items-center gap-1">
                <HiOutlineLocationMarker className="w-4 h-4" />
                <span>2.4km away</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineBriefcase className="w-4 h-4" />
                <span>10 Jobs completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-3">
          <h4 className="text-neutral-700 text-sm font-semibold leading-5">Professional's Review</h4>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="min-w-[288px] p-3 bg-white rounded-[10px] border border-zinc-200 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar key={i} className="text-amber-400 w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                    <IoLocationOutline className="w-3 h-3" />
                    <span>{review.location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-neutral-800 text-sm font-medium">{review.title}</h5>
                  <p className="text-zinc-700 text-xs leading-4">{review.content}</p>
                </div>
                {/* Review Images */}
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 h-16 bg-zinc-100 rounded-sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 bg-white flex gap-5">
        <Button
          variant="outline"
          className="flex-1 h-11 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
        >
          Reject and Re-match
        </Button>
        <Button
          onClick={() => {
            alert('Confirmed! Redirecting to chat...')
            resetBooking()
          }}
          className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 text-neutral-50 rounded-xl"
        >
          Confirm and Message
        </Button>
      </div>
    </div>
  )
}
