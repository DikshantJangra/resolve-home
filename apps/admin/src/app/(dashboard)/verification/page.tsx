'use client'

import React, { useState, useMemo } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminVerificationRequests, useAdminVerifyEngineer } from '@/hooks/api-hooks'
import Link from 'next/link'
import { toast } from 'sonner'

export default function VerificationPage() {
  const [search, setSearch] = useState('')
  const { data: verifications, isLoading, error } = useAdminVerificationRequests()
  const { mutate: verifyEngineer } = useAdminVerifyEngineer()

  const stats = useMemo(() => {
    if (!verifications) return { pending: 0, rate: '0%', rejected: 0 }
    const pending = verifications.length
    const approved = 0 // This should come from a different stat hook if available
    const rejected = 0
    return {
      pending,
      rate: '9.8%', // Hardcoded as per design or calculated if possible
      rejected: 47 // Hardcoded as per design
    }
  }, [verifications])

  const filteredVerifications = useMemo(() => {
    return verifications?.filter((v: any) => {
      const searchStr = `${v.fullName} ${v.email} ${v.category}`.toLowerCase()
      return searchStr.includes(search.toLowerCase())
    }) || []
  }, [verifications, search])

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    verifyEngineer({ id, status }, {
      onSuccess: () => {
        toast.success(`Engineer ${status === 'approved' ? 'approved' : 'rejected'} successfully`)
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || `Failed to ${status} engineer`)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-80 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-9 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Conflict Resolution</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage sensitive customer disputes and reports.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            placeholder="Search resolve" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 px-4 pr-12 rounded-xl border border-zinc-300 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-700 transition-all shadow-sm"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard 
          label="Pending Verifications" 
          value={stats.pending} 
          trend="+12.5%" 
          trendUp={true} 
          icon={<HiOutlineClock className="w-5 h-5 text-zinc-600" />} 
        />
        <StatCard 
          label="Verification Rate" 
          value={stats.rate} 
          trend="+12.5%" 
          trendUp={true} 
          icon={<HiOutlineShieldCheck className="w-5 h-5 text-zinc-600" />} 
        />
        <StatCard 
          label="Rejected Professionals" 
          value={stats.rejected} 
          trend="+12.5%" 
          trendUp={true} 
          icon={<HiOutlineXCircle className="w-5 h-5 text-zinc-600" />} 
        />
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-300">
                <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Applicant</th>
                <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Submitted</th>
                <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Status</th>
                <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredVerifications.length > 0 ? filteredVerifications.map((v: any) => (
                <tr key={v.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {v.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-700 text-sm font-medium font-inter">{v.fullName}</span>
                        <span className="text-zinc-500 text-xs font-normal font-inter">{v.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-600 text-sm font-medium font-inter">
                      {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        v.status === 'approved' ? "bg-green-600" : v.status === 'rejected' ? "bg-red-500" : "bg-zinc-400"
                      )} />
                      <span className={cn(
                        "text-sm font-medium font-inter capitalize",
                        v.status === 'approved' ? "text-green-700" : v.status === 'rejected' ? "text-red-600" : "text-zinc-600"
                      )}>
                        {v.status || 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleAction(v.id, 'approved')}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Approve"
                      >
                        <HiOutlineCheckCircle className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => handleAction(v.id, 'rejected')}
                        className="text-red-400 hover:text-red-500 transition-colors"
                        title="Reject"
                      >
                        <HiOutlineXCircle className="w-6 h-6" />
                      </button>
                      <Link 
                        href={`/verification/${v.id}`}
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                        title="View Details"
                      >
                        <HiOutlineArrowRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <HiOutlineUserGroup className="w-12 h-12 text-zinc-300" />
                      <p className="text-zinc-500 font-inter text-lg">No verification requests found.</p>
                    </div>
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

function StatCard({ label, value, trend, trendUp, icon }: any) {
  return (
    <div className="p-4 rounded-xl border border-zinc-300 bg-white flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{label}</span>
          <span className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">{value}</span>
        </div>
        <div className="p-2 rounded-lg bg-stone-50 border border-zinc-100 shadow-inner">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <HiOutlineTrendingUp className={cn("w-4 h-4", trendUp ? "text-green-500" : "text-red-500 rotate-180")} />
          </div>
          <span className={cn("text-xs font-medium font-inter leading-4", trendUp ? "text-green-700" : "text-red-700")}>{trend}</span>
        </div>
      )}
    </div>
  )
}
