'use client'

import React from 'react'
import { WalletBalanceCard } from '@/features/wallet/components/wallet-balance-card'
import { WalletStatCard } from '@/features/wallet/components/wallet-stat-card'
import { BankDetailsSection } from '@/features/wallet/components/bank-details-section'
import { TransactionHistory } from '@/features/wallet/components/transaction-history'
import { Transaction } from '@/features/wallet/types'

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    referenceId: 'RH-7842-019',
    type: 'Booking',
    amount: 45000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Plumbing',
    professionalName: 'James Adewale'
  },
  {
    id: '2',
    referenceId: 'RH-7842-020',
    type: 'Top-up',
    amount: 100000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Wallet top-up'
  },
  {
    id: '3',
    referenceId: 'RH-7842-021',
    type: 'Booking',
    amount: 60000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Electrical',
    professionalName: 'Amaka Okonkwo'
  },
  {
    id: '4',
    referenceId: 'RH-7842-022',
    type: 'Refund',
    amount: 40000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Refund — cancelled booking'
  },
  {
    id: '5',
    referenceId: 'RH-7842-023',
    type: 'Booking',
    amount: 55000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Heating',
    professionalName: 'Chidi Bello'
  },
  {
    id: '6',
    referenceId: 'RH-7842-024',
    type: 'Withdrawal',
    amount: 80000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Withdrawal to bank'
  },
  {
    id: '7',
    referenceId: 'RH-7842-025',
    type: 'Top-up',
    amount: 200000,
    date: 'Today',
    time: '1:42 PM',
    description: 'Wallet top-up'
  }
]

export default function WalletPage() {
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
            balance={234000} 
            email="adaeze@email.com" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WalletStatCard 
              label="Total withdrawal" 
              amount={231385} 
              type="withdrawal" 
            />
            <WalletStatCard 
              label="Total earned" 
              amount={124300} 
              type="earned" 
            />
          </div>

          <BankDetailsSection />
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-7 flex flex-col">
          <TransactionHistory transactions={MOCK_TRANSACTIONS} />
        </div>
      </div>
    </div>
  )
}
