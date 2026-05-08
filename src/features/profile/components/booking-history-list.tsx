'use client'

import React from 'react'
import { HiOutlineStar, HiOutlineChevronRight } from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { cn } from '@/lib/utils'
import { useUserBookings } from '@/hooks/api-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import Link from 'next/link'

interface BookingHistoryItemProps {
  id: string
  category: string
  professionalName: string
  date: string
  price: number
  rating: number
  iconBgColor: string
  iconColor: string
}

export const BookingHistoryItem = ({
  id,
  category,
  professionalName,
  date,
  price,
  rating,
  iconBgColor,
  iconColor
}: BookingHistoryItemProps) => {
  return (
    <Link href={`/bookings/${id}`}>
      <div className="self-stretch h-20 py-4 flex justify-start items-center gap-3.5 border-b border-zinc-50 last:border-0 hover:bg-slate-50 px-4 -mx-4 rounded-xl transition-colors cursor-pointer group">
        <div className={cn("w-11 h-11 rounded-xl flex justify-center items-center shrink-0", iconBgColor)}>
          <HiWrenchScrewdriver className={cn("w-5 h-5", iconColor)} />
        </div>
        
        <div className="flex-1 h-11 flex flex-col justify-start items-start gap-0.5 overflow-hidden">
          <div className="self-stretch flex justify-start items-center gap-2">
            <span className="text-slate-900 text-sm font-semibold leading-5 truncate">{category}</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[10px] font-semibold rounded-[5px] shrink-0">
              Completed
            </span>
          </div>
          <div className="text-slate-500 text-xs font-normal leading-5 truncate">
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
    </Link>
  )
}

export const BookingHistoryList = () => {
  const { data: bookings, isLoading } = useUserBookings()

  const history = bookings?.filter((b: any) => b.status?.toLowerCase() === 'completed').map((b: any) => ({
    id: b.id,
    category: b.service?.name || 'Service',
    professionalName: b.engineer?.user?.name || 'Assigned Pro',
    date: b.createdAt ? format(new Date(b.createdAt), 'MMM d, yyyy') : 'Recently',
    price: b.totalPrice || 0,
    rating: b.review?.rating || 5, // Default to 5 if not yet rated for history view
    iconBgColor: 'bg-blue-50',
    iconColor: 'text-blue-700'
  })) || []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {history.length > 0 ? (
        <div className="flex flex-col">
          {history.map((item: any) => (
            <BookingHistoryItem key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-zinc-500 text-sm">
          No completed bookings found.
        </div>
      )}
      <Link href="/bookings" className="text-blue-700 text-sm font-semibold leading-5 hover:text-blue-800 transition-colors text-left px-4 mt-2">
        View all bookings
      </Link>
    </div>
  )
}
