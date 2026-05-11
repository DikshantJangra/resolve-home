'use client'

import React from 'react'
import { HiOutlineStar, HiChevronRight } from 'react-icons/hi'
import { IconType } from 'react-icons'
import { cn } from "@resolve/ui"

interface BookingItemProps {
  category: string
  status: 'Completed' | 'Pending' | 'In Progress'
  professionalName: string
  date: string
  price: string
  rating: number
  icon: IconType
  iconBgColor: string
  iconColor: string
}

export const BookingItem = ({
  category,
  status,
  professionalName,
  date,
  price,
  rating,
  icon: Icon,
  iconBgColor,
  iconColor
}: BookingItemProps) => {
  return (
    <div className="group self-stretch h-20 py-4 flex justify-start items-center gap-3.5 hover:bg-slate-50 transition-colors px-4 -mx-4 rounded-xl cursor-pointer">
      <div className={cn("w-11 h-11 rounded-xl flex justify-center items-center shrink-0", iconBgColor)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      
      <div className="flex-1 h-11 flex flex-col justify-start items-start gap-0.5">
        <div className="self-stretch flex justify-start items-center gap-2">
          <span className="text-slate-900 text-sm font-semibold font-['Inter'] leading-5">{category}</span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-semibold font-['Inter'] leading-4 rounded-[5px]">
            {status}
          </span>
        </div>
        <div className="text-slate-500 text-xs font-normal font-['Inter'] leading-5">
          with {professionalName} · {date}
        </div>
      </div>

      <div className="w-24 flex flex-col items-end gap-1 shrink-0">
        <div className="text-neutral-700 text-sm font-bold font-['Inter'] leading-5">₦{price}</div>
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

      <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors shrink-0" />
    </div>
  )
}
