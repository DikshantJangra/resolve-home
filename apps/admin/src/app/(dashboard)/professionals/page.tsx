'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineTrendingUp,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineBadgeCheck
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminUsers, useBanUser, useAdminEngineerStats } from '@/hooks/api-hooks'
import { toast } from 'sonner'

const StatCard = ({ title, value, trend, icon: Icon }: { 
  title: string, 
  value: string | number, 
  trend?: string, 
  icon: React.ElementType 
}) => (
  <div className="flex-1 min-w-[240px] p-4 rounded-xl border border-zinc-300 flex flex-col gap-3 bg-white shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{title}</span>
        <span className="text-neutral-700 text-2xl font-bold font-heading leading-8">{value}</span>
      </div>
      <div className="w-6 h-6 text-zinc-600 flex items-center justify-center">
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

export default function ProfessionalsPage() {
  const [search, setSearch] = useState('')
  const { data: users, isLoading: usersLoading, error } = useAdminUsers()
  const { data: statsData, isLoading: statsLoading } = useAdminEngineerStats()
  const { mutate: banUser, isPending: isBanning } = useBanUser()

  if (usersLoading || statsLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    )
  }

  const professionals = users?.filter((u: { role?: string }) => 
    u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer'
  ).filter((u: { name?: string; email?: string; category?: string }) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.category?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const stats = {
    total: statsData?.totalEngineers || professionals.length,
    active: statsData?.activeProfessionals || professionals.filter((u: any) => !u.isBanned).length,
    inactive: statsData?.inactiveProfessionals || professionals.filter((u: any) => u.isBanned).length,
    jobsDone: statsData?.jobsDone || professionals.reduce((acc: number, u: any) => acc + (u.totalJobs || 0), 0)
  }

  const handleToggleBan = (userId: string, isBanned: boolean) => {
    const action = isBanned ? 'unban' : 'ban'
    if (confirm(`Are you sure you want to ${action} this professional?`)) {
      banUser(userId, {
        onSuccess: () => toast.success(`Professional ${action}ned successfully`),
        onError: (err: any) => toast.error(err.message || `Failed to ${action} professional`)
      })
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-xl font-semibold font-heading leading-8">Service Professionals</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Onboard, verify, and monitor field service experts.
          </p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl h-auto font-medium text-sm">
          Onboard Pro
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Professionals" value={stats.total} trend={statsData?.trends?.total} icon={HiOutlineUsers} />
        <StatCard title="Jobs Done" value={stats.jobsDone} trend={statsData?.trends?.jobs} icon={HiOutlineBriefcase} />
        <StatCard title="Active Professionals" value={stats.active} trend={statsData?.trends?.active} icon={HiOutlineBadgeCheck} />
        <StatCard title="Inactive members" value={stats.inactive} trend={statsData?.trends?.inactive} icon={HiOutlineUsers} />
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            placeholder="Search professional" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-4 pl-10 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        </div>
        <Button variant="outline" className="h-11 rounded-xl border-zinc-200 text-zinc-600 gap-2">
          <HiOutlineFilter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Professionals Table */}
      <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-300">
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">NAME</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">EXPERTISE</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">RATING</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">EARNINGS</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {professionals.length > 0 ? professionals.map((pro: any) => (
                <tr 
                  key={pro.id} 
                  className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-medium text-sm border border-zinc-200 overflow-hidden">
                        {pro.profileImage ? (
                          <img src={pro.profileImage} alt={pro.name} className="w-full h-full object-cover" />
                        ) : (
                          pro.name?.charAt(0) || 'P'
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900">{pro.name || 'Unnamed Pro'}</span>
                          {pro.isVerified && <HiOutlineBadgeCheck className="text-blue-700 w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs text-zinc-500">{pro.email}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id}`} className="block">
                      <span className="text-sm text-zinc-600 font-medium">{pro.category || pro.specialty || 'General'}</span>
                    </Link>
                  </td>
                   <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id}`} className="block">
                      <div className="flex items-center gap-2.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full w-fit">
                        <HiOutlineStar className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-600 text-sm font-medium">{pro.rating || 'N/A'}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id}`} className="block">
                      <span className="text-sm text-zinc-600 font-medium">{pro.earnings ? `₦${pro.earnings.toLocaleString()}` : 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id}`} className="flex items-center gap-2">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        pro.isBanned ? "bg-rose-400" : "bg-green-700"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        pro.isBanned ? "text-rose-400" : "text-green-700"
                      )}>
                        {pro.isBanned ? 'Suspended' : 'Active'}
                      </span>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No professionals found matching your search.
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
