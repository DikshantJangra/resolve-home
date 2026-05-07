'use client'

import React from 'react'
import { WalletBalanceCard } from '@/features/wallet/components/wallet-balance-card'
import { WalletStatCard } from '@/features/wallet/components/wallet-stat-card'
import { BankDetailsSection } from '@/features/wallet/components/bank-details-section'
import { TransactionHistory } from '@/features/wallet/components/transaction-history'
import { useAuthSession, useUserBookings } from '@/hooks/api-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export default function WalletPage() {
  const { data: session, isLoading: sessionLoading } = useAuthSession()
  const { data: bookings, isLoading: bookingsLoading } = useUserBookings()

  if (sessionLoading || bookingsLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-pulse">
        <div className="h-20 bg-zinc-100 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 h-[500px] bg-zinc-50 rounded-2xl" />
          <div className="lg:col-span-7 h-[500px] bg-zinc-50 rounded-2xl" />
        </div>
      </div>
    )
  }

  const user = session?.user
  const isWorker = (user as any)?.role?.toLowerCase() === 'worker' || (user as any)?.role?.toLowerCase() === 'engineer'

  const completedBookings = bookings?.filter((b: any) => b.status === 'COMPLETED') || []
  const totalFinancials = completedBookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0)

  const transactions = bookings?.map((b: any) => ({
    id: b.id,
    referenceId: `REF-${b.id.slice(-8).toUpperCase()}`,
    type: b.status === 'CANCELLED' ? 'Refund' : 'Booking',
    amount: b.totalPrice || 0,
    date: b.createdAt ? format(new Date(b.createdAt), 'MMM d, yyyy') : 'Today',
    time: b.createdAt ? format(new Date(b.createdAt), 'p') : '',
    description: b.service?.name || 'Home Service',
    professionalName: isWorker ? b.user?.name : b.engineer?.user?.name
  })) || []

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">My Wallet</h1>
        <p className="text-zinc-500 text-base font-normal leading-6">
          Manage your funds, view transaction history, and fund your escrow safely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Balance and Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <WalletBalanceCard 
            balance={isWorker ? totalFinancials : 50000} // Mock balance for users for now
            email={user?.email || ''} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WalletStatCard 
              label="Total withdrawal" 
              amount={0} 
              type="withdrawal" 
            />
            <WalletStatCard 
              label={isWorker ? "Total earned" : "Total spent"} 
              amount={totalFinancials} 
              type={isWorker ? "earned" : "withdrawal"} 
            />
          </div>

          <BankDetailsSection />
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-7 flex flex-col">
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
