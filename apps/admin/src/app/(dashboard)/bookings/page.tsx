'use client'

import React, { useState, useMemo } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineShieldCheck,
  HiOutlineExclamation,
  HiOutlineClipboardList
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminBookings, useAdminBookingStats } from '@/hooks/api-hooks'
import { BookingCard } from '@/components/bookings/booking-card'

const PAGE_SIZE = 12

export default function BookingsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const { data: bookings, isLoading: bookingsLoading, error } = useAdminBookings()
  const { data: statsData, isLoading: statsLoading } = useAdminBookingStats()

  const stats = useMemo(() => {
    if (statsData && Object.keys(statsData).length > 0) return {
      total: (statsData as any).totalBookings || 0,
      inProgress: (statsData as any).inProgress || 0,
      emergency: (statsData as any).emergency || 0,
      avgResponse: (statsData as any).avgResponse || '0%'
    }
    if (!bookings) return { total: 0, inProgress: 0, emergency: 0, avgResponse: '0%' }
    return {
      total: bookings.length,
      inProgress: bookings.filter((b: any) => b.status?.toLowerCase() === 'in-progress').length,
      emergency: bookings.filter((b: any) => b.isEmergency || b.serviceCategory?.toLowerCase() === 'emergency').length,
      avgResponse: undefined
    }
  }, [bookings, statsData])

  const filteredBookings = useMemo(() => {
    return bookings?.filter((b: any) => {
      const searchStr = `${b.id} ${b.customerName} ${b.serviceName} ${b.serviceCategory}`.toLowerCase()
      const matchesSearch = searchStr.includes(search.toLowerCase())
      
      const status = b.status?.toLowerCase()
      const matchesFilter = filter === 'all' || 
                           (filter === 'active' && (status === 'confirmed' || status === 'in-progress')) ||
                           (filter === 'upcoming' && status === 'pending') ||
                           status === filter
      
      return matchesSearch && matchesFilter
    }) || []
  }, [bookings, search, filter])

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE)
  const paginatedBookings = filteredBookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const statusTabs = [
    { id: 'all', label: 'All', count: bookings?.length || 0 },
    { id: 'active', label: 'Active', count: bookings?.filter((b: any) => ['confirmed', 'in-progress'].includes(b.status?.toLowerCase())).length || 0 },
    { id: 'upcoming', label: 'Upcoming', count: bookings?.filter((b: any) => b.status?.toLowerCase() === 'pending').length || 0 },
    { id: 'completed', label: 'Completed', count: bookings?.filter((b: any) => b.status?.toLowerCase() === 'completed').length || 0 },
    { id: 'cancelled', label: 'Cancelled', count: bookings?.filter((b: any) => b.status?.toLowerCase() === 'cancelled').length || 0 },
  ]

  if (bookingsLoading || statsLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-full md:w-96 rounded-xl" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="w-9 h-9 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-6 border-b border-zinc-200 px-1">
            {[1,2,3,4,5].map(i => (
              <Skeleton key={i} className="h-4 w-16 mb-3" />
            ))}
          </div>

          {/* Booking cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="h-px bg-zinc-100" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-9 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-heading leading-8">Bookings</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Live booking stream and progress monitoring.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            placeholder="Search booking" 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full h-12 px-4 pr-12 rounded-xl border border-zinc-300 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-700 transition-all shadow-sm"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Total bookings" 
          value={stats.total} 
          trend={(statsData as any)?.trends?.total} 
          trendUp={(statsData as any)?.trends?.total?.startsWith('+')} 
          icon={<HiOutlineFilter className="w-5 h-5 text-zinc-600" />} 
        />
        <StatCard 
          label="Avg. Response" 
          value={stats.avgResponse || 'N/A'} 
          trend={(statsData as any)?.trends?.avgResponse} 
          trendUp={(statsData as any)?.trends?.avgResponse?.startsWith('+')} 
          icon={<HiOutlineShieldCheck className="w-5 h-5 text-zinc-600" />} 
        />
        <StatCard 
          label="In Progress" 
          value={stats.inProgress} 
          trend={(statsData as any)?.trends?.inProgress} 
          trendUp={(statsData as any)?.trends?.inProgress?.startsWith('+')} 
          icon={<HiOutlineClock className="w-5 h-5 text-zinc-600" />} 
        />
        <StatCard 
          label="Emergency" 
          value={stats.emergency} 
          trend={(statsData as any)?.trends?.emergency} 
          trendUp={(statsData as any)?.trends?.emergency?.startsWith('+')} 
          icon={<HiOutlineExclamation className="w-5 h-5 text-zinc-600" />} 
        />
      </div>

      {/* Tabs & List */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6 border-b border-zinc-300 px-5 overflow-x-auto scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilter(tab.id); setPage(1) }}
              className={cn(
                "py-3 flex items-center gap-2 border-b-2 transition-all relative whitespace-nowrap",
                filter === tab.id 
                  ? "border-blue-700 text-blue-700 font-semibold" 
                  : "border-transparent text-zinc-600 font-normal hover:text-zinc-900"
              )}
            >
              <span className="text-sm font-inter leading-5">{tab.label}</span>
              <div className={cn(
                "px-1.5 py-px rounded-full flex justify-center items-center",
                filter === tab.id ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"
              )}>
                <span className="text-[10px] font-bold font-inter leading-4">{tab.count}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookingsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-white border border-zinc-200 animate-pulse">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-zinc-100 rounded" />
                    <div className="h-5 w-16 bg-zinc-100 rounded-full" />
                  </div>
                  <div className="h-3 w-40 bg-zinc-100 rounded" />
                  <div className="h-3 w-32 bg-zinc-100 rounded" />
                  <div className="mt-2 flex gap-3">
                    <div className="h-8 w-8 bg-zinc-100 rounded-full" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-3 w-28 bg-zinc-100 rounded" />
                      <div className="h-3 w-20 bg-zinc-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : paginatedBookings.length > 0 ? paginatedBookings.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} />
          )) : (
            <div className="col-span-full py-24 text-center bg-stone-50 rounded-2xl border-2 border-dashed border-zinc-200">
              <HiOutlineClipboardList className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 font-inter text-lg">No bookings found for the selected criteria.</p>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-zinc-500">Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredBookings.length)} of {filteredBookings.length} items</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={cn("w-8 h-8 text-sm rounded-lg font-medium", p === page ? "bg-blue-700 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50")}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, trendUp, icon }: any) {
  return (
    <div className="p-4 rounded-xl border border-zinc-300 bg-white flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{label}</span>
          <span className="text-neutral-700 text-2xl font-bold font-heading leading-8">{value}</span>
        </div>
        <div className="p-2 rounded-lg bg-stone-50 border border-zinc-100 shadow-inner">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          {trendUp ? <HiOutlineTrendingUp className="text-green-500 w-4 h-4" /> : <HiOutlineTrendingDown className="text-red-500 w-4 h-4" />}
          <span className={cn("text-xs font-medium font-inter leading-4", trendUp ? "text-green-700" : "text-red-700")}>{trend}</span>
        </div>
      )}
    </div>
  )
}
