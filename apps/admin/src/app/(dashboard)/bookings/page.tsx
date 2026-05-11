'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineChevronRight
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminBookings } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import Link from 'next/link'

export default function BookingsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { data: bookings, isLoading, error } = useAdminBookings()

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-lg" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      </div>
    )
  }

  const filteredBookings = bookings?.filter((b: any) => {
    const matchesSearch = b.id.toLowerCase().includes(search.toLowerCase()) || 
                          b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                          b.serviceName?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || b.status?.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  }) || []

  const statusTabs = ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled']

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">Platform Bookings</h1>
          <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
            Monitor and manage all service requests across the platform
          </p>
        </div>
        <div className="relative w-80">
          <input 
            placeholder="Search by ID, Customer, or Service..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-4 pl-10 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap",
              filter === tab 
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/20" 
                : "text-zinc-500 hover:bg-zinc-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Service & Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredBookings.length > 0 ? filteredBookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-blue-700">#{booking.id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-neutral-800">{booking.serviceName || 'Home Service'}</span>
                      <span className="text-xs text-zinc-500">{booking.customerName || 'Customer'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                        <HiOutlineClock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{booking.scheduledDate} · {booking.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <HiOutlineLocationMarker className="w-3 h-3" />
                        <span className="line-clamp-1">{booking.location?.city || 'Local Area'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-neutral-800">
                      <HiOutlineCurrencyDollar className="w-4 h-4 text-emerald-500" />
                      <span>₦{(booking.totalPrice || 0).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight",
                      booking.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                      booking.status === 'cancelled' ? "bg-rose-50 text-rose-600" :
                      booking.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <button className="p-2 text-zinc-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all">
                        <HiOutlineChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No bookings found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
