'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HiOutlineClock, 
  HiOutlineLocationMarker, 
  HiOutlineStar, 
  HiOutlineExclamationCircle,
  HiOutlineDotsVertical
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { cn } from '@/lib/utils'
import { Booking, BookingStatus } from '../types'

interface BookingCardProps {
  booking: Booking
}

const statusStyles: Record<BookingStatus, string> = {
  'Upcoming': 'bg-orange-500/10 text-orange-500',
  'Active': 'bg-blue-500/10 text-blue-600',
  'In Progress': 'bg-emerald-500/10 text-emerald-600',
  'Completed': 'bg-zinc-500/10 text-zinc-500',
  'Cancelled': 'bg-red-500/10 text-red-500',
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const {
    category,
    description,
    status,
    professional,
    price,
    date,
    time,
    address,
    referenceId,
    isEmergency
  } = booking

  return (
    <Link href={`/bookings/${booking.id}`} className="block group">
      <div className="w-full max-w-[400px] p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col gap-4 group-hover:border-blue-200 transition-colors">
      {/* Top Section: Category and Status */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex justify-center items-center",
            isEmergency ? "bg-red-600" : "bg-blue-50"
          )}>
            {isEmergency ? (
              <HiOutlineExclamationCircle className="w-5 h-5 text-white" />
            ) : (
              <HiWrenchScrewdriver className="w-5 h-5 text-blue-700" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 text-sm font-semibold leading-5">{category}</span>
              {isEmergency && (
                <span className="px-1.5 py-0.5 bg-red-600 rounded text-white text-[9px] font-medium uppercase tracking-wider">
                  Emergency
                </span>
              )}
            </div>
            <span className="text-zinc-500 text-xs font-normal leading-4">{description}</span>
          </div>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-[10px] font-medium leading-4", statusStyles[status])}>
          {status}
        </div>
      </div>

      {/* Middle Section: Professional and Price */}
      <div className="py-3 border-y border-zinc-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src={professional.avatar} 
            alt={professional.name} 
            className="w-8 h-8 rounded-xl object-cover"
          />
          <div className="flex flex-col">
            <span className="text-gray-700 text-xs font-semibold leading-4">{professional.name}</span>
            <div className="flex items-center gap-1">
              <HiOutlineStar className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span className="text-gray-700 text-xs font-semibold leading-4">{professional.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-neutral-700 text-base font-semibold leading-6">
          ₦{price.toLocaleString()}
        </div>
      </div>

      {/* Details Section: Date/Time and Address */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <HiOutlineClock className="w-3.5 h-3.5 text-blue-700" />
          <span className="text-xs font-normal leading-4">{date} · {time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-600">
          <HiOutlineLocationMarker className="w-3.5 h-3.5 text-red-600" />
          <span className="text-xs font-normal leading-4 line-clamp-1">{address}</span>
        </div>
      </div>

      {/* Bottom Section: ID and Action */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-zinc-500 text-[10px] font-medium tracking-wider">{referenceId}</span>
        <button 
          className="text-zinc-300 hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          <HiOutlineDotsVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
    </Link>
  )
}
