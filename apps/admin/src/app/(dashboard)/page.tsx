"use client"

import * as React from "react"
import { 
  HiOutlineSearch, 
  HiOutlineTrendingUp,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineTicket,
  HiOutlineViewGrid
} from "react-icons/hi"
import { cn, Skeleton } from "@resolve/ui"
import { 
  useAdminStats, 
  useAdminBookings, 
  useCategories, 
  useAdminEngineers
} from "@/hooks/api-hooks"
import { formatDistanceToNow } from "date-fns"

// --- Stat Card Component ---
const StatCard = ({ title, value, trend, icon: Icon }: { 
  title: string, 
  value: string | number, 
  trend?: string, 
  icon: React.ElementType 
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
    {trend && (
      <div className="flex items-center gap-1">
        <HiOutlineTrendingUp className="text-green-400 w-5 h-5" />
        <span className="text-green-700 text-xs font-medium font-inter leading-4">{trend}</span>
      </div>
    )}
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
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: engineers, isLoading: engineersLoading } = useAdminEngineers()

  const recentBookings = bookings?.slice(0, 4) || []

  const calculatedDistribution = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return []
    const totals: Record<string, number> = {}
    let grandTotal = 0
    bookings.forEach((b: any) => {
      const cat = b.serviceCategory || 'Others'
      const price = b.price || b.totalAmount || 0
      totals[cat] = (totals[cat] || 0) + price
      grandTotal += price
    })
    
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-orange-500', 'bg-purple-500']
    return Object.entries(totals).map(([label, value], idx) => ({
      label,
      value,
      percent: grandTotal > 0 ? `${((value / grandTotal) * 100).toFixed(1)}%` : '0%',
      color: colors[idx % colors.length]
    }))
  }, [bookings])

  if (statsLoading || bookingsLoading || categoriesLoading || engineersLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-xl font-semibold font-heading leading-8">Overview</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Platform Pulse & System Command Center
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatCard title="Platform Revenue" value={`₦${((stats as any)?.totalRevenue || 0).toLocaleString()}`} trend={(stats as any)?.trends?.revenue} icon={HiOutlineCurrencyDollar} />
        <StatCard title="Total Homeowners" value={(stats as any)?.totalHomeowners || "0"} trend={(stats as any)?.trends?.homeowners} icon={HiOutlineUsers} />
        <StatCard title="Total Professionals" value={(stats as any)?.totalEngineers || "0"} trend={(stats as any)?.trends?.engineers} icon={HiOutlineBriefcase} />
        <StatCard title="Completed Jobs" value={(stats as any)?.completedJobs || "0"} trend={(stats as any)?.trends?.jobs} icon={HiOutlineCheckCircle} />
        <StatCard title="Platform Rating" value={`${(stats as any)?.averageRating || "0"}`} trend={(stats as any)?.trends?.rating} icon={HiOutlineCheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Revenue Chart Section (Simplified SVG) */}
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-6 shadow-sm">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-neutral-700 text-sm font-medium">Total Demands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-neutral-700 text-sm font-medium">Total Fulfilled</span>
                </div>
              </div>
              <div className="h-64 relative border-b border-l border-zinc-100 mt-4">
                 <div className="absolute inset-0 flex flex-col justify-between">
                    {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-zinc-50" />)}
                 </div>
                 <div className="absolute bottom-0 left-0 w-full h-[60%] bg-blue-500/10 border-t-2 border-blue-500" />
              </div>
          </div>

          {/* Audit Log Section */}
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-4 shadow-sm overflow-hidden">
            <h2 className="text-neutral-700 text-base font-semibold font-inter">System Audit Log</h2>
            <div className="flex flex-col">
              {recentBookings.map((booking: any) => (
                <AuditLogItem 
                  key={booking.id}
                  title={`New Booking: ${booking.referenceId || booking.id.slice(-6).toUpperCase()}`}
                  user={booking.customerName || 'User'}
                  category={booking.serviceName || 'Service'}
                  time={booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }).toUpperCase() : 'JUST NOW'}
                  status={booking.status}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Distribution */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-8 shadow-sm h-full">
            <h2 className="text-neutral-700 text-lg font-medium">Revenue Distribution</h2>
            <div className="flex justify-center py-6">
              <div className="w-40 h-40 rounded-full border-[12px] border-zinc-100 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-[12px] border-blue-500 border-t-transparent border-r-transparent rotate-45" />
                <span className="text-xl font-bold">100%</span>
              </div>
            </div>
            <div className="space-y-4">
              {calculatedDistribution.map((item: any, idx: number) => (
                <LegendItem key={idx} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label, percent, value }: any) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className={cn("w-3 h-3 rounded-full", color)} />
        <span className="text-neutral-700 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-400">{percent}</span>
        <span className="text-neutral-700 text-sm font-semibold">{value}</span>
      </div>
    </div>
  )
}
