'use client'

import React from 'react'
import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineDotsVertical, HiOutlineLightningBolt } from 'react-icons/hi'
import { cn } from "@resolve/ui"

interface BookingCardProps {
  id: string
  category: string
  description: string
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled' | 'Emergency'
  homeowner: {
    name: string
    rating: string
    avatar: string
  }
  price: string
  time: string
  location: string
  isEmergency?: boolean
}

export const BookingCard = ({
  id,
  category,
  description,
  status,
  homeowner,
  price,
  time,
  location,
  isEmergency
}: BookingCardProps) => {
  const statusColors = {
    Upcoming: "bg-orange-500/10 text-orange-500",
    Active: "bg-blue-500/10 text-blue-500",
    Completed: "bg-emerald-500/10 text-emerald-500",
    Cancelled: "bg-zinc-500/10 text-zinc-500",
    Emergency: "bg-red-500/10 text-red-500"
  }

  return (
    <div className="w-full h-fit p-4 bg-white rounded-2xl border border-gray-200 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow group cursor-pointer">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-[10px] flex items-center justify-center",
              isEmergency ? "bg-red-600 text-white" : "bg-blue-50 text-blue-700"
            )}>
              {isEmergency ? <HiOutlineLightningBolt size={18} /> : <div className="w-4 h-4 border-2 border-current rounded-sm" />}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 text-sm font-semibold font-inter leading-5">{category}</span>
                {isEmergency && (
                  <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-medium rounded leading-3">EMERGENCY</span>
                )}
              </div>
              <span className="text-zinc-600 text-xs font-normal font-inter leading-4">{description}</span>
            </div>
          </div>
          <div className={cn("h-6 px-3 py-1 rounded-full flex items-center justify-center text-[10px] font-medium", statusColors[status])}>
            {status}
          </div>
        </div>

        {/* Homeowner Info */}
        <div className="py-2.5 border-t border-b border-stone-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img className="w-8 h-8 rounded-full object-cover" src={homeowner.avatar} alt={homeowner.name} />
            <div className="flex flex-col justify-center">
              <span className="text-gray-700 text-xs font-semibold font-inter leading-4">{homeowner.name}</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-gray-700 text-[10px] font-semibold font-inter leading-4">{homeowner.rating}</span>
              </div>
            </div>
          </div>
          <span className="text-neutral-700 text-base font-semibold font-inter leading-6">{price}</span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-neutral-700 text-xs font-normal font-inter">
            <HiOutlineClock className="text-blue-700 w-3.5 h-3.5" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-normal font-inter">
            <HiOutlineLocationMarker className="text-red-600 w-3.5 h-3.5" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-1">
        <span className="text-zinc-600 text-[10px] font-medium font-inter uppercase tracking-tight">{id}</span>
        <HiOutlineDotsVertical className="text-zinc-300 w-4 h-4 group-hover:text-zinc-600 transition-colors" />
      </div>
    </div>
  )
}
