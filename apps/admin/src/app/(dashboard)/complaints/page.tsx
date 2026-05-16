'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineTrendingUp,
  HiOutlineClipboardList,
  HiOutlineBadgeCheck,
  HiOutlineExclamationCircle,
  HiOutlineChevronRight
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminComplaints, useAdminComplaintStats } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import Link from 'next/link'

const PAGE_SIZE = 10

export default function ComplaintsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data: complaints, isLoading: complaintsLoading } = useAdminComplaints()
  const { data: statsData, isLoading: statsLoading } = useAdminComplaintStats()

  const filteredComplaints = complaints?.filter((c: any) => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) || 
                          c.title?.toLowerCase().includes(search.toLowerCase()) ||
                          c.userName?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  }) || []

  const totalPages = Math.ceil(filteredComplaints.length / PAGE_SIZE)
  const paginatedComplaints = filteredComplaints.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = [
    { label: 'Total Complaints', value: (statsData as any)?.totalComplaints || '0', trend: (statsData as any)?.trends?.totalComplaints, icon: HiOutlineClipboardList },
    { label: 'Resolved Cases', value: (statsData as any)?.resolvedCases || '0', trend: (statsData as any)?.trends?.resolvedCases, icon: HiOutlineBadgeCheck },
    { label: 'Pending Disputes', value: (statsData as any)?.pendingDisputes || '0', trend: (statsData as any)?.trends?.pendingDisputes, icon: HiOutlineExclamationCircle },
  ]

  if (complaintsLoading || statsLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-7 w-44 bg-zinc-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-zinc-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col gap-3 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-28 bg-zinc-100 rounded" />
                  <div className="h-7 w-12 bg-zinc-200 rounded" />
                </div>
                <div className="w-8 h-8 bg-zinc-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden animate-pulse">
          <div className="bg-stone-50 border-b border-zinc-200 px-6 py-4 grid grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-3 w-16 bg-zinc-200 rounded" />)}
          </div>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="px-6 py-4 border-b border-zinc-100 grid grid-cols-6 gap-4 items-center">
              <div className="h-3 w-16 bg-zinc-100 rounded" />
              <div className="h-3 w-20 bg-zinc-100 rounded" />
              <div className="h-3 w-32 bg-zinc-100 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-100 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-20 bg-zinc-200 rounded" />
                  <div className="h-2.5 w-28 bg-zinc-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-16 bg-zinc-100 rounded" />
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-zinc-200 rounded-full" />
                <div className="h-3 w-14 bg-zinc-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Conflict Resolution</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage sensitive customer disputes and reports.
          </p>
        </div>
        <div className="w-48 px-6 py-3 opacity-0 bg-blue-700 rounded-xl flex justify-center items-center gap-3">
          <span className="text-neutral-50 text-sm font-medium font-inter">Onboard Pro</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-zinc-300 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{stat.label}</span>
                <span className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">{stat.value}</span>
              </div>
              <div className="w-6 h-6 flex items-center justify-center text-zinc-600">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {stat.trend && (
              <div className="flex items-center gap-1">
                <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-700 text-xs font-medium font-inter leading-4">{stat.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-zinc-300 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="bg-stone-50 border-b border-zinc-300">
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">TICKET ID</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">DATE</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">SUBJECT</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">NAME</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">USER TYPE</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-300">
            {paginatedComplaints.length > 0 ? paginatedComplaints.map((c: any) => (
              <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {c.id.slice(-5).toUpperCase() || '89274'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {c.createdAt ? format(new Date(c.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-80">
                    <p className="text-zinc-600 text-sm font-medium font-inter line-clamp-1">
                      {c.title || 'N/A'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-600/10 rounded-full flex items-center justify-center text-neutral-700 font-medium text-sm overflow-hidden">
                      {c.userAvatar ? (
                        <img src={c.userAvatar} alt={c.userName} className="w-full h-full object-cover" />
                      ) : (
                        c.userName?.charAt(0) || 'A'
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-800 text-sm font-medium font-inter">
                          {c.userName || 'N/A'}
                        </span>
                        {c.userRole === 'professional' && (
                          <HiOutlineBadgeCheck className="w-3.5 h-3.5 text-blue-700" />
                        )}
                      </div>
                      <span className="text-zinc-500 text-xs font-normal font-inter">{c.userEmail || ''}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter capitalize">
                    {c.userRole || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/complaints/${c.id}`} className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      c.status === 'open' ? "bg-green-700" : (c.status === 'pending' ? "bg-rose-400" : "bg-zinc-600")
                    )} />
                    <span className={cn(
                      "text-sm font-medium font-inter capitalize",
                      c.status === 'open' ? "text-green-700" : (c.status === 'pending' ? "text-rose-400" : "text-zinc-600")
                    )}>
                      {c.status || 'N/A'}
                    </span>
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                  No complaints found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-500">Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredComplaints.length)} of {filteredComplaints.length} items</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={cn("w-8 h-8 text-sm rounded-lg font-medium", p === page ? "bg-blue-700 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50")}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
