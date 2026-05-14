'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  HiOutlineTrendingUp,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineExclamationCircle,
  HiOutlineCalendar
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminUser, useAdminBookings } from '@/hooks/api-hooks'

export default function HomeownerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useAdminUser(id as string)
  const { data: allBookings, isLoading: isBookingsLoading } = useAdminBookings()

  const homeownerBookings = allBookings?.filter((b: any) => b.userId === id || b.homeownerId === id) || []

  const stats = [
    { label: 'Total Homeowners', value: '158', trend: '+12.5%', icon: HiOutlineUsers },
    { label: 'Membership Pro', value: '98%', trend: '+12.5%', icon: HiOutlineBriefcase },
    { label: 'Active Members', value: '4.7', trend: '+12.5%', icon: HiOutlineUserGroup },
    { label: 'Inactive members', value: '4.7', trend: '+12.5%', icon: HiOutlineUserGroup },
  ]

  if (isUserLoading || isBookingsLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      {/* Header / Breadcrumb */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => router.back()}
          className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <h1 className="text-neutral-700 text-sm font-medium font-inter leading-5">Booking details</h1>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-10 bg-stone-50 p-5 rounded-xl border border-zinc-200">
        
        {/* Info & Stats Section */}
        <div className="flex flex-col gap-10 pb-14 border-b border-zinc-300">
          
          {/* Homeowner Info Card */}
          <div className="p-3 bg-white rounded-xl border border-stone-50 flex flex-col gap-5">
            <h2 className="text-neutral-700 text-sm font-semibold font-inter leading-5">Homeowner Info</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-blue-700 overflow-hidden bg-zinc-100 flex items-center justify-center font-bold text-blue-700">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-base font-semibold font-inter leading-6">
                    {user?.name || "Tollideen Samwood"}
                  </span>
                  <span className="text-zinc-600 text-sm font-normal font-inter leading-5">
                    {user?.address || "14 Allen Avenue, Ikeja, Lagos"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-3 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors">
                  <HiOutlineMail className="w-5 h-5" />
                </button>
                <button className="p-3 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors">
                  <HiOutlinePhone className="w-5 h-5" />
                </button>
                <button className="p-3 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors">
                  <HiOutlineExclamationCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid (reused from list page) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-300 bg-white flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{stat.label}</span>
                    <span className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">{stat.value}</span>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center text-zinc-600">
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-700 text-xs font-medium font-inter leading-4">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Table Card */}
        <div className="p-5 bg-white rounded-xl border border-zinc-300 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-neutral-700 text-base font-semibold font-inter leading-6">Bookings</h2>
            <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
              View home owner’s booking from sign up till date
            </p>
          </div>

          <div className="flex flex-col">
            {homeownerBookings.length > 0 ? homeownerBookings.map((booking: any) => (
              <div key={booking.id} className="py-4 border-b border-zinc-100 flex justify-between items-center last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-600/10 rounded-lg flex items-center justify-center text-neutral-400">
                    <HiOutlineBriefcase className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-800 text-sm font-medium font-inter">
                      {booking.serviceName || "New Booking"}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-500 text-sm font-medium font-inter">
                        {booking.customerName || user?.name}
                      </span>
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full mx-1" />
                      <span className="text-zinc-500 text-sm font-medium font-inter">
                        {booking.categoryName || "Electrical"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-neutral-800 text-sm font-medium font-inter">
                    ₦{booking.totalPrice?.toLocaleString() || "12,000"}
                  </span>
                  <div className="px-3 py-1 bg-indigo-50 rounded-full">
                    <span className="text-blue-700 text-xs font-medium font-inter">
                      {booking.status || "Completed"}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center">
                <p className="text-zinc-500 text-sm">No bookings found for this homeowner.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
