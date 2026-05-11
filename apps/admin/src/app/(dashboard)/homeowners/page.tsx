'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineDotsVertical,
  HiOutlineBan,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminUsers, useBanUser } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function HomeownersPage() {
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

  const homeowners = users?.filter((u: any) => 
    u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'customer'
  ).filter((u: any) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleToggleBan = (userId: string, isBanned: boolean) => {
    const action = isBanned ? 'unban' : 'ban'
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      banUser(userId, {
        onSuccess: () => toast.success(`User ${action}ned successfully`),
        onError: (err: any) => toast.error(err.message || `Failed to ${action} user`)
      })
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">Homeowners</h1>
          <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
            Manage and monitor platform house owners
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-72">
            <input 
              placeholder="Search by name or email..." 
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
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {homeowners.length > 0 ? homeowners.map((user: any) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-100">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-800">{user.name || 'Unnamed User'}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">ID: {user.id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                        <HiOutlineMail className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                          <HiOutlinePhone className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                      <HiOutlineCalendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                      user.isBanned 
                        ? "bg-rose-50 text-rose-600" 
                        : "bg-emerald-50 text-emerald-600"
                    )}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleBan(user.id, user.isBanned)}
                        disabled={isBanning}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          user.isBanned 
                            ? "text-emerald-600 hover:bg-emerald-50" 
                            : "text-rose-600 hover:bg-rose-50"
                        )}
                        title={user.isBanned ? 'Unban User' : 'Ban User'}
                      >
                        <HiOutlineBan className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all">
                        <HiOutlineDotsVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No homeowners found matching your criteria.
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
