"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  HiOutlineSearch, 
  HiOutlineTrendingUp,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineTicket
} from "react-icons/hi"
import { cn, Skeleton } from "@resolve/ui"
import { useAdminStats, useAdminBookings } from "@/hooks/api-hooks"
import { formatDistanceToNow } from "date-fns"

// --- Stat Card Component ---
const StatCard = ({ title, value, trend, icon: Icon }: { 
  title: string, 
  value: string, 
  trend: string, 
  icon: any 
}) => (
  <div className="flex-1 min-w-[220px] p-4 rounded-xl border border-zinc-300 flex flex-col gap-3 bg-white shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{title}</span>
        <span className="text-neutral-700 text-2xl font-bold font-heading leading-8">{value}</span>
      </div>
      <div className="w-6 h-6 text-zinc-600">
        <Icon size={24} />
      </div>
    </div>
    <div className="flex items-center gap-1">
      <HiOutlineTrendingUp className="text-green-400 w-5 h-5" />
      <span className="text-green-700 text-xs font-medium font-inter leading-4">{trend}</span>
    </div>
  </div>
)

// --- Audit Log Item Component ---
const AuditLogItem = ({ title, user, category, time, status }: {
  title: string,
  user: string,
  category: string,
  time: string,
  status: string
}) => (
  <div className="flex justify-between items-center py-4 border-b border-zinc-100 last:border-0 group hover:bg-zinc-50/50 px-2 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400">
        <HiOutlineTicket size={24} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-zinc-900 text-sm font-medium font-inter">{title}</span>
        <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
          <span>{user}</span>
          <div className="w-1 h-1 bg-zinc-300 rounded-full" />
          <span>{category}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1.5">
      <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{time}</span>
      <span className="px-3 py-1 bg-indigo-50 text-blue-700 text-xs font-medium rounded-full">
        {status}
      </span>
    </div>
  </div>
)

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookings()

  const recentBookings = bookings?.slice(0, 4) || []

  if (statsLoading || bookingsLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-xl font-semibold font-heading leading-8">Overview</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            This is the platform pulse, the system command center
          </p>
        </div>
        <div className="relative w-96 hidden lg:block opacity-0"> {/* Hidden as per Figma design code having opacity-0 */}
          <input 
            placeholder="Search booking" 
            className="w-full h-12 px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 w-5 h-5" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatCard title="Platform Revenue" value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`} trend="+12.5%" icon={HiOutlineCurrencyDollar} />
        <StatCard title="Total Homeowners" value={stats?.totalHomeowners || "0"} trend="+12.5%" icon={HiOutlineUsers} />
        <StatCard title="Total Professionals" value={stats?.totalEngineers || "0"} trend="+12.5%" icon={HiOutlineBriefcase} />
        <StatCard title="Completed Jobs" value={stats?.completedJobs || "0"} trend="+12.5%" icon={HiOutlineCheckCircle} />
        <StatCard title="Platform Rating" value={`${stats?.averageRating || "0"}`} trend="+12.5%" icon={HiOutlineCheckCircle} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Chart Placeholder & Audit Log */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Line Chart Section */}
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-neutral-700 text-sm font-medium font-inter">Total Demands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-neutral-700 text-sm font-medium font-inter">Total Fulfilled</span>
                </div>
              </div>
            </div>
            
            {/* Simple SVG Chart Placeholder to match Figma's structure */}
            <div className="h-64 relative flex flex-col justify-between">
              {[25, 20, 15, 5, 0].map((label) => (
                <div key={label} className="flex items-center gap-4 w-full">
                  <span className="text-slate-400 text-xs font-normal w-6 text-right">{label}k</span>
                  <div className="flex-1 h-[1px] bg-blue-100" />
                </div>
              ))}
              <div className="absolute inset-0 pt-6 pl-10 pr-4 pb-2">
                <div className="w-full h-full relative">
                  {/* Area Chart Gradient Placeholder */}
                  <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-emerald-500/10 to-transparent border-t-2 border-emerald-500" />
                  <div className="absolute bottom-0 left-0 w-full h-[80%] bg-gradient-to-t from-blue-500/10 to-transparent border-t-2 border-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Section */}
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-4 shadow-sm overflow-hidden">
            <div className="flex flex-col gap-1">
              <h2 className="text-neutral-700 text-base font-semibold font-inter leading-6">System Audit Log</h2>
              <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
                Real-time platform activity and event history
              </p>
            </div>
            <div className="flex flex-col mt-2">
              {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
                <AuditLogItem 
                  key={booking.id}
                  title={`New Booking: ${booking.referenceId || booking.id.slice(-6).toUpperCase()}`}
                  user={booking.customerName || 'Unknown User'}
                  category={booking.serviceName || 'Service'}
                  time={booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }).toUpperCase() : 'JUST NOW'}
                  status={booking.status}
                />
              )) : (
                <p className="text-zinc-500 text-sm py-4">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Distribution Card */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-8 shadow-sm h-fit">
            <h2 className="text-neutral-700 text-xl font-medium font-heading">Revenue Distribution</h2>
            
            {/* Donut Chart SVG Placeholder */}
            <div className="flex justify-center py-10 relative">
               <svg width="180" height="180" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3" strokeDasharray="43 57" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-43" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-68" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="17 83" strokeDashoffset="-83" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-zinc-400 text-xs">Total</span>
                <span className="text-neutral-700 font-bold text-sm">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-4">
              <LegendItem color="bg-blue-500" label="Plumbing" percent="43.29%" value="₦161,466.24" />
              <LegendItem color="bg-green-500" label="Heating and HVAC" percent="87.16%" value="₦56,411.33" />
              <LegendItem color="bg-red-500" label="Electrical" percent="40.22%" value="₦81,981.22" />
              <LegendItem color="bg-orange-500" label="Others" percent="25.53%" value="₦12,432.51" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const LegendItem = ({ color, label, percent, value }: { 
  color: string, 
  label: string, 
  percent: string, 
  value: string 
}) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", color)} />
      <span className="text-neutral-700 text-sm font-medium font-inter">{label}</span>
      <span className={cn("text-xs font-normal ml-1", color.replace('bg-', 'text-'))}>{percent}</span>
    </div>
    <span className="text-neutral-700 text-sm font-normal font-inter">{value}</span>
  </div>
)
