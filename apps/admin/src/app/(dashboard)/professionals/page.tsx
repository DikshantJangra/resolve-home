'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineCheckCircle,
  HiOutlineBan,
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlineCalendar
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminUsers, useBanUser } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function ProfessionalsPage() {
  const [search, setSearch] = useState('')
  const { data: users, isLoading, error } = useAdminUsers()
  const { mutate: banUser, isPending: isBanning } = useBanUser()

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      </div>
    )
  }

  const professionals = users?.filter((u: any) => 
    u.role?.toLowerCase() === 'worker' || u.role?.toLowerCase() === 'engineer'
  ).filter((u: any) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.category?.toLowerCase().includes(search.toLowerCase())
  ) || []

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
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">Professionals</h1>
          <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
            Manage and verify service providers on the platform
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-72">
            <input 
              placeholder="Search name, email, or category..." 
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
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Professional</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {professionals.length > 0 ? professionals.map((pro: any) => (
                <tr key={pro.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100">
                        {pro.name?.charAt(0) || 'P'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-800">{pro.name || 'Unnamed Pro'}</span>
                        <span className="text-[10px] text-zinc-500">{pro.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-stone-100 rounded-lg">
                        <HiOutlineBriefcase className="w-4 h-4 text-zinc-600" />
                      </div>
                      <span className="text-sm text-zinc-700 font-medium">{pro.category || pro.specialty || 'General'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                        <HiOutlineStar className="w-4 h-4 fill-amber-500" />
                        <span>{pro.rating || '4.5'}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium">{pro.totalJobs || '0'} Jobs Completed</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={cn(
                        "w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                        pro.isBanned ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {pro.isBanned ? 'Banned' : 'Active'}
                      </span>
                      {pro.isVerified && (
                        <div className="flex items-center gap-1 text-blue-600 text-[10px] font-bold">
                          <HiOutlineCheckCircle className="w-3 h-3" />
                          <span>VERIFIED</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleBan(pro.id, pro.isBanned)}
                        disabled={isBanning}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          pro.isBanned ? "text-emerald-600 hover:bg-emerald-50" : "text-rose-600 hover:bg-rose-50"
                        )}
                        title={pro.isBanned ? 'Unban Professional' : 'Ban Professional'}
                      >
                        <HiOutlineBan className="w-5 h-5" />
                      </button>
                      <Button variant="ghost" className="h-9 px-3 text-xs font-bold text-blue-700 hover:bg-blue-50 border border-blue-100">
                        Details
                      </Button>
                    </div>
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
