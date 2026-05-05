'use client'

import React, { useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { BookingCard } from '@/features/booking/components/booking-card'
import { Booking, BookingStatus } from '@/features/booking/types'

const tabs: { label: string; value: BookingStatus | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Upcoming', value: 'Upcoming' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    referenceId: 'RH-7842-019',
    category: 'Plumbing',
    description: 'Burst pipe, kitchen sink',
    status: 'Upcoming',
    professional: {
      name: 'James Adewale',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop',
      rating: 4.9,
    },
    price: 45000,
    date: 'Today',
    time: '2:00 PM – 4:00 PM',
    address: '14 Allen Avenue, Ikeja, Lagos',
  },
  {
    id: '2',
    referenceId: 'RH-7820-055',
    category: 'Plumbing',
    description: 'Burst pipe, kitchen sink',
    status: 'Completed',
    professional: {
      name: 'James Adewale',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop',
      rating: 4.9,
    },
    price: 45000,
    date: 'Apr 28, 2026',
    time: 'Completed 3:45 PM',
    address: '7 Bourdillon Road, Ikoyi, Lagos',
  },
  {
    id: '3',
    referenceId: 'RH-7835-004',
    category: 'Emergency',
    description: 'Gas leak',
    status: 'Upcoming',
    isEmergency: true,
    professional: {
      name: 'Chidi Bello',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      rating: 4.9,
    },
    price: 45000,
    date: 'Today',
    time: 'In progress',
    address: '7 Bourdillon Road, Ikoyi, Lagos',
  },
  {
    id: '4',
    referenceId: 'RH-7820-056',
    category: 'Electrical',
    description: 'Full house rewiring',
    status: 'Active',
    professional: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      rating: 4.8,
    },
    price: 120000,
    date: 'Tomorrow',
    time: '9:00 AM – 5:00 PM',
    address: '25 Victoria Island, Lagos',
  },
  {
    id: '5',
    referenceId: 'RH-7820-057',
    category: 'Cleaning',
    description: 'Deep cleaning service',
    status: 'Completed',
    professional: {
      name: 'Mary Okoro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      rating: 4.7,
    },
    price: 25000,
    date: 'May 1, 2026',
    time: 'Completed 12:00 PM',
    address: '10 Lekki Phase 1, Lagos',
  },
  {
    id: '6',
    referenceId: 'RH-7820-058',
    category: 'AC Repair',
    description: 'AC gas refilling',
    status: 'Cancelled',
    professional: {
      name: 'Babatunde Raji',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      rating: 4.5,
    },
    price: 15000,
    date: 'May 2, 2026',
    time: 'Cancelled',
    address: '5 Surulere, Lagos',
  }
]

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const matchesTab = activeTab === 'All' || booking.status === activeTab
    const matchesSearch = booking.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Bookings</h1>
          <p className="text-zinc-500 text-base font-normal leading-6">Track and manage all your assigned jobs here.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Input 
            placeholder="Search booking"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-4 pr-12 border-zinc-300 rounded-xl text-sm placeholder:text-zinc-300 focus:border-blue-700 transition-all"
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
                ? MOCK_BOOKINGS.length 
                : MOCK_BOOKINGS.filter(b => b.status === tab.value).length

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap",
                    activeTab === tab.value
                      ? "border-blue-700 text-blue-700 font-semibold"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 font-normal"
                  )}
                >
                  <span className="text-sm leading-5">{tab.label}</span>
                  {count > 0 && (
                    <span className={cn(
                      "w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold",
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

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                <HiOutlineSearch className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
