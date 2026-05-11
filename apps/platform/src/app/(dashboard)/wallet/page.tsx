'use client'

import React from 'react'
import { WalletBalanceCard } from '@/features/wallet/components/wallet-balance-card'
import { WalletStatCard } from '@/features/wallet/components/wallet-stat-card'
import { BankDetailsSection } from '@/features/wallet/components/bank-details-section'
import { TransactionHistory } from '@/features/wallet/components/transaction-history'
import { useAuthSession, useWallet, useWalletStatistics, useWalletTransactions } from '@/hooks/api-hooks'
import { Skeleton } from "@resolve/ui"
import { format } from 'date-fns'
import { FundWalletModal } from '@/features/wallet/components/fund-wallet-modal'
import { AddBankModal } from '@/features/wallet/components/add-bank-modal'
import { WithdrawModal } from '@/features/wallet/components/withdraw-modal'

export default function WalletPage() {
  const [isFundingModalOpen, setIsFundingModalOpen] = React.useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = React.useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false)
  
  const { data: session, isLoading: sessionLoading } = useAuthSession()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: stats, isLoading: statsLoading } = useWalletStatistics()
  const { data: transactions, isLoading: transactionsLoading } = useWalletTransactions()

  const isLoading = sessionLoading || walletLoading || statsLoading || transactionsLoading

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-pulse p-6">
        <div className="h-10 w-48 bg-zinc-100 rounded-lg" />
        <div className="h-4 w-96 bg-zinc-50 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-7">
            <Skeleton className="h-[600px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  const user = session?.user
  const isWorker = user?.role?.toLowerCase() === 'worker' || user?.role?.toLowerCase() === 'engineer'

  // Map API transactions to UI format
  const mappedTransactions = transactions?.map((t: any) => {
    let type: 'Top-up' | 'Refund' | 'Booking' | 'Withdrawal' = 'Booking'
    if (t.type === 'deposit') type = 'Top-up'
    else if (t.type === 'refund') type = 'Refund'
    else if (t.type === 'withdrawal') type = 'Withdrawal'
    else if (t.type === 'escrow_hold' || t.type === 'payment') type = 'Booking'

    return {
      id: t.id,
      referenceId: t.reference || `REF-${t.id.slice(-8).toUpperCase()}`,
      type,
      amount: t.amount || 0,
      date: t.createdAt ? format(new Date(t.createdAt), 'MMM d, yyyy') : 'Today',
      time: t.createdAt ? format(new Date(t.createdAt), 'p') : '',
      description: t.description || (type === 'Top-up' ? 'Wallet Top-up' : 'Service Payment'),
      status: t.status
    }
  }) || []

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">My Wallet</h1>
        <p className="text-zinc-500 text-sm md:text-base font-normal leading-6">
          Manage your funds, view transaction history, and fund your escrow safely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Balance and Stats */}
        <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6">
          <WalletBalanceCard 
            balance={wallet?.balance || 0} 
            email={user?.email || ''} 
            isWorker={isWorker}
            onAction={() => isWorker ? setIsWithdrawModalOpen(true) : setIsFundingModalOpen(true)}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WalletStatCard 
              label="Total withdrawal" 
              amount={wallet?.totalWithdrawals || 0} 
              type="withdrawal" 
            />
            <WalletStatCard 
              label={isWorker ? "Total earned" : "Total spent"} 
              amount={isWorker ? (wallet?.totalDeposits || 0) : (wallet?.totalSpent || 0)} 
              type={isWorker ? "earned" : "withdrawal"} 
            />
          </div>

          <BankDetailsSection onAdd={() => setIsBankModalOpen(true)} />
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-7 flex flex-col">
          <TransactionHistory transactions={mappedTransactions} />
        </div>
      </div>

      {isFundingModalOpen && (
        <FundWalletModal onClose={() => setIsFundingModalOpen(false)} />
      )}
      
      {isBankModalOpen && (
        <AddBankModal onClose={() => setIsBankModalOpen(false)} />
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal 
          onClose={() => setIsWithdrawModalOpen(false)} 
          availableBalance={wallet?.balance || 0}
        />
      )}
    </div>
  )
}
