'use client'

import React from 'react'
import { 
  HiOutlineClock, 
  HiOutlineLocationMarker, 
  HiOutlineChevronRight,
  HiOutlineExclamation,
  HiOutlineFilter
} from 'react-icons/hi'
import { cn, formatImageUrl } from "@resolve/ui"
import Link from 'next/link'

interface BookingCardProps {
  booking: any
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const isEmergency = booking.isEmergency || booking.serviceCategory?.toLowerCase() === 'emergency'
  
  const statusColors: Record<string, string> = {
    completed: "bg-green-50 text-green-700",
    pending: "bg-orange-50 text-orange-600",
    confirmed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-600",
    disputed: "bg-amber-50 text-amber-600",
    'in-progress': "bg-indigo-50 text-indigo-700"
  }

  const statusLabel = booking.status?.toLowerCase() || 'pending'

  return (
    <Link href={`/bookings/${booking.id}`}>
      <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col justify-between gap-4 h-64 hover:border-blue-300 hover:shadow-md transition-all group overflow-hidden shadow-sm">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isEmergency ? "bg-red-600" : "bg-blue-50"
              )}>
                {isEmergency ? (
                  <HiOutlineExclamation className="text-white w-6 h-6" />
                ) : (
                  <HiOutlineFilter className="text-blue-700 w-6 h-6" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 text-sm font-semibold font-inter leading-5">
                    {booking.serviceCategory || (isEmergency ? 'Emergency' : 'General Service')}
                  </span>
                  {isEmergency && (
                    <span className="px-1.5 py-0.5 bg-red-600 rounded text-white text-[9px] font-bold uppercase tracking-wider">
                      EMERGENCY
                    </span>
                  )}
                </div>
                <span className="text-zinc-500 text-xs font-normal font-inter leading-4 truncate max-w-[150px]">
                  {booking.serviceName || 'Service description'}
                </span>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold font-inter leading-4 capitalize",
              statusColors[statusLabel] || "bg-zinc-100 text-zinc-500"
            )}>
              {statusLabel}
            </div>
          </div>

          {/* User & Price Section */}
          <div className="py-3 border-t border-b border-stone-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {formatImageUrl(booking.customerAvatar) ? (
                <img
                  className="w-9 h-9 rounded-full border border-zinc-100 object-cover"
                  src={formatImageUrl(booking.customerAvatar)}
                  alt={booking.customerName}
                />
              ) : (
                <div className="w-9 h-9 rounded-full border border-zinc-100 bg-zinc-100 flex items-center justify-center text-zinc-600 text-xs font-medium">
                  {booking.customerName?.[0] || 'C'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-gray-800 text-xs font-semibold font-inter leading-4">{booking.customerName || 'Customer'}</span>
                {booking.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-gray-600 text-xs font-medium font-inter leading-4">{booking.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-neutral-800 text-base font-bold font-inter leading-6">
              ₦{(booking.totalPrice || 0).toLocaleString()}
            </div>
          </div>

          {/* Time & Location */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-neutral-700 text-xs font-normal font-inter">
              <HiOutlineClock className="text-blue-700 w-4 h-4" />
              <span>{booking.scheduledDate || 'Date TBD'} · {booking.scheduledTime || 'Time TBD'}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-normal font-inter">
              <HiOutlineLocationMarker className="text-red-500 w-4 h-4" />
              <span className="truncate">{booking.location?.address || 'Location TBD'}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
          <span className="text-zinc-400 text-[10px] font-bold font-mono tracking-tight">
            RH-{booking.id?.slice(-8).toUpperCase() || 'ID-TBD'}
          </span>
          <HiOutlineChevronRight className="text-zinc-300 w-5 h-5 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}
