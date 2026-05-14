'use client'

import React, { useState } from 'react'
import {
  HiOutlineSearch,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineChevronDown,
  HiOutlineRefresh,
} from 'react-icons/hi'
import { cn, Skeleton, Input } from "@resolve/ui"
import { useAdminSubscriptions } from '@/hooks/api-hooks'
import { format } from 'date-fns'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  past_due: 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
  pending: 'bg-blue-50 text-blue-600 border-blue-200',
}

const PLAN_COLORS: Record<string, string> = {
  basic: 'bg-zinc-100 text-zinc-600',
  standard: 'bg-blue-50 text-blue-700',
  premium: 'bg-purple-50 text-purple-700',
}

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const PAGE_SIZE = 20

  const { data, isLoading, refetch, isFetching } = useAdminSubscriptions(page, PAGE_SIZE, statusFilter || undefined)

  const allSubs: any[] = data?.subscriptions || data?.items || (Array.isArray(data) ? data : [])
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages || Math.ceil((pagination?.total || allSubs.length) / PAGE_SIZE) || 1

  // Client-side search filter
  const subscriptions = search
    ? allSubs.filter((s: any) => {
      const q = search.toLowerCase()
      return (
        s.user?.name?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.planName?.toLowerCase().includes(q) ||
        s.planId?.toLowerCase().includes(q)
      )
    })
    : allSubs

  const activeCount = allSubs.filter((s: any) => s.status === 'active').length
  const pendingCount = allSubs.filter((s: any) => s.status === 'pending' || s.status === 'past_due').length
  const totalRevenue = allSubs.reduce((sum: number, s: any) => sum + (s.amount || 0), 0)

  const stats = [
    { label: 'Active Subscriptions', value: data?.totalActive ?? activeCount, icon: HiOutlineCreditCard },
    { label: 'Pending / Past Due', value: data?.totalPending ?? pendingCount, icon: HiOutlineClock },
    { label: 'Total Revenue', value: `₦${(data?.totalRevenue ?? totalRevenue).toLocaleString()}`, icon: HiOutlineTrendingUp },
  ]

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-44 rounded-lg" />
            <Skeleton className="h-5 w-80 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden">
          <div className="bg-stone-50 border-b border-zinc-300 px-6 py-4 grid grid-cols-5 gap-4">
            {['Subscriber', 'Plan', 'Amount', 'Status', 'Next Billing'].map(col => (
              <Skeleton key={col} className="h-4 w-20 rounded" />
            ))}
          </div>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="px-6 py-4 border-b border-zinc-100 grid grid-cols-5 gap-4 items-center">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Subscriptions</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage platform memberships, billing cycles, and plan distributions.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 transition-colors"
        >
          <HiOutlineRefresh className={cn("w-4 h-4", isFetching && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-zinc-300 bg-white flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-700 text-sm font-normal font-inter">{stat.label}</span>
                <span className="text-neutral-700 text-2xl font-bold font-plus-jakarta">{stat.value}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-zinc-100">
                <stat.icon className="w-5 h-5 text-zinc-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search by name, email or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 h-12 bg-white"
          />
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        </div>
        <div className="relative w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="w-full h-12 pl-4 pr-10 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="past_due">Past Due</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-300">
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Subscriber</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Plan</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Start Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Next Billing</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase tracking-tight">Auto Renew</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {subscriptions.length > 0 ? subscriptions.map((sub: any) => (
                <tr key={sub.id || sub._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-neutral-900">{sub.user?.name || 'Unknown'}</span>
                      <span className="text-xs text-zinc-500">{sub.user?.email || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                      PLAN_COLORS[sub.planId?.toLowerCase()] || 'bg-zinc-100 text-zinc-600'
                    )}>
                      {sub.planName || sub.planId || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-700">
                    ₦{(sub.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
                      STATUS_COLORS[sub.status] || 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    )}>
                      {sub.status?.replace('_', ' ') || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {sub.startDate ? format(new Date(sub.startDate), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {sub.endDate ? format(new Date(sub.endDate), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      sub.autoRenew ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"
                    )}>
                      {sub.autoRenew ? 'On' : 'Off'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-zinc-500 text-sm">
                    No subscriptions found.
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
            Page {page} of {totalPages} · {pagination?.total || allSubs.length} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
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
    </div>
  )
}
