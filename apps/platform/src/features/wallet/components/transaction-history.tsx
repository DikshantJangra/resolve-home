'use client'

import React, { useState } from 'react'
import { TransactionItem } from './transaction-item'
import { Transaction, TransactionType } from '../types'
import { cn } from "@resolve/ui"

interface TransactionHistoryProps {
  transactions: any[]
}

const filters: { label: string; value: TransactionType | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Bookings', value: 'Booking' },
  { label: 'Top-ups', value: 'Top-up' },
  { label: 'Refunds', value: 'Refund' },
]

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [activeFilter, setActiveFilter] = useState<TransactionType | 'All'>('All')

  const filteredTransactions = transactions.filter(t => 
    activeFilter === 'All' || t.type === activeFilter
  )

  return (
    <div className="flex-1 bg-white rounded-2xl border border-zinc-200 flex flex-col overflow-hidden">
      {/* Header & Filters */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-200 flex flex-col gap-4">
        <h3 className="text-neutral-700 text-base font-semibold leading-6">Transaction History</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-6 h-8 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
                activeFilter === filter.value
                  ? "bg-blue-700 border-blue-700 text-white"
                  : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-zinc-50 overflow-y-auto max-h-[600px] no-scrollbar">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-2">
            <span className="text-sm">No transactions found</span>
          </div>
        )}
      </div>
    </div>
  )
}
