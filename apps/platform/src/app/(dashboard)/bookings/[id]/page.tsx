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
import { QuotationView } from '@/features/booking/components/quotation-view'
import { Map, type MapViewport } from '@/components/ui/map'
import { Button, cn, formatImageUrl } from "@resolve/ui"
import { useBookingDetail, useCancelBooking, useBookingQuotation, useUserProfile, useAvailableEngineers } from '@/hooks/api-hooks'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ProgressStep } from '@/features/booking/types'

export default function BookingDetailsPage() {
  const { id } = useParams()
  const { data: userProfile } = useUserProfile()
  const { data: booking, isLoading, error } = useBookingDetail(id as string)
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const { data: quotation } = useBookingQuotation(id as string)
  const queryClient = useQueryClient()

  const engineer = !isLoading && booking
    ? (booking.engineer || booking.engineers?.[0] || null)
    : null
  const hasNoEngineer = !isLoading && !!booking && !engineer

  const { refetch: refetchEngineers, isFetching: isRefetchingEngineers } = useAvailableEngineers(
    hasNoEngineer ? id as string : ''
  )

  const handleRefreshPro = async () => {
    await queryClient.invalidateQueries({ queryKey: ['booking-detail', id] })
    if (hasNoEngineer) {
      const result = await refetchEngineers()
      if (result.data?.engineers?.length > 0) {
        await queryClient.invalidateQueries({ queryKey: ['booking-detail', id] })
      }
    }
  }

  const isWorker = userProfile?.user?.role === 'worker'

  const [mapViewport, setMapViewport] = React.useState<MapViewport>({
    center: [-3.4, 6.4],
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

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

  const statusSteps: ProgressStep[] = [
    { label: 'Pro Matched', status: (['pending', 'confirmed', 'in_progress', 'completed'].includes(booking.status) ? 'completed' : 'pending') as any },
    { label: 'On the way', status: (booking.status === 'on_the_way' ? 'current' : (['in_progress', 'completed'].includes(booking.status) ? 'completed' : 'pending')) as any },
    { label: 'Arrived', status: (booking.status === 'arrived' ? 'current' : (['in_progress', 'completed'].includes(booking.status) ? 'completed' : 'pending')) as any },
    { label: 'In progress', status: (booking.status === 'in_progress' ? 'current' : (['completed'].includes(booking.status) ? 'completed' : 'pending')) as any },
    { label: 'Completed', status: (booking.status === 'completed' ? 'current' : 'pending') as any },
  ]

  const customer = booking.user

  const displayUser = isWorker ? customer : engineer
  const displayName = displayUser?.name || (isWorker ? 'Homeowner' : 'Professional')
  const displayImage = displayUser?.image ? formatImageUrl(displayUser.image) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`
  const userRole = isWorker ? 'Homeowner' : (engineer?.role || 'Professional')

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-3">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-zinc-600 hover:text-blue-700 transition-colors group"
        >
          <div className="w-5 h-5 flex items-center justify-center rotate-180">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-medium">Bookings details</span>
        </Link>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-5 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 px-2.5 rounded-xl flex items-center justify-center shrink-0",
              booking.urgency?.toUpperCase() === 'EMERGENCY' ? "bg-red-600" : "bg-blue-50"
            )}>
              <HiWrenchScrewdriver className={cn("w-5 h-5", booking.urgency?.toUpperCase() === 'EMERGENCY' ? "text-white" : "text-blue-700")} />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-neutral-700 text-base font-semibold">{booking.service?.name || 'Service'}</h2>
                <span className="text-zinc-500 text-[10px] font-medium uppercase">JOB ID: #RH-{booking.id ? booking.id.slice(-6).toUpperCase() : 'N/A'}</span>
              </div>
              <p className="text-zinc-600 text-xs">{booking.notes || 'Job details and investigation required.'}</p>
            </div>
          </div>
          <div className={cn(
            "px-5 py-1.5 rounded-full flex items-center shrink-0",
            booking.status === 'in_progress' ? "bg-stone-500/10" : "bg-emerald-500/10"
          )}>
            <div className={cn(
              "text-xs font-medium capitalize",
              booking.status === 'in_progress' ? "text-stone-500" : "text-green-700"
            )}>
              {booking.status?.replace('_', ' ') || 'Pending'}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Timeline */}
        <div className="py-4 border-t border-b border-stone-50 flex flex-col md:flex-row items-center gap-10">
          {engineer && (
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={displayImage}
                alt={displayName}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm font-semibold">{displayName}</span>
                {engineer?.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-gray-700 text-xs font-semibold">{engineer.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 w-full min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[500px] px-2">
              {statusSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                      step.status === 'completed' ? "bg-blue-700" : step.status === 'current' ? "bg-blue-700" : "bg-zinc-200"
                    )}>
                      {step.status === 'completed' ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
                      )}
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium whitespace-nowrap",
                      step.status !== 'pending' ? "text-neutral-700" : "text-zinc-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-[2px] -mt-6 transition-colors duration-500",
                      statusSteps[idx + 1].status !== 'pending' ? "bg-blue-700" : "bg-zinc-200"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduling Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 text-blue-700">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-neutral-700 text-xs">
              {booking.scheduledDate && booking.scheduledTime
                ? `Scheduled: ${format(new Date(`${booking.scheduledDate}T${booking.scheduledTime}`), 'MMM d, yyyy · h:mm a')}`
                : 'Schedule pending'}
            </span>
          </div>
          {booking.address && (
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker className="w-3.5 h-3.5 text-red-600" />
              <span className="text-zinc-600 text-xs">{booking.address}, {booking.city || 'Lagos'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Visualization */}
        <div className="lg:col-span-5 h-[520px] rounded-2xl relative overflow-hidden shadow-sm border border-zinc-100">
          <Map viewport={mapViewport} onViewportChange={setMapViewport} />
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">Active Tracking</span>
          </div>
        </div>

        {/* Profile and Review Sidebar */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!engineer ? (
            <div className="p-6 bg-stone-50 rounded-2xl flex flex-col items-center justify-center gap-4 border border-zinc-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                <HiOutlineBriefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-700">No Pro Partner Assigned Yet</h3>
              <p className="text-zinc-600 text-sm">We're still finding the best Pro Partner for your request.</p>
              <Button
                onClick={handleRefreshPro}
                disabled={isRefetchingEngineers}
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg className={cn('w-4 h-4', isRefetchingEngineers && 'animate-spin')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isRefetchingEngineers ? 'Checking...' : 'Refresh'}
              </Button>
              {isCancelling ? (
                <Button disabled>Cancelling...</Button>
              ) : (
                <Button onClick={() => cancelBooking(id as string)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">Cancel Booking</Button>
              )}
            </div>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl flex flex-col gap-8 border border-zinc-100 shadow-sm">
              {/* User Profile Header */}
              <div className="flex items-center gap-4">
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-neutral-700 text-base font-bold">{displayName}</h3>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">Pro Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-600 text-xs">{userRole}</span>
                    <div className="w-1 h-1 bg-blue-700 rounded-full" />
                    <div className="flex items-center gap-1">
                      <HiOutlineStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-zinc-600 text-xs font-medium">{engineer?.rating || 0} Rating</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <HiOutlineBriefcase className="w-4 h-4" />
                      <span>{engineer?.completedJobs || 0} Jobs Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <HiOutlineLocationMarker className="w-4 h-4" />
                      <span>{engineer?.distance ? `${engineer.distance}km away` : '---'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex gap-4">
                {engineer?.phone && (
                  <Link
                    href={`tel:${engineer.phone}`}
                    className="flex-1 h-11 px-6 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-blue-700 flex justify-center items-center gap-2.5 transition-all hover:bg-blue-50 active:scale-[0.98]"
                  >
                    <HiOutlinePhone className="w-5 h-5 text-blue-700" />
                    <div className="justify-start text-blue-700 text-sm font-medium leading-5">Call Pro Partner</div>
                  </Link>
                )}
                <Link
                  href={`/chats?bookingId=${booking.id}`}
                  className="flex-1 h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-center items-center gap-2.5 transition-all shadow-md active:scale-[0.98] hover:bg-blue-800"
                >
                  <HiOutlineChatAlt className="w-5 h-5 text-white" />
                  <div className="justify-start text-neutral-50 text-sm font-medium leading-5">Chat with Pro Partner</div>
                </Link>
              </div>

              {/* Quotation View */}
              {quotation && quotation.quotation && (
                <QuotationView quotation={quotation.quotation} />
              )}

              {/* Review Section (if completed booking) */}
              {booking.status === 'completed' && !booking.review && engineer && (
                <ReviewForm bookingId={booking.id} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
