'use client'

import React, { useState } from 'react'
import { HiOutlineSearch, HiOutlinePlus, HiOutlineClock, HiOutlineTrash } from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Input } from "@resolve/ui"
import { cn } from "@resolve/ui"
import { BookingRequestCard } from '@/features/dashboard/components/booking-request-card'
import { useUserBookings, useUserProfile, useEngineerMyBookings } from '@/hooks/api-hooks'
import { Skeleton } from "@resolve/ui"
import { formatDistanceToNow } from 'date-fns'

const tabs: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'IN_PROGRESS' },
  { label: 'Upcoming', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Drafts', value: 'DRAFTS' },
]

function BookNewCard() {
  const setIsOpen = useBookingStore((s) => s.setIsOpen)
  return (
    <button onClick={() => setIsOpen(true)} className="block group w-full text-left">
      <div className="h-full min-h-50 p-3 bg-white rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 transition-all hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <HiOutlinePlus className="w-6 h-6 text-blue-700" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-neutral-700 text-sm font-semibold font-inter">Book a Service</span>
          <span className="text-zinc-400 text-xs font-normal font-inter">Find and hire a verified professional</span>
        </div>
      </div>
    </button>
  )
}

function DraftCard({ draft }: { draft: any }) {
  const { resumeDraft, deleteDraft } = useBookingStore()

  const stepLabel = (step: number) => {
    switch (step) {
      case 1: return 'Service selection'
      case 2: return 'Priority selection'
      case 3: return 'Issue details'
      case 4: return 'Location'
      case 5: return 'Review'
      default: return `Step ${step}`
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-amber-300 p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
            <HiOutlineClock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-700">Draft Booking</span>
            <span className="text-xs text-zinc-400">
              Saved {formatDistanceToNow(new Date(draft.savedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <button
          onClick={() => deleteDraft(draft.id)}
          className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
        >
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
        <div className="flex justify-between">
          <span>Stopped at</span>
          <span className="font-medium text-zinc-700">{stepLabel(draft.currentStep)}</span>
        </div>
        {draft.priority && (
          <div className="flex justify-between">
            <span>Priority</span>
            <span className={cn("font-medium", draft.priority === 'Emergency' ? 'text-red-600' : 'text-blue-700')}>
              {draft.priority}
            </span>
          </div>
        )}
        {draft.issueDetails && (
          <div className="flex justify-between gap-4">
            <span className="shrink-0">Issue</span>
            <span className="font-medium text-zinc-700 text-right truncate max-w-[160px]">{draft.issueDetails}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => resumeDraft(draft)}
        className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors"
      >
        Resume Booking
      </button>
    </div>
  )
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: userProfile, isPending: isUserPending } = useUserProfile()
  const isWorker = userProfile?.user?.role === 'worker'
  const { data: bookings, isPending: isBookingsPending } = useUserBookings({ enabled: !isWorker })
  const { data: engineerBookings, isPending: isEngineerBookingsPending } = useEngineerMyBookings({ enabled: isWorker })
  const drafts = useBookingStore((s) => s.drafts)

  const allBookings = isWorker ? (engineerBookings || []) : (bookings || [])
  const isVerified = !!(
    (userProfile?.user as any)?.isVerified ||
    (userProfile?.user as any)?.status === 'verified' ||
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.verificationStatus === 'approved'
  )
  const status = (userProfile?.user as any)?.status

  if (isBookingsPending || isUserPending || isEngineerBookingsPending) {
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

  const filteredBookings = allBookings?.filter((booking: any) => {
    const status = booking.status?.toUpperCase()
    let matchesTab = activeTab === 'All'
    if (activeTab === 'IN_PROGRESS') matchesTab = status === 'IN_PROGRESS'
    if (activeTab === 'CONFIRMED') matchesTab = ['PENDING', 'CONFIRMED', 'AWAITING_ENGINEER'].includes(status)
    if (activeTab === 'COMPLETED') matchesTab = status === 'COMPLETED'
    if (activeTab === 'CANCELLED') matchesTab = status === 'CANCELLED'

    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.address?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  }) || []


  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Bookings</h1>
          <p className="text-zinc-500 text-sm md:text-base font-normal leading-6">
            {isWorker ? 'Track and manage all your assigned jobs here.' : 'View and manage all your service bookings.'}
          </p>
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
                ? allBookings?.length || 0
                : tab.value === 'DRAFTS'
                  ? drafts.length
                  : allBookings?.filter((b: any) => {
                    const status = b.status?.toUpperCase()
                    if (tab.value === 'CONFIRMED') return ['PENDING', 'CONFIRMED', 'AWAITING_ENGINEER'].includes(status)
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
          {/* Book New Service Card — only for customers */}
          {!isWorker && activeTab !== 'DRAFTS' && <BookNewCard />}

          {activeTab === 'DRAFTS' ? (
            drafts.length > 0 ? (
              drafts.map((draft) => <DraftCard key={draft.id} draft={draft} />)
            ) : (
              <div className="sm:col-span-2 xl:col-span-3 py-16 flex flex-col items-center justify-center text-zinc-500 gap-3 bg-white rounded-2xl border border-dashed border-zinc-200">
                <HiOutlineClock className="w-8 h-8 text-zinc-300" />
                <p className="text-sm font-medium">No draft bookings</p>
                <p className="text-xs text-zinc-400">Bookings you start but don't finish will appear here</p>
              </div>
            )
          ) : filteredBookings.length > 0 ? (
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
