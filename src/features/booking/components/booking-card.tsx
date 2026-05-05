'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HiOutlineClock, 
  HiOutlineLocationMarker, 
  HiOutlineStar, 
  HiOutlineExclamationCircle,
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface BookingCardProps {
  booking: any
}

const statusStyles: Record<string, string> = {
  'PENDING': 'bg-orange-500/10 text-orange-500',
  'CONFIRMED': 'bg-blue-500/10 text-blue-600',
  'IN_PROGRESS': 'bg-emerald-500/10 text-emerald-600',
  'COMPLETED': 'bg-zinc-500/10 text-zinc-500',
  'CANCELLED': 'bg-red-500/10 text-red-500',
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const isEmergency = booking.urgency === 'EMERGENCY'

  return (
    <Link href={`/bookings/${booking.id}`} className="block group">
      <div className="w-full h-full p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col gap-4 group-hover:border-blue-200 transition-colors">
      {/* Top Section: Category and Status */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex justify-center items-center shrink-0",
            isEmergency ? "bg-red-600" : "bg-blue-50"
          )}>
            {isEmergency ? (
              <HiOutlineExclamationCircle className="w-5 h-5 text-white" />
            ) : (
              <HiWrenchScrewdriver className="w-5 h-5 text-blue-700" />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 text-sm font-semibold leading-5 truncate">{booking.service?.category?.name || 'Service'}</span>
              {isEmergency && (
                <span className="px-1.5 py-0.5 bg-red-600 rounded text-white text-[9px] font-medium uppercase tracking-wider shrink-0">
                  Emergency
                </span>
              )}
            </div>
            <span className="text-zinc-500 text-xs font-normal leading-4 truncate">{booking.service?.name}</span>
          </div>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-[10px] font-medium leading-4 shrink-0", statusStyles[booking.status] || 'bg-zinc-100')}>
          {booking.status}
        </div>
      </div>

      {/* Middle Section: Professional and Price */}
      <div className="py-3 border-y border-zinc-50 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
            {booking.engineer?.user?.name ? (
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.engineer.user.name}`} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold text-zinc-400">?</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 text-xs font-semibold leading-4 truncate max-w-[100px]">
              {booking.engineer?.user?.name || 'Assigning...'}
            </span>
            {booking.engineer && (
              <div className="flex items-center gap-1">
                <HiOutlineStar className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span className="text-gray-700 text-xs font-semibold leading-4">4.8</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-neutral-700 text-base font-semibold leading-6 shrink-0">
          ₦{booking.totalPrice?.toLocaleString() || '---'}
        </div>
      </div>

      {/* Details Section: Date/Time and Address */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <HiOutlineClock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="text-xs font-normal leading-4">
            {booking.createdAt ? format(new Date(booking.createdAt), 'MMM d, yyyy · p') : 'Pending'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-600">
          <HiOutlineLocationMarker className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="text-xs font-normal leading-4 line-clamp-1">{booking.address}</span>
        </div>
      </div>

      {/* Bottom Section: ID */}
      <div className="flex justify-between items-center pt-1 border-t border-zinc-50 mt-auto">
        <span className="text-zinc-400 text-[9px] font-medium tracking-wider truncate">REF: {booking.id.slice(-8).toUpperCase()}</span>
      </div>
    </div>
    </Link>
  )
}
