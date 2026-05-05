'use client'

import React from 'react'
import { 
  HiOutlineClock, 
  HiOutlineClipboardList,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineUpload
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { cn } from '@/lib/utils'
import { Transaction } from '../types'

interface TransactionItemProps {
  transaction: any
}

const typeConfig = {
  'Booking': {
    icon: HiWrenchScrewdriver,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    tagBg: 'bg-red-50',
    tagText: 'text-red-600',
    label: 'Booking'
  },
  'Top-up': {
    icon: HiOutlineDownload,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    tagBg: 'bg-blue-50',
    tagText: 'text-blue-700',
    label: 'Top-up'
  },
  'Refund': {
    icon: HiOutlineRefresh,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    tagBg: 'bg-emerald-50',
    tagText: 'text-emerald-500',
    label: 'Refund'
  },
  'Withdrawal': {
    icon: HiOutlineUpload,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    tagBg: 'bg-violet-50',
    tagText: 'text-violet-600',
    label: 'Withdrawal'
  }
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const config = (typeConfig as any)[transaction.type] || typeConfig['Booking']
  const Icon = config.icon
  const isPositive = ['Top-up', 'Refund'].includes(transaction.type)

  return (
    <div className="w-full h-20 px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
      <div className={cn("w-10 h-10 rounded-xl flex justify-center items-center shrink-0", config.iconBg)}>
        <Icon className={cn("w-5 h-5", config.iconColor)} />
      </div>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <h4 className="text-neutral-700 text-sm font-medium leading-5 truncate">
          {transaction.description}
          {transaction.professionalName && ` — ${transaction.professionalName}`}
        </h4>
        <div className="flex items-center gap-4 text-zinc-500 text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <HiOutlineClock className="w-4 h-4" />
            <span>{transaction.date} · {transaction.time}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <HiOutlineClipboardList className="w-4 h-4 shrink-0" />
            <span className="truncate">{transaction.referenceId}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={cn(
          "text-sm font-bold leading-5",
          isPositive ? "text-green-700" : "text-neutral-700"
        )}>
          {isPositive ? '+' : '-'}₦{transaction.amount.toLocaleString()}
        </span>
        <div className={cn("px-2 py-0.5 rounded text-[9px] font-semibold", config.tagBg, config.tagText)}>
          {config.label}
        </div>
      </div>
    </div>
  )
}
