'use client'

import React from 'react'
import { HiOutlineChatAlt2 } from 'react-icons/hi'

export const ChatEmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-96 flex flex-col items-center gap-8">
        {/* Icon Container */}
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center shadow-inner">
          <div className="w-14 h-14 relative flex items-center justify-center text-zinc-400">
            <HiOutlineChatAlt2 className="w-14 h-14 stroke-[1.5px]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h3 className="text-neutral-700 text-3xl font-bold font-['Plus_Jakarta_Sans'] leading-9">
            Your inbox is empty
          </h3>
          <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6 max-w-sm mx-auto">
            Once you book a service, your conversations with verified professionals will show up here.
          </p>
        </div>
      </div>
    </div>
  )
}
