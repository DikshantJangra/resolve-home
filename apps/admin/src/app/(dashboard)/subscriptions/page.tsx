'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineCreditCard, 
  HiOutlineUsers, 
  HiOutlineClock,
  HiOutlineTrendingUp
} from 'react-icons/hi'
import { cn, Button, Skeleton, Input } from "@resolve/ui"
import { useAdminSubscriptions } from '@/hooks/api-hooks'
import { format } from 'date-fns'

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminSubscriptions(page)

  const subscriptions = data?.subscriptions || data?.items || []
  const pagination = data?.pagination

  const stats = [
    { label: 'Active Subscriptions', value: data?.totalActive || subscriptions.filter((s: any) => s.status === 'active').length, icon: HiOutlineCreditCard },
    { label: 'Pending Renewals', value: data?.totalPending || subscriptions.filter((s: any) => s.status === 'pending').length, icon: HiOutlineClock },
    { label: 'Total Revenue', value: data?.totalRevenue ? `₦${data.totalRevenue.toLocaleString()}` : '₦0', icon: HiOutlineTrendingUp },
  ]

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-9 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Subscriptions</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage platform memberships, billing cycles, and plan distributions.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Input 
            placeholder="Search subscriptions" 
            className="w-full h-12 px-4 pr-12 rounded-xl"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        </div>
      </div>

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

      <div className="bg-white rounded-xl border border-zinc-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-zinc-300">
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Subscriber</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Plan</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Next Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {subscriptions.length > 0 ? subscriptions.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900">{sub.user?.name || 'User'}</span>
                      <span className="text-xs text-zinc-500">{sub.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 font-medium uppercase">{sub.planName || sub.planId}</td>
                  <td className="px-6 py-4 text-sm text-neutral-700 font-semibold">₦{(sub.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      sub.status === 'active' ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {sub.endDate ? format(new Date(sub.endDate), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm font-inter">
                    No subscriptions found.
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
