'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineTrendingUp,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineDotsVertical,
  HiOutlineBadgeCheck
} from 'react-icons/hi'
import { cn, Button, Skeleton, Input } from "@resolve/ui"
import { useAdminUsers, useAdminStats } from '@/hooks/api-hooks'
import Link from 'next/link'

export default function HomeownersPage() {
  const [search, setSearch] = useState('')
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: statsData, isLoading: statsLoading } = useAdminStats()

  const homeowners = users?.filter((u: any) => 
    u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'customer'
  ).filter((u: any) => {
    const searchStr = `${u.name || u.fullName} ${u.email}`.toLowerCase()
    return searchStr.includes(search.toLowerCase())
  }) || []

  const stats = [
    { label: 'Total Homeowners', value: (statsData as any)?.totalHomeowners || homeowners.length, trend: (statsData as any)?.trends?.homeowners, icon: HiOutlineUsers },
    { label: 'Membership Pro', value: (statsData as any)?.membershipPro || 'N/A', trend: (statsData as any)?.trends?.membership, icon: HiOutlineBriefcase },
    { label: 'Active Members', value: (statsData as any)?.activeMembers || homeowners.filter((u: any) => !u.isBanned).length, trend: (statsData as any)?.trends?.active, icon: HiOutlineUserGroup },
    { label: 'Inactive members', value: (statsData as any)?.inactiveMembers || homeowners.filter((u: any) => u.isBanned).length, trend: (statsData as any)?.trends?.inactive, icon: HiOutlineUserGroup },
  ]

  if (usersLoading || statsLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px]">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Homeowners</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage user accounts, subscriptions, and platform access.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Input 
            placeholder="Search homeowner" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-10 rounded-xl" 
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-zinc-300 flex flex-col gap-3 shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{stat.label}</span>
                <span className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">{stat.value}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-zinc-100 text-zinc-600">
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
      <div className="rounded-xl border border-zinc-300 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="bg-stone-50 border-b border-zinc-300">
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter uppercase">NAME</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter uppercase">LOCATION</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter uppercase">PLAN</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter uppercase">BOOKINGS</th>
              <th className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter uppercase">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {homeowners.length > 0 ? homeowners.map((user: any) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/homeowners/${user.id}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm overflow-hidden">
                      {user.avatar || user.profileImage ? (
                        <img src={user.avatar || user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        (user.name || user.fullName)?.charAt(0) || 'A'
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-800 text-sm font-medium font-inter group-hover:text-blue-700 transition-colors">
                          {user.name || user.fullName || 'Unnamed User'}
                        </span>
                        {user.emailVerified && <HiOutlineBadgeCheck className="text-blue-700 w-3.5 h-3.5" title="Verified Account" />}
                      </div>
                      <span className="text-zinc-500 text-xs font-normal font-inter">{user.email}</span>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {user.location || user.city || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "px-4 py-1 rounded-full border flex justify-center items-center w-fit",
                    user.plan?.toLowerCase() === 'premium' 
                      ? "bg-indigo-50 border-indigo-200 text-blue-700" 
                      : "bg-stone-50 border-zinc-300 text-zinc-600"
                  )}>
                    <span className="text-sm font-medium font-inter">
                      {user.subscription?.planName || user.plan || 'Free'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {user.bookingsCount || user.totalBookings || '0'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      user.isBanned ? "bg-rose-400" : (user.status === 'inactive' ? "bg-zinc-600" : "bg-green-700")
                    )} />
                    <span className={cn(
                      "text-sm font-medium font-inter",
                      user.isBanned ? "text-rose-400" : (user.status === 'inactive' ? "text-zinc-600" : "text-green-700")
                    )}>
                      {user.isBanned ? 'Suspended' : (user.status || 'Active')}
                    </span>
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
