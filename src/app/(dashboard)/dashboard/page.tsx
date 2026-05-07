'use client'

import React from 'react'
import { HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { StatCard } from '@/features/dashboard/components/stat-card'
import { RecentRequests } from '@/features/dashboard/components/recent-requests'
import { useAuthSession, useUserBookings } from '@/hooks/api-hooks'

export default function DashboardPage() {
  const { data: session, isLoading: sessionLoading } = useAuthSession()
  const { data: bookings } = useUserBookings()

  const isEngineer = (session?.user as any)?.role?.toUpperCase() === 'WORKER' || (session?.user as any)?.role?.toUpperCase() === 'ADMIN' // Simplified check

  // Derive some stats from bookings
  const completedJobs = bookings?.filter((b: any) => b.status?.toUpperCase() === 'COMPLETED')?.length || 0
  const totalSpentOrEarned = bookings?.filter((b: any) => b.status?.toUpperCase() === 'COMPLETED')?.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0) || 0

  return (
    <div className="space-y-8 min-h-screen">
      {/* Stats Section */}
      <div className="flex flex-wrap gap-5">
        <StatCard 
          label={isEngineer ? "Total Earnings" : "Total Spent"} 
          value={`₦${totalSpentOrEarned.toLocaleString()}`} 
          change="+12.5%" 
          icon={HiOutlineCurrencyDollar} 
        />
        <StatCard 
          label="Completed Jobs" 
          value={completedJobs.toString()} 
          change="+5.2%" 
          icon={HiOutlineClipboardCheck} 
        />
        <StatCard 
          label="Active Requests" 
          value={(bookings?.filter((b: any) => ['pending', 'confirmed', 'in-progress'].includes(b.status.toLowerCase()))?.length || 0).toString()} 
          change="Real-time" 
          icon={HiOutlineChatAlt} 
        />
        <StatCard 
          label="Avg. Rating" 
          value={isEngineer ? "4.7" : "4.9"} 
          change="+0.1" 
          icon={HiOutlineStar} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentRequests />
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4">
           <h3 className="text-slate-900 text-sm font-semibold">Service Overview</h3>
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl min-h-[300px] text-zinc-400 text-sm italic">
              Detailed analytics coming soon...
           </div>
        </div>
      </div>
    </div>
  )
}
