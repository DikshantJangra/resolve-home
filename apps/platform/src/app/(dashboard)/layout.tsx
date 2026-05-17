'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { cn } from "@resolve/ui"
import { BookingWizardModal } from '@/features/booking/components/booking-wizard-modal'
import { useUserProfile, useEngineerLocationTracker } from '@/hooks/api-hooks'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: user, isPending } = useUserProfile()
  const isEngineer = user?.user?.role === 'worker'
  useEngineerLocationTracker(isEngineer)
  const router = useRouter()

  useEffect(() => {
    if (!isPending && user?.user && !user.user.emailVerified) {
      router.push('/auth/verify-email')
    }
  }, [user, isPending, router])

  if (isPending) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-200 p-6 gap-6 animate-pulse shrink-0">
          <div className="h-10 w-36 bg-zinc-200 rounded-lg" />
          <div className="space-y-5 py-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-zinc-200 rounded" />
                <div className="h-4 w-28 bg-zinc-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Area Skeleton */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Navbar Skeleton */}
          <div className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 shrink-0 animate-pulse">
            <div className="h-6 w-32 bg-zinc-200 rounded" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-zinc-200 rounded-full" />
              <div className="h-4 w-20 bg-zinc-200 rounded" />
            </div>
          </div>
          {/* Main Viewport Skeleton */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 animate-pulse">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-zinc-200 rounded" />
              <div className="h-4 w-64 bg-zinc-200 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white border border-zinc-200 rounded-xl" />)}
            </div>
            <div className="h-96 bg-white border border-zinc-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, shown as drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[100] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-[100] lg:pointer-events-auto",
        isSidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <BookingWizardModal />
    </div>
  )
}
