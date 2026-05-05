'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-20 h-20 relative animate-spin duration-[3000ms]", className)}>
      {/* Top Dot */}
      <div className="w-3.5 h-3.5 left-[33.33px] top-[16.67px] absolute bg-indigo-200 rounded-full animate-pulse" />
      {/* Bottom Dot */}
      <div className="w-3.5 h-3.5 left-[33.33px] top-[50px] absolute bg-indigo-200 rounded-full animate-pulse delay-700" />
      {/* Left Dot */}
      <div className="w-3.5 h-3.5 left-[16.67px] top-[33.33px] absolute bg-blue-700 rounded-full animate-pulse delay-300" />
      {/* Right Dot */}
      <div className="w-3.5 h-3.5 left-[50px] top-[33.33px] absolute bg-blue-700 rounded-full animate-pulse delay-500" />
      
      {/* Double layered dots as in the dump */}
      <div className="w-3.5 h-3.5 left-[33.33px] top-[16.67px] absolute bg-indigo-200 rounded-full opacity-50" />
      <div className="w-3.5 h-3.5 left-[33.33px] top-[50px] absolute bg-indigo-200 rounded-full opacity-50" />
    </div>
  )
}

export const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner />
        <p className="text-zinc-600 text-sm font-medium animate-pulse">Loading Resolve...</p>
      </div>
    </div>
  )
}
