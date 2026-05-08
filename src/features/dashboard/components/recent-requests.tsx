'use client'

import React from 'react'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineStar, HiOutlineFire, HiOutlineLightningBolt } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { useUserBookings } from '@/hooks/api-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export const RecentRequests = () => {
  const { data: requests, isLoading } = useUserBookings()

  if (isLoading) {
    return (
      <div className="w-full max-w-[681px] p-5 bg-stone-50 rounded-xl flex flex-col gap-4 border border-zinc-200">
        <div className="h-5 w-32 bg-zinc-200 animate-pulse rounded" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-zinc-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-4 overflow-hidden border border-zinc-200">
      <h3 className="text-slate-900 text-sm font-semibold font-['Inter'] leading-5">Recent Request</h3>
      
      <div className="flex flex-col gap-4">
        {requests?.length === 0 && (
          <div className="p-8 text-center text-zinc-500 bg-white rounded-2xl border border-dashed border-zinc-200">
            No recent requests found.
          </div>
        )}
        {requests?.map((request: any) => (
          <div key={request.id} className="p-4 bg-white rounded-2xl flex flex-col gap-4 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  request.urgency === 'Emergency' ? "bg-red-600" : "bg-blue-50"
                )}>
                  {request.urgency === 'Emergency' ? (
                    <HiOutlineFire className="w-5 h-5 text-white" />
                  ) : (
                    <HiOutlineLightningBolt className="w-5 h-5 text-blue-700" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-900 text-sm font-bold font-['Inter'] leading-5">{request.service?.category?.name || 'Service'}</h4>
                    {request.urgency === 'Emergency' && (
                      <span className="px-2 py-0.5 bg-red-600 rounded text-white text-[9px] font-bold tracking-tight">EMERGENCY</span>
                    )}
                  </div>
                  <p className="text-zinc-600 text-xs font-normal leading-4">{request.service?.name}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-medium leading-4 capitalize",
                request.status === 'PENDING' ? "bg-orange-500/10 text-orange-500" : 
                request.status === 'ASSIGNED' ? "bg-blue-500/10 text-blue-700" :
                "bg-emerald-500/10 text-green-700"
              )}>
                {request.status.toLowerCase()}
              </span>
            </div>

            <div className="py-3 border-t border-b border-stone-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden border border-slate-100">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.engineer?.user?.name || 'Pending'}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-gray-700 text-xs font-bold leading-4">{request.engineer?.user?.name || 'Assigning Engineer...'}</span>
                  {request.engineer && (
                    <div className="flex items-center gap-1">
                      <HiOutlineStar className="w-3 h-3 text-amber-500" />
                      <span className="text-gray-700 text-[11px] font-bold leading-4">4.8</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-neutral-700 text-base font-bold leading-6">₦{request.totalPrice?.toLocaleString() || '---'}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-neutral-700 text-xs font-normal">
                <div className="w-4 h-4 flex items-center justify-center text-blue-700">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                </div>
                <span>{format(new Date(request.createdAt), 'MMM d, yyyy · p')}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 text-xs font-normal">
                <div className="w-4 h-4 flex items-center justify-center text-red-600">
                  <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                </div>
                <span>{request.address}, {request.city}, {request.state}</span>
              </div>
            </div>

            <Link 
              href={`/bookings/${request.id}`}
              className="mt-2 text-center py-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
