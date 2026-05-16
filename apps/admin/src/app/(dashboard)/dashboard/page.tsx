"use client"

import * as React from "react"
import { 
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
import { formatDistanceToNow, format, subDays } from "date-fns"

const StatCard = ({ title, value, trend, icon: Icon }: { 
  title: string, value: string | number, trend?: string, icon: React.ElementType 
}) => (
  <div className="flex-1 p-4 rounded-xl border border-zinc-300 flex flex-col gap-3 bg-white shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{title}</span>
        <span className="text-neutral-700 text-2xl font-bold font-heading leading-8">{value}</span>
      </div>
      <div className="w-6 h-6 text-zinc-600"><Icon size={24} /></div>
    </div>
    {trend && (
      <div className="flex items-center gap-1">
        <HiOutlineTrendingUp className="text-green-400 w-5 h-5" />
        <span className="text-green-700 text-xs font-medium font-inter leading-4">{trend}</span>
      </div>
    )}
  </div>
)

const AuditLogItem = ({ title, user, category, time, status }: any) => (
  <div className="flex justify-between items-center py-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 px-2 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400">
        <HiOutlineTicket size={20} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-zinc-900 text-sm font-medium font-inter">{title}</span>
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
          <span>{user}</span>
          <div className="w-1 h-1 bg-zinc-300 rounded-full" />
          <span>{category}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">{time}</span>
      <span className={cn(
        "px-2.5 py-0.5 text-[10px] font-semibold rounded-full capitalize",
        status === 'completed' ? "bg-emerald-50 text-emerald-700" :
        status === 'cancelled' ? "bg-red-50 text-red-600" :
        "bg-blue-50 text-blue-700"
      )}>{status}</span>
    </div>
  </div>
)

// Simple SVG line chart
function LineChart({ demands, fulfilled, labels }: { demands: number[], fulfilled: number[], labels: string[] }) {
  const W = 500, H = 160, PAD = 20
  const max = Math.max(...demands, ...fulfilled, 1)

  const toX = (i: number) => PAD + (i / (demands.length - 1)) * (W - PAD * 2)
  const toY = (v: number) => H - PAD - (v / max) * (H - PAD * 2)

  const line = (pts: number[]) =>
    pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')

  const area = (pts: number[]) =>
    `${line(pts)} L${toX(pts.length - 1)},${H - PAD} L${toX(0)},${H - PAD} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1={PAD} x2={W - PAD} y1={toY(max * t)} y2={toY(max * t)}
          stroke="#f4f4f5" strokeWidth="1" />
      ))}
      {/* Area fills */}
      <path d={area(demands)} fill="rgba(59,130,246,0.08)" />
      <path d={area(fulfilled)} fill="rgba(16,185,129,0.08)" />
      {/* Lines */}
      <path d={line(demands)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      <path d={line(fulfilled)} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
      {/* Dots */}
      {demands.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#3b82f6" />
      ))}
      {fulfilled.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#10b981" />
      ))}
      {/* X labels */}
      {labels.map((l, i) => (
        <text key={i} x={toX(i)} y={H - 2} textAnchor="middle" fontSize="9" fill="#a1a1aa">{l}</text>
      ))}
    </svg>
  )
}

// Donut chart
function DonutChart({ slices }: { slices: { label: string; count: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.count, 0)
  if (total === 0) return (
    <div className="flex items-center justify-center h-36">
      <div className="w-32 h-32 rounded-full border-[12px] border-zinc-100 flex items-center justify-center">
        <span className="text-sm text-zinc-400">No data</span>
      </div>
    </div>
  )

  const R = 56, CX = 70, CY = 70, stroke = 20
  let cumAngle = -Math.PI / 2

  const colorMap: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-emerald-500': '#10b981',
    'bg-orange-500': '#f97316',
    'bg-purple-500': '#a855f7',
    'bg-red-500': '#ef4444',
  }

  const paths = slices.map((s) => {
    const angle = (s.count / total) * 2 * Math.PI
    const x1 = CX + R * Math.cos(cumAngle)
    const y1 = CY + R * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = CX + R * Math.cos(cumAngle)
    const y2 = CY + R * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    return { d: `M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`, color: colorMap[s.color] || '#3b82f6' }
  })

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="w-36 h-36">
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} opacity="0.85" />)}
        <circle cx={CX} cy={CY} r={R - stroke} fill="white" />
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d1d1f">
          {total}
        </text>
        <text x={CX} y={CY + 16} textAnchor="middle" fontSize="7" fill="#a1a1aa">BOOKINGS</text>
      </svg>
    </div>
  )
}

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookings()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: engineers, isLoading: engineersLoading } = useAdminEngineers()

  const recentBookings = React.useMemo(() => {
    return [...(bookings || [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [bookings])

  // Build last 7 days demands vs fulfilled
  const chartData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))
    const labels = days.map(d => format(d, 'dd/MM'))
    const demands = days.map(d => {
      const dayStr = format(d, 'yyyy-MM-dd')
      return (bookings || []).filter((b: any) =>
        b.createdAt?.slice(0, 10) === dayStr
      ).length
    })
    const fulfilled = days.map(d => {
      const dayStr = format(d, 'yyyy-MM-dd')
      return (bookings || []).filter((b: any) =>
        b.createdAt?.slice(0, 10) === dayStr && b.status?.toLowerCase() === 'completed'
      ).length
    })
    return { labels, demands, fulfilled }
  }, [bookings])

  // Distribution by service
  const distribution = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return []
    const totals: Record<string, number> = {}
    bookings.forEach((b: any) => {
      const cat = b.serviceCategory || b.service?.categoryName || b.serviceName || 'Others'
      totals[cat] = (totals[cat] || 0) + 1
    })
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500']
    const total = Object.values(totals).reduce((s, v) => s + v, 0)
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count], idx) => ({
        label,
        count,
        percent: `${((count / total) * 100).toFixed(1)}%`,
        color: colors[idx % colors.length]
      }))
  }, [bookings])

  if (statsLoading || bookingsLoading || categoriesLoading || engineersLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px] mx-auto">
      <div className="flex flex-col">
        <h1 className="text-neutral-700 text-xl font-semibold font-heading leading-8">Overview</h1>
        <p className="text-zinc-600 text-base font-normal font-inter leading-6">Platform Pulse &amp; System Command Center</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatCard title="Platform Revenue" value={`₦${((stats as any)?.totalRevenue || 0).toLocaleString()}`} icon={HiOutlineCurrencyDollar} />
        <StatCard title="Total Homeowners" value={(stats as any)?.totalHomeowners ?? 0} icon={HiOutlineUsers} />
        <StatCard title="Total Professionals" value={(stats as any)?.totalEngineers ?? 0} icon={HiOutlineBriefcase} />
        <StatCard title="Completed Jobs" value={(stats as any)?.completedJobs ?? 0} icon={HiOutlineCheckCircle} />
        <StatCard title="Platform Rating" value={(stats as any)?.averageRating ?? '0'} icon={HiOutlineViewGrid} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Line Chart */}
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-neutral-700 text-base font-semibold">Booking Activity (Last 7 Days)</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-zinc-600 text-xs font-medium">Total Demands</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-zinc-600 text-xs font-medium">Total Fulfilled</span>
                </div>
              </div>
            </div>
            <LineChart
              demands={chartData.demands}
              fulfilled={chartData.fulfilled}
              labels={chartData.labels}
            />
            <div className="flex justify-between text-xs text-zinc-400 px-1">
              <span>Total bookings: <strong className="text-zinc-700">{chartData.demands.reduce((a, b) => a + b, 0)}</strong></span>
              <span>Completed: <strong className="text-emerald-600">{chartData.fulfilled.reduce((a, b) => a + b, 0)}</strong></span>
            </div>
          </div>

          {/* Audit Log */}
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-4 shadow-sm">
            <h2 className="text-neutral-700 text-base font-semibold font-inter">System Audit Log</h2>
            <div className="flex flex-col">
              {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
                <AuditLogItem
                  key={booking.id}
                  title={`New Booking: ${booking.id.slice(-6).toUpperCase()}`}
                  user={booking.customerName || booking.customerDetails?.name || 'Customer'}
                  category={booking.serviceName || booking.service?.name || 'Service'}
                  time={booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }).toUpperCase() : 'JUST NOW'}
                  status={booking.status || 'pending'}
                />
              )) : (
                <p className="text-zinc-400 text-sm py-6 text-center">No recent bookings</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Donut + Legend */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl border border-zinc-300 bg-white flex flex-col gap-6 shadow-sm h-full">
            <h2 className="text-neutral-700 text-base font-semibold">Service Distribution</h2>
            <DonutChart slices={distribution} />
            <div className="flex flex-col gap-3">
              {distribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", item.color)} />
                    <span className="text-zinc-700 text-xs font-medium truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-zinc-400 text-xs">{item.percent}</span>
                    <span className="text-zinc-700 text-xs font-semibold w-6 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
              {distribution.length === 0 && (
                <p className="text-zinc-400 text-xs text-center">No booking data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
