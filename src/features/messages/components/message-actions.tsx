'use client'

import React from 'react'
import { HiOutlineDocumentText, HiOutlineFlag } from 'react-icons/hi'
import { cn } from '@/lib/utils'

export const MessageActions = ({ 
  onMakeQuotation, 
  onFlagMessage 
}: { 
  onMakeQuotation: () => void; 
  onFlagMessage: () => void 
}) => {
  return (
    <div className="w-48 p-3 bg-white rounded-xl shadow-xl border border-zinc-100 flex flex-col gap-1">
      <button
        onClick={onMakeQuotation}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group text-left"
      >
        <div className="w-5 h-5 flex items-center justify-center text-blue-700">
          <HiOutlineDocumentText className="w-5 h-5" />
        </div>
        <span className="text-blue-700 text-sm font-medium">Make Quotation</span>
      </button>
      
      <button
        onClick={onFlagMessage}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 transition-colors group text-left"
      >
        <div className="w-5 h-5 flex items-center justify-center text-rose-400">
          <HiOutlineFlag className="w-5 h-5" />
        </div>
        <span className="text-rose-400 text-sm font-medium">Flag Message</span>
      </button>
    </div>
  )
}
