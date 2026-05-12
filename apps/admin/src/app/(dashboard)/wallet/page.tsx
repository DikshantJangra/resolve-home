'use client'

import React from 'react'
import { Card, Button, Skeleton } from "@resolve/ui"
import { HiOutlineTrendingUp, HiOutlineCreditCard, HiOutlineChartBar, HiOutlineDatabase, HiOutlineSearch } from 'react-icons/hi'
import { useAdminWalletStats, useAdminWalletTransactions, useUserProfile } from '@/hooks/api-hooks'
import { format } from 'date-fns'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

export default function WalletPage() {
  const { data: stats, isLoading: statsLoading } = useAdminWalletStats()
  const { data: transactions, isLoading: txLoading } = useAdminWalletTransactions()

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Wallet</h1>
          <p className="text-zinc-600 text-base font-normal font-inter leading-6">
            Manage financial distributions, earnings, and platform fees.
          </p>
        </div>
        {/* Onboard Pro button hidden as per design snippet opacity-0 */}
        <Button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl opacity-0">
          Onboard Pro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard 
          label="Total Earnings (YTD)" 
          value={(stats as any)?.totalDeposits || 142090000} 
          trend="+12.5%" 
          icon={<HiOutlineDatabase className="w-5 h-5 text-zinc-600" />}
          loading={statsLoading}
        />
        <StatCard 
          label="Escrow Balance" 
          value={(stats as any)?.balance || 12450200} 
          trend="+12.5%" 
          icon={<HiOutlineCreditCard className="w-5 h-5 text-zinc-600" />}
          loading={statsLoading}
        />
        <StatCard 
          label="Platform Revenue" 
          value={(stats as any)?.totalSpent || 1867530} 
          trend="+12.5%" 
          icon={<HiOutlineChartBar className="w-5 h-5 text-zinc-600" />}
          loading={statsLoading}
        />
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-zinc-300 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-stone-50 border-b border-zinc-300">
              <tr>
                <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">Date</th>
                <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">Professional</th>
                <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">STASTUS</th>
                <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">Reference</th>
                <th className="px-6 py-4 text-neutral-700 text-base font-semibold font-inter">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {txLoading ? (
                Array(7).fill(0).map((_, i) => <SkeletonRow key={i} />)
              ) : transactions && transactions.length > 0 ? (
                (transactions as any[]).map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-600 text-sm font-medium font-inter">
                      {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-zinc-600/10 flex items-center justify-center text-zinc-600 text-sm font-medium">
                          {tx.user?.name?.[0] || 'P'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-neutral-900 text-sm font-medium font-inter">{tx.user?.name || 'Professional Name'}</span>
                          <span className="text-zinc-400 text-xs font-normal font-inter">{tx.user?.email || 'email@example.com'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-6 py-4 text-zinc-600 text-sm font-medium font-inter">
                      {tx.reference || `PAY-${tx.id.slice(0, 4)}-${tx.id.slice(-2)}`}
                    </td>
                    <td className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter">
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                // Mock data as per design if no live data is returned
                <MockDataRows />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, icon, loading }: any) {
  return (
    <Card className="p-3 border-zinc-300 rounded-xl flex flex-col gap-3 shadow-none">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-1">
          <span className="text-neutral-700 text-sm font-normal font-inter leading-5">{label}</span>
          {loading ? (
            <Skeleton className="h-8 w-32 bg-zinc-100" />
          ) : (
            <span className="text-neutral-700 text-2xl font-bold font-plus-jakarta leading-8">
              {formatCurrency(value)}
            </span>
          )}
        </div>
        <div className="w-6 h-6 flex items-center justify-center rounded-xl">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 flex items-center justify-center">
          <HiOutlineTrendingUp className="w-4 h-4 text-green-400" />
        </div>
        <span className="text-green-700 text-xs font-medium font-inter leading-4">{trend}</span>
      </div>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    completed: "bg-green-700",
    success: "bg-green-700",
    Success: "bg-green-700",
    pending: "bg-amber-500",
    Pending: "bg-amber-500",
    failed: "bg-rose-400",
    Failed: "bg-rose-400",
    cancelled: "bg-zinc-400"
  }
  
  const textStyles: any = {
    completed: "text-green-700",
    success: "text-green-700",
    Success: "text-green-700",
    pending: "text-amber-500",
    Pending: "text-amber-500",
    failed: "text-rose-400",
    Failed: "text-rose-400",
    cancelled: "text-zinc-400"
  }

  const label: any = {
    completed: "Success",
    success: "Success",
    Success: "Success",
    pending: "Pending",
    Pending: "Pending",
    failed: "Failed",
    Failed: "Failed",
    cancelled: "Cancelled"
  }

  const normalizedStatus = status?.toLowerCase() || 'pending'
  const displayStatus = label[status] || label[normalizedStatus] || "Pending"
  const bulletColor = styles[status] || styles[normalizedStatus] || "bg-amber-500"
  const textColor = textStyles[status] || textStyles[normalizedStatus] || "text-amber-500"

  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${bulletColor}`} />
      <span className={`${textColor} text-sm font-medium font-inter leading-5`}>
        {displayStatus}
      </span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-zinc-100" /></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full bg-zinc-100" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-zinc-100" />
            <Skeleton className="h-3 w-24 bg-zinc-100" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-zinc-100" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-28 bg-zinc-100" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-zinc-100" /></td>
    </tr>
  )
}

function MockDataRows() {
  const mockData = [
    { date: 'Dec 15, 2024', name: 'Lionel Crona', email: 'lionel@email.com', status: 'Success', ref: 'PAY-8921-20', amount: 45200 },
    { date: 'Jan 02, 2025', name: 'Marianna Volkman', email: 'marianna@email.com', status: 'Pending', ref: 'PAY-8921-20', amount: 45200 },
    { date: 'Nov 28, 2024', name: 'Lionel Crona', email: 'lionel@email.com', status: 'Success', ref: 'PAY-8921-20', amount: 45200 },
    { date: 'Oct 18, 2024', name: 'Lionel Crona', email: 'lionel@email.com', status: 'Pending', ref: 'PAY-8921-20', amount: 45200 },
    { date: 'Feb 14, 2025', name: 'Keon Hammes', email: 'keon@email.com', status: 'Failed', ref: 'PAY-8921-20', amount: 45200 },
    { date: 'Oct 18, 2024', name: 'Lionel Crona', email: 'lionel@email.com', status: 'Pending', ref: 'PAY-8921-20', amount: 45200 },
    { date: 'Mar 22, 2025', name: 'Lionel Crona', email: 'lionel@email.com', status: 'Pending', ref: 'PAY-8921-20', amount: 45200 },
  ]

  return (
    <>
      {mockData.map((item, i) => (
        <tr key={i} className="hover:bg-zinc-50 transition-colors">
          <td className="px-6 py-4 text-zinc-600 text-sm font-medium font-inter leading-5">{item.date}</td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-600/10 flex items-center justify-center text-zinc-600 text-sm font-medium">
                {item.name[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-900 text-sm font-medium font-inter leading-5">{item.name}</span>
                <span className="text-zinc-400 text-xs font-normal font-inter leading-4">{item.email}</span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <StatusBadge status={item.status} />
          </td>
          <td className="px-6 py-4 text-zinc-600 text-sm font-medium font-inter leading-5">{item.ref}</td>
          <td className="px-6 py-4 text-neutral-700 text-sm font-semibold font-inter leading-5">{formatCurrency(item.amount)}</td>
        </tr>
      ))}
    </>
  )
}
