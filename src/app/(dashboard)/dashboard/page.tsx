'use client'

import React from 'react'
import { HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { StatCard } from '@/features/dashboard/components/stat-card'
import { RecentRequests } from '@/features/dashboard/components/recent-requests'

export default function DashboardPage() {
  return (
    <div className="space-y-8 min-h-screen">
      {/* Stats Section */}
      <div className="flex flex-wrap gap-5">
        <StatCard 
          label="Total Earnings" 
          value="₦232,000,158" 
          change="+12.5%" 
          icon={HiOutlineCurrencyDollar} 
        />
        <StatCard 
          label="Completed Jobs" 
          value="158" 
          change="+12.5%" 
          icon={HiOutlineClipboardCheck} 
        />
        <StatCard 
          label="Response Rate" 
          value="98%" 
          change="+12.5%" 
          icon={HiOutlineChatAlt} 
        />
        <StatCard 
          label="Avg. Rating" 
          value="4.7" 
          change="+12.5%" 
          icon={HiOutlineStar} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentRequests />
        {/* Additional widgets can go here */}
      </div>
    </div>
  )
}
