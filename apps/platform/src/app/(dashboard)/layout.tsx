'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { cn } from "@resolve/ui"
import { BookingWizardModal } from '@/features/booking/components/booking-wizard-modal'
import { useUserProfile } from '@/hooks/api-hooks'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: user, isPending } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && user?.user && !user.user.emailVerified) {
      router.push('/auth/verify-email')
    }
  }, [user, isPending, router])

  if (isPending) return null // Or a loading spinner

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
