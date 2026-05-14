'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi'
import { Input } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { BookingRequestCard } from '@/features/dashboard/components/booking-request-card'
import { useUserBookings, useUserProfile } from '@/hooks/api-hooks'
import { Skeleton } from "@resolve/ui"

const tabs: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'IN_PROGRESS' },
  { label: 'Upcoming', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

function BookNewCard() {
  return (
    <Link href="/?book=true" className="block group">
      <div className="h-full min-h-50 p-3 bg-white rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 transition-all hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <HiOutlinePlus className="w-6 h-6 text-blue-700" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-neutral-700 text-sm font-semibold font-inter">Book a Service</span>
          <span className="text-zinc-400 text-xs font-normal font-inter">Find and hire a verified professional</span>
        </div>
      </div>
    </Link>
  )
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: bookings, isPending: isBookingsPending } = useUserBookings()
  const { data: userProfile, isPending: isUserPending } = useUserProfile()

  const isWorker = userProfile?.user?.role === 'worker'
  const isVerified = !!(
    (userProfile?.user as any)?.isVerified ||
    (userProfile?.user as any)?.status === 'verified' ||
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.verificationStatus === 'approved'
  )
  const status = (userProfile?.user as any)?.status

  if (isBookingsPending || isUserPending) {
    return (
      <div className="flex flex-col gap-8">
        <div className="h-20 bg-zinc-100 animate-pulse rounded-xl" />
        <div className="flex flex-wrap gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full md:w-96 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const filteredBookings = bookings?.filter((booking: any) => {
    const status = booking.status?.toUpperCase()
    let matchesTab = activeTab === 'All'
    if (activeTab === 'IN_PROGRESS') matchesTab = status === 'IN_PROGRESS'
    if (activeTab === 'CONFIRMED') matchesTab = ['PENDING', 'CONFIRMED'].includes(status)
    if (activeTab === 'COMPLETED') matchesTab = status === 'COMPLETED'
    if (activeTab === 'CANCELLED') matchesTab = status === 'CANCELLED'

    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.address?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  }) || []


  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Bookings</h1>
          <p className="text-zinc-500 text-sm md:text-base font-normal leading-6">Track and manage all your assigned jobs here.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Input 
            placeholder="Search booking"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 md:h-12 pl-4 pr-12 border-zinc-300 rounded-xl text-sm placeholder:text-zinc-300 focus:border-blue-700 transition-all"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-blue-700 pointer-events-none" />
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="flex flex-col gap-6">
        <div className="border-b border-zinc-200">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const count = tab.value === 'All' 
                ? bookings?.length || 0
                : bookings?.filter((b: any) => {
                    const status = b.status?.toUpperCase()
                    if (tab.value === 'CONFIRMED') return ['PENDING', 'CONFIRMED'].includes(status)
                    return status === tab.value
                  }).length || 0

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 transition-all whitespace-nowrap",
                    activeTab === tab.value
                      ? "border-blue-700 text-blue-700 font-semibold"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 font-normal"
                  )}
                >
                  <span className="text-xs md:text-sm leading-5">{tab.label}</span>
                  {count > 0 && (
                    <span className={cn(
                      "w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full text-[9px] md:text-[10px] font-bold",
                      activeTab === tab.value ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* List of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Book New Service Card — always first */}
          <BookNewCard />

          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking: any) => (
              <BookingRequestCard
                key={booking.id}
                booking={booking}
                isWorker={isWorker}
              />
            ))
          ) : (
            <div className="sm:col-span-2 xl:col-span-2 py-16 flex flex-col items-center justify-center text-zinc-500 gap-3 bg-white rounded-2xl border border-dashed border-zinc-200">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                <HiOutlineSearch className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs text-zinc-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
