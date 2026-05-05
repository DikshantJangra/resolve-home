'use client'

import React from 'react'
import { HiOutlineStar, HiOutlineChevronRight } from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

interface BookingHistoryItemProps {
  category: string
  professionalName: string
  date: string
  price: number
  rating: number
  iconBgColor: string
  iconColor: string
}

export const BookingHistoryItem = ({
  category,
  professionalName,
  date,
  price,
  rating,
  iconBgColor,
  iconColor
}: BookingHistoryItemProps) => {
  return (
    <div className="self-stretch h-20 py-4 flex justify-start items-center gap-3.5 border-b border-zinc-50 last:border-0 hover:bg-slate-50 px-4 -mx-4 rounded-xl transition-colors cursor-pointer group">
      <div className={cn("w-11 h-11 rounded-xl flex justify-center items-center shrink-0", iconBgColor)}>
        <HiWrenchScrewdriver className={cn("w-5 h-5", iconColor)} />
      </div>
      
      <div className="flex-1 h-11 flex flex-col justify-start items-start gap-0.5">
        <div className="self-stretch flex justify-start items-center gap-2">
          <span className="text-slate-900 text-sm font-semibold leading-5">{category}</span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-semibold rounded-[5px]">
            Completed
          </span>
        </div>
        <div className="text-slate-500 text-xs font-normal leading-5">
          with {professionalName} · {date}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="text-neutral-700 text-sm font-bold leading-5">₦{price.toLocaleString()}</div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <HiOutlineStar 
              key={i} 
              className={cn(
                "w-2.5 h-2.5",
                i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
              )} 
            />
          ))}
        </div>
      </div>

      <HiOutlineChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors" />
    </div>
  )
}

export const BookingHistoryList = () => {
  const history = [
    { category: 'Plumbing', professionalName: 'James Adewale', date: 'May 1, 2025', price: 45000, rating: 5, iconBgColor: 'bg-blue-50', iconColor: 'text-blue-700' },
    { category: 'Electrical', professionalName: 'Amaka Okonkwo', date: 'Apr 28, 2025', price: 60000, rating: 4, iconBgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { category: 'Heating', professionalName: 'Chidi Bello', date: 'Apr 18, 2025', price: 55000, rating: 5, iconBgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { category: 'Plumbing', professionalName: 'Emeka Eze', date: 'Apr 5, 2025', price: 38000, rating: 4, iconBgColor: 'bg-blue-50', iconColor: 'text-blue-700' },
    { category: 'Plumbing', professionalName: 'Emeka Eze', date: 'Apr 5, 2025', price: 38000, rating: 4, iconBgColor: 'bg-blue-50', iconColor: 'text-blue-700' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {history.map((item, index) => (
          <BookingHistoryItem key={index} {...item} />
        ))}
      </div>
      <button className="text-blue-700 text-sm font-semibold leading-5 hover:text-blue-800 transition-colors text-left px-4">
        View all bookings
      </button>
    </div>
  )
}
