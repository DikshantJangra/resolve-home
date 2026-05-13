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
  HiOutlineBadgeCheck,
  HiOutlineChevronDown
} from 'react-icons/hi'
import { cn, Button, Skeleton, Input } from "@resolve/ui"
import { useAdminUsers, useBanUser, useAdminStats, useCategories } from '@/hooks/api-hooks'
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
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: users, isLoading: usersLoading, error } = useAdminUsers()
  const { data: statsData, isLoading: statsLoading } = useAdminStats()
  const { data: categories } = useCategories()
  const { mutate: banUser, isPending: isBanning } = useBanUser()

  const professionals = (users || [])
    .filter((u: { role?: string }) => 
      u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer'
    )
    .filter((u: any) => {
      // Search logic
      const searchStr = `${u.name || u.fullName} ${u.email} ${u.category || u.primarySpecialty}`.toLowerCase()
      const matchesSearch = searchStr.includes(search.toLowerCase())

      // Category logic
      const matchesCategory = categoryFilter === 'all' || 
        (u.category?.toLowerCase() === categoryFilter.toLowerCase()) || 
        (u.primarySpecialty?.toLowerCase() === categoryFilter.toLowerCase())

      // Status logic
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && !u.isBanned) || 
        (statusFilter === 'suspended' && u.isBanned)

      return matchesSearch && matchesCategory && matchesStatus
    })

  const stats = {
    total: (statsData as any)?.totalEngineers || professionals.length,
    active: (statsData as any)?.activeProfessionals || (users || []).filter((u: any) => (u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer') && !u.isBanned).length,
    inactive: (statsData as any)?.inactiveProfessionals || (users || []).filter((u: any) => (u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer') && u.isBanned).length,
    jobsDone: (statsData as any)?.jobsDone || professionals.reduce((acc: number, u: any) => acc + (u.totalJobs || 0), 0)
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

  if (usersLoading || statsLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
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

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Service Professionals</h1>
            <p className="text-zinc-600 text-base font-normal font-inter leading-6">
              Onboard, verify, and monitor field service experts.
            </p>
          </div>
          <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl h-auto font-medium text-sm transition-all shadow-sm">
            Onboard Pro
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Professionals" value={stats.total} trend={(statsData as any)?.trends?.total} icon={HiOutlineUsers} />
          <StatCard title="Jobs Done" value={stats.jobsDone} trend={(statsData as any)?.trends?.jobs} icon={HiOutlineBriefcase} />
          <StatCard title="Active Professionals" value={stats.active} trend={(statsData as any)?.trends?.active} icon={HiOutlineBadgeCheck} />
          <StatCard title="Suspended Professionals" value={stats.inactive} trend={(statsData as any)?.trends?.inactive} icon={HiOutlineUsers} />
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Input 
            placeholder="Search professionals by name, email or specialty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 h-12 bg-white"
          />
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Specialties</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative w-full md:w-40">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
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
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-zinc-200 overflow-hidden">
                        {pro.profileImage || pro.avatar ? (
                          <img src={pro.profileImage || pro.avatar} alt={pro.name || pro.fullName} className="w-full h-full object-cover" />
                        ) : (
                          (pro.name || pro.fullName)?.charAt(0) || 'P'
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900">{pro.name || pro.fullName || 'Unnamed Pro'}</span>
                          {(pro.isVerified || pro.status === 'approved') && <HiOutlineBadgeCheck className="text-blue-700 w-3.5 h-3.5" title="Verified Professional" />}
                        </div>
                        <span className="text-xs text-zinc-500">{pro.email}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id}`} className="block">
                      <span className="text-sm text-zinc-600 font-medium">{pro.category || pro.primarySpecialty || pro.specialty || 'General'}</span>
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
