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
import { useAdminVerificationRequests, useAdminVerifyEngineer, useAdminEngineers } from '@/hooks/api-hooks'
import { ENDPOINTS } from "@resolve/api"
import Link from 'next/link'
import { toast } from 'sonner'

export default function VerificationPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data: verifData, isLoading: verifLoading, error: verifError } = useAdminVerificationRequests(page)
  const { data: engineers, isLoading: engLoading } = useAdminEngineers()
  const { mutate: verifyEngineer } = useAdminVerifyEngineer()

  React.useEffect(() => {
    if (verifData) {
      console.log('[VerificationList] Loaded Requests:', verifData);
    }
  }, [verifData]);

  const verifications = verifData?.verifications || []
  const pagination = verifData?.pagination

  const isLoading = verifLoading || engLoading

  const stats = useMemo(() => {
    const pending = verifications.length || 0
    const total = engineers?.length || 0
    const approved = engineers?.filter((e: any) => e.status === 'approved').length || 0
    const rejected = engineers?.filter((e: any) => e.status === 'rejected').length || 0
    
    // Calculate rate (percentage of approved engineers)
    const rate = total > 0 ? `${((approved / total) * 100).toFixed(1)}%` : '0%'

    return {
      pending,
      rate,
      rejected
    }
  }, [verifications, engineers])

  const filteredVerifications = useMemo(() => {
    // Merge verifications from the specific endpoint with pending engineers from the general list
    // This provides a fallback if the verifications endpoint structure is different
    const pendingFromEngineers = engineers?.filter((e: any) => 
      e.status?.toLowerCase() === 'pending' || 
      e.verificationStatus?.toLowerCase() === 'pending' ||
      e.engineerProfile?.verificationStatus?.toLowerCase() === 'pending'
    ) || []
    
    // Combine and deduplicate by ID
    const combined = [...verifications]
    
    pendingFromEngineers.forEach((pe: any) => {
      if (!combined.find(v => v.id === pe.id)) {
        combined.push(pe)
      }
    })

    return combined.filter((v: any) => {
      const searchStr = `${v.fullName || v.name} ${v.email} ${v.category || v.primarySpecialty}`.toLowerCase()
      return searchStr.includes(search.toLowerCase())
    })
  }, [verifications, engineers, search])

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
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto animate-pulse">
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

  if (verifError || verifData === null) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-4">
        <HiOutlineExclamationCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold text-neutral-700">Verification Fetching Error</h2>
        <p className="text-zinc-600">{(verifError as any)?.message || "Failed to fetch verification requests from the server."}</p>
        <p className="text-xs text-zinc-400">Endpoint: {ENDPOINTS.ADMIN_ENGINEER_VERIFICATIONS.PENDING}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-9 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Verification</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage and review professional registration requests.
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
                <tr key={v.id || v._id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {v.fullName?.charAt(0) || v.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-700 text-sm font-medium font-inter">{v.fullName || v.name}</span>
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
                      {(() => {
                        const isGuarantorVerified = !!(v.isGuarantorVerified || v.guarantorVerified || v.engineerProfile?.isGuarantorVerified);
                        return (
                          <button 
                            disabled={!isGuarantorVerified}
                            onClick={() => handleAction(v.id || v._id, 'approved')}
                            className={cn(
                              "transition-colors",
                              isGuarantorVerified ? "text-green-600 hover:text-green-700" : "text-zinc-300 cursor-not-allowed grayscale"
                            )}
                            title={isGuarantorVerified ? "Approve" : "Guarantor verification pending"}
                          >
                            <HiOutlineCheckCircle className="w-6 h-6" />
                          </button>
                        );
                      })()}
                      <button 
                        onClick={() => handleAction(v.id || v._id, 'rejected')}
                        className="text-red-400 hover:text-red-500 transition-colors"
                        title="Reject"
                      >
                        <HiOutlineXCircle className="w-6 h-6" />
                      </button>
                      <Link 
                        href={`/verification/${v.id || v._id}`}
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
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-between bg-white">
            <div className="text-sm text-zinc-500">
              Showing <span className="font-medium">{((page - 1) * 10) + 1}</span> to <span className="font-medium">{Math.min(page * 10, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
