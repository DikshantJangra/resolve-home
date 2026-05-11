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

export default function ComplaintsPage() {
  const [search, setSearch] = useState('')
  const { data: complaints, isLoading: complaintsLoading } = useAdminComplaints()
  const { data: statsData, isLoading: statsLoading } = useAdminComplaintStats()

  const filteredComplaints = complaints?.filter((c: any) => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) || 
                          c.title?.toLowerCase().includes(search.toLowerCase()) ||
                          c.userName?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  }) || []

  const stats = [
    { label: 'Total Complaints', value: statsData?.totalComplaints || '0', trend: '+12.5%', icon: HiOutlineClipboardList },
    { label: 'Resolved Cases', value: statsData?.resolvedCases || '0', trend: '+12.5%', icon: HiOutlineBadgeCheck },
    { label: 'Pending Disputes', value: statsData?.pendingDisputes || '0', trend: '+12.5%', icon: HiOutlineExclamationCircle },
  ]

  if (complaintsLoading || statsLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px]">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start">
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
            <div className="flex items-center gap-1">
              <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-700 text-xs font-medium font-inter leading-4">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-zinc-300 overflow-hidden">
        <table className="w-full text-left">
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
            {filteredComplaints.length > 0 ? filteredComplaints.map((c: any) => (
              <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {c.id.slice(-5).toUpperCase() || '89274'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {c.createdAt ? format(new Date(c.createdAt), 'MMM dd, yyyy') : 'Dec 15, 2024'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-80">
                    <p className="text-zinc-600 text-sm font-medium font-inter line-clamp-1">
                      {c.title || 'The refund has not processed'}
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
                          {c.userName || 'Jamison Stoltenberg'}
                        </span>
                        {c.userRole === 'professional' && (
                          <HiOutlineBadgeCheck className="w-3.5 h-3.5 text-blue-700" />
                        )}
                      </div>
                      <span className="text-zinc-500 text-xs font-normal font-inter">{c.userEmail || 'jamison@email.com'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter capitalize">
                    {c.userRole || 'Professional'}
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
                      {c.status || 'Open'}
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
  )
}
