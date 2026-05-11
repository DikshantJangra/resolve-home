'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineTrendingUp,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineDotsVertical
} from 'react-icons/hi'
import { cn, Button, Skeleton, Input } from "@resolve/ui"
import { useAdminUsers, useAdminUserStats } from '@/hooks/api-hooks'
import Link from 'next/link'

export default function HomeownersPage() {
  const [search, setSearch] = useState('')
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: statsData, isLoading: statsLoading } = useAdminUserStats()

  const homeowners = users?.filter((u: any) => 
    u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'customer'
  ).filter((u: any) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const stats = [
    { label: 'Total Homeowners', value: statsData?.totalHomeowners || homeowners.length, trend: statsData?.trends?.homeowners, icon: HiOutlineUsers },
    { label: 'Membership Pro', value: statsData?.membershipPro || 'N/A', trend: statsData?.trends?.membership, icon: HiOutlineBriefcase },
    { label: 'Active Members', value: statsData?.activeMembers || homeowners.filter((u: any) => !u.isBanned).length, trend: statsData?.trends?.active, icon: HiOutlineUserGroup },
    { label: 'Inactive members', value: statsData?.inactiveMembers || homeowners.filter((u: any) => u.isBanned).length, trend: statsData?.trends?.inactive, icon: HiOutlineUserGroup },
  ]

  if (usersLoading || statsLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px]">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
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
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Homeowners</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage user accounts, subscriptions, and platform access.
          </p>
        </div>
        <div className="relative w-96 opacity-0">
          <Input placeholder="Search booking" className="pl-4 pr-10" />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-zinc-300">
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter uppercase">NAME</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter uppercase">LOCATION</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter uppercase">PLAN</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter uppercase">BOOKINGS</th>
              <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter uppercase">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-300">
            {homeowners.length > 0 ? homeowners.map((user: any) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/homeowners/${user.id}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-zinc-600/10 rounded-full flex items-center justify-center text-neutral-700 font-medium text-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || 'A'
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-800 text-sm font-medium font-inter group-hover:text-blue-700 transition-colors">
                        {user.name || 'Unnamed User'}
                      </span>
                      <span className="text-zinc-500 text-xs font-normal font-inter">{user.email}</span>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {user.location || 'Lekki, Ajah'}
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
                      {user.plan || (Math.random() > 0.5 ? 'Premium' : 'Basic')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-600 text-sm font-medium font-inter">
                    {user.bookingsCount || '21'}
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
  )
}
