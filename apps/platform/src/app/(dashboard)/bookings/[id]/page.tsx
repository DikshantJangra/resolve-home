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
import { Button, cn, formatImageUrl } from "@resolve/ui"
import { useBookingDetail, useCancelBooking, useBookingQuotation, useUserProfile } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ProgressStep } from '@/features/booking/types'

export default function BookingDetailsPage() {
  const { id } = useParams()
  const { data: userProfile } = useUserProfile()
  const { data: booking, isLoading, error } = useBookingDetail(id as string)
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const { data: quotation } = useBookingQuotation(id as string)

  const isWorker = userProfile?.user?.role === 'worker'

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

  const engineer = booking.engineers?.[0] || booking.engineer
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
               <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                <span className="text-zinc-500 text-[10px] font-medium uppercase">JOB ID: #RH-{booking.id.slice(-6).toUpperCase()}</span>
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
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src={displayImage} 
              alt={displayName} 
              className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-gray-700 text-sm font-semibold">{displayName}</span>
              <div className="flex items-center gap-1">
                <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-gray-700 text-xs font-semibold">4.9</span>
              </div>
            </div>
          </div>

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
                 <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
               </svg>
            </div>
            <span className="text-neutral-700 text-xs">ETA - 20 - 30 mins</span>
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
        <div className="lg:col-span-5 h-[520px] bg-stone-300 rounded-2xl relative overflow-hidden group shadow-sm border border-zinc-100">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2 scale-110">
                <div className="relative">
                   <div className="w-12 h-12 bg-blue-700/20 rounded-full flex items-center justify-center animate-ping absolute inset-0" />
                   <div className="w-12 h-12 bg-blue-700/20 rounded-full flex items-center justify-center relative">
                      <div className="w-5 h-5 bg-blue-700 rounded-full border-4 border-white shadow-md" />
                   </div>
                </div>
                <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-100 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">Active Tracking</span>
                </div>
             </div>
          </div>
        </div>

        {/* Profile and Review Sidebar */}
        <div className="lg:col-span-7 flex flex-col gap-6">
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
                    <span className="text-zinc-600 text-xs font-medium">4.9 Rating</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                    <span>2.4km away</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <HiOutlineBriefcase className="w-3.5 h-3.5" />
                    <span>10 Jobs completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="flex flex-col gap-4">
              <h4 className="text-neutral-700 text-sm font-semibold">Professional&apos;s Review</h4>
              <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-2 no-scrollbar">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-zinc-100 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <HiOutlineStar key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
                        <HiOutlineLocationMarker className="w-3 h-3" />
                        Lagos, Nigeria
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-neutral-800 text-sm font-bold leading-tight">Fix our 3phase inverter pumping machine</p>
                      <p className="text-zinc-600 text-xs leading-relaxed">
                        From the first consultation to the final touches, Refit delivered on every promise. Our home extension is exactly what we wanted.
                      </p>
                    </div>
                    <div className="flex gap-2">
                       <div className="flex-1 h-16 bg-zinc-100 rounded-lg overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 h-16 bg-zinc-100 rounded-lg overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=200" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 h-16 bg-black/5 rounded-lg flex items-center justify-center">
                          <span className="text-zinc-400 text-xs font-bold">+2</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-100">
              <Button variant="outline" className="flex-1 h-12 border-red-600 text-red-600 hover:bg-red-50 rounded-xl font-semibold shadow-sm">
                Call {isWorker ? 'Homeowner' : 'Engineer'}
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard/messages'}
                className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl font-semibold shadow-md shadow-blue-700/10"
              >
                Send Message
              </Button>
            </div>
          </div>

          {/* Quotation View Integration */}
          {quotation && <QuotationView quotation={quotation} />}
        </div>
      </div>
    </div>
  )
}
