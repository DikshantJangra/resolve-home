'use client'

import React from 'react'
import { HiOutlinePlus } from 'react-icons/hi'

interface BankDetailsSectionProps {
  onAdd: () => void
}

export const BankDetailsSection = ({ onAdd }: BankDetailsSectionProps) => {
  return (
    <div className="w-full bg-white rounded-[20px] flex flex-col gap-6 p-5 border border-zinc-100">
      <h3 className="text-slate-900 text-base font-medium leading-6">
        Bank account and payment information
      </h3>
      
      <button 
        onClick={onAdd}
        className="w-full h-28 border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center gap-3 group hover:border-blue-500 hover:bg-blue-50/30 transition-all"
      >
        <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <HiOutlinePlus className="w-5 h-5 text-zinc-500 group-hover:text-blue-600" />
        </div>
        <span className="text-zinc-500 text-base font-normal group-hover:text-blue-700 transition-colors">
          Add bank details
        </span>
      </button>
    </div>
  )
}
