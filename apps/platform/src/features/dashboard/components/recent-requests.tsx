'use client'

import React from 'react'
import { BookingRequestCard } from './booking-request-card'
import { useUserBookings, useUserProfile } from '@/hooks/api-hooks'
import { Skeleton } from "@resolve/ui"

export const RecentRequests = () => {
  const { data: requests, isLoading } = useUserBookings()
  const { data: userProfile } = useUserProfile()
  
  const isWorker = userProfile?.user?.role === 'worker' || userProfile?.user?.role === 'Work as a Professional'

  if (isLoading) {
    return (
      <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-4 border border-zinc-200">
        <div className="h-5 w-32 bg-zinc-200 animate-pulse rounded" />
        <div className="flex flex-wrap gap-5">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full md:w-96 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-4 overflow-hidden border border-zinc-200">
      <h3 className="text-slate-900 text-sm font-semibold font-['Inter'] leading-5">Recent Request</h3>
      
      <div className="self-stretch inline-flex justify-start items-center gap-5 flex-wrap content-center">
        {requests?.length === 0 && (
          <div className="w-full p-8 text-center text-zinc-500 bg-white rounded-2xl border border-dashed border-zinc-200">
            No recent requests found.
          </div>
        )}
        {requests?.map((request: any) => (
          <BookingRequestCard 
            key={request.id} 
            booking={request} 
            isWorker={isWorker}
          />
        ))}
      </div>
    </div>
  )
}
