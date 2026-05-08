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
    <div className="w-48 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm flex flex-col justify-start items-start gap-3">
      <button
        onClick={onMakeQuotation}
        className="self-stretch py-2 inline-flex justify-start items-center gap-2.5 hover:bg-zinc-50 transition-colors rounded-md px-1 group"
      >
        <div className="w-5 h-5 flex items-center justify-center text-blue-700">
          <HiOutlineDocumentText className="w-5 h-5" />
        </div>
        <div className="justify-start text-blue-700 text-sm font-medium font-['Inter'] leading-5">Make Quotation</div>
      </button>
      
      <button
        onClick={onFlagMessage}
        className="self-stretch py-2 inline-flex justify-start items-center gap-2.5 hover:bg-zinc-50 transition-colors rounded-md px-1 group"
      >
        <div className="w-5 h-5 flex items-center justify-center text-rose-400">
          <HiOutlineFlag className="w-5 h-5" />
        </div>
        <div className="justify-start text-rose-400 text-sm font-medium font-['Inter'] leading-5">Flag Message</div>
      </button>
    </div>
  )
}
