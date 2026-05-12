'use client'

import React from 'react'
import { HiOutlineMoon } from 'react-icons/hi'
import { Button } from "@resolve/ui"
interface WalletBalanceCardProps {
  balance: number
  email: string
  isWorker?: boolean
  onAction?: () => void
}

export const WalletBalanceCard = ({ balance, email, isWorker, onAction }: WalletBalanceCardProps) => {
  return (
    <div className="w-full h-64 p-6 bg-blue-700 rounded-2xl flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Moon Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <HiOutlineMoon className="w-24 h-24 text-white rotate-12" />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <span className="text-neutral-50 text-base font-normal leading-6">Available Balance</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-neutral-50 text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-10">
            ₦{balance.toLocaleString()}
          </h2>
          <span className="text-neutral-50/80 text-xs font-normal leading-4">
            ResolvHome Wallet · {email}
          </span>
        </div>
      </div>

      <Button 
        onClick={onAction}
        className="w-full bg-slate-50 text-blue-700 hover:bg-slate-100 font-medium h-12 rounded-xl border-none shadow-none"
      >
        {isWorker ? 'Withdraw Funds' : 'Fund Wallet'}
      </Button>
    </div>
  )
}
