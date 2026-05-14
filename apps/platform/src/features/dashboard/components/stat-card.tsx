'use client'

import React from 'react'
import { HiOutlineArrowUp, HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { cn } from "@resolve/ui"

interface StatCardProps {
  label: string
  value: string | number
  change: string
  icon: React.ElementType
}

export const StatCard = ({ label, value, change, icon: Icon }: StatCardProps) => {
  return (
    <div className="flex-1 p-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 bg-white inline-flex flex-col justify-start items-start shadow-sm">
      <div className="self-stretch inline-flex justify-between items-start">
        <div className="inline-flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="justify-center text-neutral-700 text-sm font-normal font-['Inter'] leading-5">{label}</div>
            <div className="justify-center text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">{value}</div>
          </div>
          <div className="h-5 inline-flex justify-start items-center gap-1">
            <div className="w-5 h-5 flex items-center justify-center text-green-400">
              <HiOutlineArrowUp className="w-4 h-4" />
            </div>
            <div className="justify-center text-green-700 text-xs font-medium font-['Inter'] leading-4">{change}</div>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl flex justify-center items-center bg-slate-50 shrink-0">
          <Icon className="w-6 h-6 text-zinc-600" />
        </div>
      </div>
    </div>
  )
}
