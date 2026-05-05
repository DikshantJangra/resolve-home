'use client'

import React from 'react'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineStar, HiOutlineFire, HiOutlineLightningBolt } from 'react-icons/hi'
import { cn } from '@/lib/utils'

const requests = [
  {
    id: 1,
    category: 'Plumbing',
    subCategory: 'Burst pipe, kitchen sink',
    status: 'Upcoming',
    userName: 'James Adewale',
    userRating: '4.9',
    price: '₦45,000',
    time: 'Today · 2:00 PM – 4:00 PM',
    location: '14 Allen Avenue, Ikeja, Lagos',
    type: 'regular'
  },
  {
    id: 2,
    category: 'Emergency',
    subCategory: 'Gas leak',
    status: 'Upcoming',
    userName: 'Chidi Bello',
    userRating: '4.9',
    price: '₦45,000',
    time: 'Today · In progress',
    location: '7 Bourdillon Road, Ikoyi, Lagos',
    type: 'emergency'
  },
  {
    id: 3,
    category: 'Emergency',
    subCategory: 'Gas leak',
    status: 'Upcoming',
    userName: 'Chidi Bello',
    userRating: '4.9',
    price: '₦45,000',
    time: 'Today · In progress',
    location: '7 Bourdillon Road, Ikoyi, Lagos',
    type: 'emergency'
  }
]

export const RecentRequests = () => {
  return (
    <div className="w-full max-w-[681px] p-5 bg-stone-50 rounded-xl flex flex-col gap-4 overflow-hidden border border-zinc-200">
      <h3 className="text-slate-900 text-sm font-semibold font-['Inter'] leading-5">Recent Request</h3>
      
      <div className="flex flex-col gap-4">
        {requests.map((request, idx) => (
          <div key={`${request.id}-${idx}`} className="p-4 bg-white rounded-2xl flex flex-col gap-4 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  request.type === 'emergency' ? "bg-red-600" : "bg-blue-50"
                )}>
                  {request.type === 'emergency' ? (
                    <HiOutlineFire className="w-5 h-5 text-white" />
                  ) : (
                    <HiOutlineLightningBolt className="w-5 h-5 text-blue-700" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-900 text-sm font-bold font-['Inter'] leading-5">{request.category}</h4>
                    {request.type === 'emergency' && (
                      <span className="px-2 py-0.5 bg-red-600 rounded text-white text-[9px] font-bold tracking-tight">EMERGENCY</span>
                    )}
                  </div>
                  <p className="text-zinc-600 text-xs font-normal leading-4">{request.subCategory}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-medium leading-4",
                request.type === 'emergency' ? "bg-emerald-500/10 text-green-700" : "bg-orange-500/10 text-orange-500"
              )}>
                {request.status}
              </span>
            </div>

            <div className="py-3 border-t border-b border-stone-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden border border-slate-100">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.userName}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-gray-700 text-xs font-bold leading-4">{request.userName}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-sm" /> {/* Square star as in design */}
                    <span className="text-gray-700 text-[11px] font-bold leading-4">{request.userRating}</span>
                  </div>
                </div>
              </div>
              <span className="text-neutral-700 text-base font-bold leading-6">{request.price}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-neutral-700 text-xs font-normal">
                <div className="w-4 h-4 flex items-center justify-center text-blue-700">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                </div>
                <span>{request.time}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 text-xs font-normal">
                <div className="w-4 h-4 flex items-center justify-center text-red-600">
                  <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                </div>
                <span>{request.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
