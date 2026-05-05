'use client'

import React from 'react'
import { HiOutlineArrowUpRight, HiOutlineArrowDownLeft } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

interface WalletStatCardProps {
  label: string
  amount: number
  type: 'withdrawal' | 'earned'
}

export const WalletStatCard = ({ label, amount, type }: WalletStatCardProps) => {
  const isWithdrawal = type === 'withdrawal'

  return (
    <div className="flex-1 min-w-[200px] p-5 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          isWithdrawal ? "bg-red-50" : "bg-emerald-50"
        )}>
          {isWithdrawal ? (
            <HiOutlineArrowUpRight className="w-4 h-4 text-red-600" />
          ) : (
            <HiOutlineArrowDownLeft className="w-4 h-4 text-emerald-500" />
          )}
        </div>
        <span className="text-zinc-500 text-xs font-normal leading-4">{label}</span>
      </div>
      <h3 className="text-slate-900 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-8">
        ₦{amount.toLocaleString()}
      </h3>
    </div>
  )
}
