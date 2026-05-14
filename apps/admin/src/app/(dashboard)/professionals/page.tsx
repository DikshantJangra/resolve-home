'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  HiOutlineSearch,
  HiOutlineTrendingUp,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineBadgeCheck,
  HiOutlineChevronDown
} from 'react-icons/hi'
import { cn, Button, Skeleton, Input } from "@resolve/ui"
import { useAdminUsers, useAdminStats, useCategories, useCreateProfessional } from '@/hooks/api-hooks'
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
  </div>
)

export default function ProfessionalsPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showOnboardModal, setShowOnboardModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: statsData, isLoading: statsLoading } = useAdminStats()
  const { data: categories } = useCategories()
  const { mutate: createProfessional, isPending: isCreating } = useCreateProfessional()

  // Build a map of category id -> name for lookup
  const categoryMap = React.useMemo(() => {
    const map: Record<string, string> = {}
      ; (categories || []).forEach((cat: any) => {
        if (cat.id) map[cat.id] = cat.name
        if (cat._id) map[cat._id] = cat.name
      })
    return map
  }, [categories])

  const getCategoryName = (pro: any) => {
    const ep = pro.engineerProfile
    return ep?.categoryName || categoryMap[ep?.category] || ep?.category || ep?.primarySpecialty || pro.category || pro.primarySpecialty || 'N/A'
  }

  const professionals = (users || [])
    .filter((u: { role?: string }) =>
      u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer'
    )
    .filter((u: any) => {
      // Search logic
      const catName = getCategoryName(u).toLowerCase()
      const searchStr = `${u.name || u.fullName} ${u.email} ${catName}`.toLowerCase()
      const matchesSearch = searchStr.includes(search.toLowerCase())

      // Category logic
      const matchesCategory = categoryFilter === 'all' || catName === categoryFilter.toLowerCase()

      // Status logic
      const ep = u.engineerProfile || u
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'suspended' && u.isBanned) ||
        (statusFilter === 'active' && !u.isBanned && (ep.verificationStatus === 'approved' || ep.isVerified || ep.approvedAt)) ||
        (statusFilter === 'pending' && !u.isBanned && ep.verificationStatus !== 'approved' && !ep.isVerified && !ep.approvedAt && ep.verificationStatus !== 'rejected') ||
        (statusFilter === 'rejected' && !u.isBanned && ep.verificationStatus === 'rejected')

      return matchesSearch && matchesCategory && matchesStatus
    })

  // Pagination
  const totalPages = Math.ceil(professionals.length / PAGE_SIZE)
  const paginatedPros = professionals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = {
    total: (statsData as any)?.totalEngineers || professionals.length,
    active: (statsData as any)?.activeProfessionals || (users || []).filter((u: any) => (u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer') && !u.isBanned).length,
    inactive: (statsData as any)?.inactiveProfessionals || (users || []).filter((u: any) => (u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer') && u.isBanned).length,
    jobsDone: (statsData as any)?.jobsDone || professionals.reduce((acc: number, u: any) => acc + (u.totalJobs || 0), 0)
  }

  const handleOnboard = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email and password are required')
      return
    }
    createProfessional(form, {
      onSuccess: () => {
        toast.success('Professional onboarded successfully')
        setShowOnboardModal(false)
        setForm({ name: '', email: '', phone: '', password: '' })
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || 'Failed to onboard professional')
      }
    })
  }

  if (usersLoading || statsLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
        {/* Header skeleton */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-52 rounded-lg" />
              <Skeleton className="h-5 w-80 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>

          {/* Stat cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center gap-4">
          <Skeleton className="h-12 flex-1 w-full rounded-xl" />
          <Skeleton className="h-12 w-full md:w-48 rounded-xl" />
          <Skeleton className="h-12 w-full md:w-40 rounded-xl" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden">
          {/* Table header */}
          <div className="bg-stone-50 border-b border-zinc-300 px-6 py-4 grid grid-cols-5 gap-4">
            {['NAME', 'CATEGORY', 'RATING', 'EARNINGS', 'STATUS'].map(col => (
              <Skeleton key={col} className="h-4 w-20 rounded" />
            ))}
          </div>
          {/* Table rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="px-6 py-5 border-b border-zinc-100 grid grid-cols-5 gap-4 items-center">
              {/* Name cell */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
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
          <Button
            onClick={() => setShowOnboardModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl h-auto font-medium text-sm transition-all shadow-sm">
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
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-11 h-12 bg-white"
          />
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
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
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
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
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">CATEGORY</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">RATING</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">EARNINGS</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {paginatedPros.length > 0 ? paginatedPros.map((pro: any) => (
                <tr
                  key={pro.id || pro._id}
                  className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id || pro._id}`} className="flex items-center gap-3">
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
                    <Link href={`/professionals/${pro.id || pro._id}`} className="block">
                      <span className="text-sm text-zinc-600 font-medium">{getCategoryName(pro)}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id || pro._id}`} className="block">
                      <div className="flex items-center gap-2.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full w-fit">
                        <HiOutlineStar className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-600 text-sm font-medium">{pro.rating || 'N/A'}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id || pro._id}`} className="block">
                      <span className="text-sm text-zinc-600 font-medium">{pro.earnings ? `₦${pro.earnings.toLocaleString()}` : 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/professionals/${pro.id || pro._id}`} className="flex items-center gap-2">
                      {(() => {
                        const ep = pro.engineerProfile || pro
                        const status = pro.isBanned
                          ? { dot: 'bg-rose-400', text: 'text-rose-400', label: 'Suspended' }
                          : (ep.verificationStatus === 'approved' || ep.isVerified || ep.approvedAt)
                            ? { dot: 'bg-green-700', text: 'text-green-700', label: 'Active' }
                            : ep.verificationStatus === 'rejected'
                              ? { dot: 'bg-red-400', text: 'text-red-400', label: 'Rejected' }
                              : { dot: 'bg-amber-400', text: 'text-amber-600', label: 'Pending' }
                        return (
                          <>
                            <div className={cn("w-2.5 h-2.5 rounded-full", status.dot)} />
                            <span className={cn("text-sm font-medium", status.text)}>{status.label}</span>
                          </>
                        )
                      })()}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-500">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, professionals.length)} of {professionals.length} professionals
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-8 h-8 text-sm rounded-lg font-medium",
                  p === page ? "bg-blue-700 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Onboard Pro Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-neutral-700">Onboard Professional</h3>
              <button onClick={() => setShowOnboardModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +2348012345678"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5 block">Password *</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOnboardModal(false)}
                className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOnboard}
                disabled={isCreating}
                className="flex-1 py-2.5 bg-blue-700 rounded-xl text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {isCreating ? 'Creating...' : 'Onboard Pro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
