'use client'

import React from 'react'
import { HiOutlineArrowUp, HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change: string
  icon: React.ElementType
}

export const StatCard = ({ label, value, change, icon: Icon }: StatCardProps) => {
  return (
    <div className="w-full p-4 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 bg-white shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-neutral-700 text-sm font-normal font-['Inter'] leading-5">{label}</span>
            <h2 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">{value}</h2>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 flex items-center justify-center text-green-400">
              <HiOutlineArrowUp className="w-4 h-4" />
            </div>
            <span className="text-green-700 text-xs font-medium font-['Inter'] leading-4">{change}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl flex justify-center items-center bg-slate-50">
          <Icon className="w-6 h-6 text-zinc-600" />
        </div>
      </div>
    </div>
  )
}
