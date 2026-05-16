'use client'

import React from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
import { BookingRequestCard } from './booking-request-card'
import { useUserBookings, useUserProfile, useEngineerDashboard } from '@/hooks/api-hooks'
import { Skeleton } from '@resolve/ui'
import { useBookingStore } from '@/store/booking-store'

export const RecentRequests = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile()
  const setIsOpen = useBookingStore((s) => s.setIsOpen)
  const isWorker = userProfile?.user?.role === 'worker'

  const { data: requests, isLoading: customerLoading } = useUserBookings({ enabled: !isWorker })
  const { data: engineerDashboard, isLoading: engineerLoading } = useEngineerDashboard(isWorker)

  const isLoading = profileLoading || (isWorker ? engineerLoading : customerLoading)
  const engineerRequests: any[] = engineerDashboard?.recentRequests || []

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

  const items = isWorker ? engineerRequests : (requests || [])

  return (
    <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-4 overflow-hidden border border-zinc-200">
      <h3 className="text-slate-900 text-sm font-semibold font-['Inter'] leading-5">Recent Requests</h3>

      <div className="self-stretch inline-flex justify-center items-center gap-5 flex-wrap content-center">
        {!isWorker && (
          <button onClick={() => setIsOpen(true)} className="block group w-full md:w-96 text-left">
            <div className="h-full min-h-40 p-3 bg-white rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 transition-all hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <HiOutlinePlus className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-neutral-700 text-sm font-semibold font-inter">Book a Service</span>
                <span className="text-zinc-400 text-xs font-normal font-inter">Find and hire a verified professional</span>
              </div>
            </div>
          </button>
        )}

        {items.length === 0 && isWorker && (
          <div className="w-full py-10 flex flex-col items-center gap-2 text-zinc-400">
            <p className="text-sm font-medium">No recent requests</p>
            <p className="text-xs">New booking requests will appear here</p>
          </div>
        )}

        {items.map((request: any) => (
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
