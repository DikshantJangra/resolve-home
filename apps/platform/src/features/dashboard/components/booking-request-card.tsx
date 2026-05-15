'use client'

import React from 'react'
import { 
  HiOutlineClock, 
  HiOutlineLocationMarker,
  HiOutlineExclamationCircle,
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { cn, formatImageUrl } from "@resolve/ui"
import { format } from 'date-fns'
import Link from 'next/link'

interface BookingRequestCardProps {
  booking: any
  isWorker?: boolean
}

export const BookingRequestCard = ({ booking, isWorker = true }: BookingRequestCardProps) => {
  const isEmergency = booking.urgency?.toUpperCase() === 'EMERGENCY'
  const isUpcoming = ['PENDING', 'CONFIRMED'].includes(booking.status?.toUpperCase())
  const isInProgress = booking.status?.toUpperCase() === 'IN_PROGRESS'

  // Determine which user info to show (Client for worker, Worker for client)
  const displayUser = isWorker ? booking.user : (booking.engineer || booking.engineers?.[0])
  const displayName = displayUser?.name || null

  const categoryName = booking.service?.category?.name || 'Service'
  const serviceName = booking.service?.name || 'Service details'

  return (
    <Link href={`/bookings/${booking.id}`} className="block group">
      <div className="w-full md:w-96 p-3 bg-white rounded-2xl border border-zinc-100 flex flex-col justify-start items-start overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-blue-200">
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            {/* Header Section */}
            <div className="self-stretch h-10 inline-flex justify-between items-start">
              <div className="flex justify-start items-center gap-2.5">
                <div className={cn(
                  "w-9 h-9 px-2.5 rounded-[10px] flex justify-center items-center shrink-0",
                  isEmergency ? "bg-red-600" : "bg-blue-50"
                )}>
                  {isEmergency ? (
                    <HiOutlineExclamationCircle className="w-4 h-4 text-white" />
                  ) : (
                    <HiWrenchScrewdriver className="w-4 h-4 text-blue-700" />
                  )}
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="justify-start text-slate-900 text-sm font-semibold font-['Inter'] leading-5 truncate">{categoryName}</div>
                    {isEmergency && (
                      <div className="px-[6px] py-[2px] bg-red-600 rounded">
                        <div className="text-white text-[9px] font-medium font-['Inter'] leading-3">EMERGENCY</div>
                      </div>
                    )}
                  </div>
                  <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4 line-clamp-1">{serviceName}</div>
                </div>
              </div>
              <div className={cn(
                "h-6 px-3 py-1 rounded-full flex justify-start items-center shrink-0",
                isUpcoming ? "bg-orange-500/10" : isInProgress ? "bg-emerald-200/30" : "bg-stone-500/10"
              )}>
                <div className={cn(
                  "text-[10px] font-medium font-['Inter'] leading-4 capitalize",
                  isUpcoming ? "text-orange-500" : isInProgress ? "text-green-700" : "text-stone-500"
                )}>
                  {booking.status?.toLowerCase()?.replace('_', ' ') || 'Pending'}
                </div>
              </div>
            </div>

            {/* User Info & Price Section */}
            <div className="self-stretch h-12 py-2.5 border-t border-b border-stone-50 inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                {displayUser && displayName ? (
                  <>
                    {displayUser.image && (
                      <img className="w-8 h-8 relative rounded-2xl object-cover border border-zinc-100" src={formatImageUrl(displayUser.image)} alt={displayName} />
                    )}
                    <div className="inline-flex flex-col justify-center items-start">
                      <div className="justify-start text-gray-700 text-xs font-semibold font-['Inter'] leading-4">{displayName}</div>
                      {displayUser.rating > 0 && (
                        <div className="justify-start text-zinc-400 text-xs font-['Inter'] leading-4">{displayUser.rating} Rating</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-400 text-xs font-['Inter']">No Pro Partner Assigned</div>
                )}
              </div>
              <div className="justify-start text-neutral-700 text-base font-semibold font-['Inter'] leading-6">
                {booking.engineerId && booking.totalPrice > 0 
                  ? `₦${booking.totalPrice.toLocaleString()}` 
                  : 'Price to be quoted'}
              </div>
            </div>
          </div>

          {/* Scheduling & Location Section */}
          <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
            <div className="w-full h-4 inline-flex justify-start items-center gap-1">
              <HiOutlineClock className="w-3.5 h-3.5 text-blue-700" />
              <div className="justify-start text-neutral-700 text-xs font-normal font-['Inter'] leading-4">
                {isInProgress ? 'Today · In progress' : booking.createdAt ? format(new Date(booking.createdAt), 'MMM d, yyyy · p') : 'TBD'}
              </div>
            </div>
            <div className="w-full h-4 inline-flex justify-start items-center gap-1">
              <HiOutlineLocationMarker className="w-3.5 h-3.5 text-red-600" />
              <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4 line-clamp-1">
                {booking.address || 'Lagos, Nigeria'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-2 pt-2 border-t border-stone-50 w-full flex items-center justify-between">
           <span className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">RH-{booking.id.slice(-4).toUpperCase()}</span>
           <div className="w-4 h-4 text-zinc-300">
             <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
               <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           </div>
        </div>
      </div>
    </Link>
  )
}
