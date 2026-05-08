'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  HiOutlineChevronLeft, 
  HiOutlineClock, 
  HiOutlineStar, 
  HiOutlineBriefcase,
  HiOutlinePhone,
  HiOutlineChatAlt,
  HiOutlineLocationMarker
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { BookingProgressTracker } from '@/features/booking/components/booking-progress-tracker'
import { ReviewCard } from '@/features/booking/components/review-card'
import { ReviewForm } from '@/features/booking/components/review-form'
import { Button } from '@/components/ui/button'
import { useBookingDetail } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import { ProgressStep } from '@/features/booking/types'

export default function BookingDetailsPage() {
  const { id } = useParams()
  const { data: booking, isLoading, error } = useBookingDetail(id as string)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-zinc-500">Failed to load booking details.</p>
        <Link href="/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    )
  }

  // Map backend status to progress steps
  const statusSteps: ProgressStep[] = [
    { label: 'Pending', status: (booking.status === 'pending' ? 'current' : (['confirmed', 'in-progress', 'completed'].includes(booking.status) ? 'completed' : 'pending')) as any },
    { label: 'Confirmed', status: (booking.status === 'confirmed' ? 'current' : (['in-progress', 'completed'].includes(booking.status) ? 'completed' : 'pending')) as any },
    { label: 'In Progress', status: (booking.status === 'in-progress' ? 'current' : (['completed'].includes(booking.status) ? 'completed' : 'pending')) as any },
    { label: 'Completed', status: (booking.status === 'completed' ? 'current' : 'pending') as any },
  ]

  // For real app, professional data might come from another fetch or populate
  // If not available, show a placeholder
  const hasEngineer = booking.engineers && booking.engineers.length > 0
  const engineer = hasEngineer ? booking.engineers[0] : null

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Link 
        href="/bookings" 
        className="inline-flex items-center gap-1 text-zinc-600 hover:text-blue-700 transition-colors group"
      >
        <HiOutlineChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Bookings details</span>
      </Link>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <HiWrenchScrewdriver className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-neutral-700 text-lg font-semibold">{booking.service?.name || 'Service'}</h2>
                <span className="text-zinc-500 text-[10px] font-medium px-2 py-0.5 bg-zinc-50 rounded uppercase">
                  JOB ID: {booking.id.slice(0, 8)}
                </span>
              </div>
              <p className="text-zinc-500 text-sm">{booking.notes || booking.service?.description}</p>
            </div>
          </div>
          <div className="px-5 py-1.5 bg-orange-50 text-orange-500 rounded-full text-xs font-medium capitalize">
            {booking.status}
          </div>
        </div>

        {/* Progress Tracker Section */}
        <div className="py-6 border-t border-b border-zinc-50 flex flex-col md:flex-row items-center gap-8">
          {engineer ? (
            <div className="flex items-center gap-3 shrink-0">
              <img 
                src={engineer.image || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop"} 
                alt={engineer.name} 
                className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm font-semibold">{engineer.name}</span>
                <div className="flex items-center gap-1">
                  <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-gray-700 text-xs font-semibold">4.8</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 shrink-0 italic text-zinc-400 text-sm">
              Waiting for engineer assignment...
            </div>
          )}

          <div className="flex-1 w-full min-w-0 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
             <BookingProgressTracker steps={statusSteps} />
          </div>
        </div>

        {/* Schedule Info */}
        <div className="flex items-center gap-4 text-neutral-700 flex-wrap">
          <div className="flex items-center gap-2">
            <HiOutlineClock className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-medium">{booking.scheduledDate} at {booking.scheduledTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-medium">{booking.customerDetails?.address || 'Address provided'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-5 h-[520px] bg-stone-200 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-700/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 bg-blue-700 rounded-full border-4 border-white" />
                </div>
                <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-zinc-200">
                  <span className="text-xs font-semibold text-blue-700">Live Tracking</span>
                </div>
             </div>
          </div>
          {/* Custom Map UI element from Figma */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12">
             <div className="w-10 h-12 relative flex justify-center">
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                   <HiOutlineBriefcase className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 w-2 h-2 bg-blue-700 rotate-45 border-b border-r border-white" />
             </div>
          </div>
        </div>

        {/* Professional Profile & Reviews */}
        <div className="lg:col-span-7 bg-stone-50 rounded-2xl p-6 flex flex-col gap-8 border border-zinc-100">
          {engineer ? (
            <>
              <div className="flex items-center gap-4">
                <img 
                  src={engineer.image || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop"} 
                  alt={engineer.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-neutral-700 text-lg font-bold">{engineer.name}</h3>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">Pro Verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 text-xs">
                    <div className="flex items-center gap-1">
                      <span>Professional Engineer</span>
                      <div className="w-1 h-1 bg-blue-700 rounded-full mx-1" />
                      <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>4.8 Rating</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-xs">
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                      2.4km away
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineBriefcase className="w-3.5 h-3.5" />
                      10+ Jobs completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-neutral-700 text-sm font-semibold">Professional&apos;s Review</h4>
                
                {booking.status === 'completed' ? (
                  booking.review ? (
                    <ReviewCard 
                      review={{
                        id: booking.review.id || 'rev-1',
                        rating: booking.review.rating || 5,
                        comment: booking.review.comment || '',
                        location: booking.location?.city || 'Local',
                        title: 'Job Completed',
                        images: []
                      }} 
                    />
                  ) : (
                    <ReviewForm 
                      bookingId={booking.id} 
                      onSuccess={() => {
                        // Query invalidation handled in hook
                      }}
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center p-8 bg-white rounded-xl border border-dashed border-zinc-200 italic text-zinc-400 text-sm">
                    Reviews will be available after completion.
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-auto">
                <Button variant="outline" className="flex-1 h-12 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl">
                  <HiOutlinePhone className="w-5 h-5 mr-2" />
                  Call Engineer
                </Button>
                <Button className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl">
                  <HiOutlineChatAlt className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                <HiOutlineBriefcase className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="text-center">
                <h3 className="text-neutral-700 text-lg font-bold">Matching in progress...</h3>
                <p className="text-zinc-500 text-sm max-w-[280px] mx-auto mt-2">
                  We are currently matching the best professional for your request. You&apos;ll be notified once assigned.
                </p>
              </div>
              <Button variant="outline" className="mt-4 border-zinc-200 text-zinc-600">
                Contact Support
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
