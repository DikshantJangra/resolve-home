'use client'

import React from 'react'
import { cn } from "../utils"

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("animate-spin text-blue-700 w-10 h-10 shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner className="w-12 h-12 text-blue-700" />
        <p className="text-zinc-600 text-sm font-medium animate-pulse">Loading Resolve...</p>
      </div>
    </div>
  )
}

