'use client'

import React from 'react'
import { HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { StatCard } from '@/features/dashboard/components/stat-card'
import { RecentRequests } from '@/features/dashboard/components/recent-requests'
import { useAuthSession, useUserProfile, useUserBookings } from '@/hooks/api-hooks'
import { cn, FileUpload } from "@resolve/ui"
import { createPortal } from 'react-dom'
import { useProfessionalSetupStore } from '@/store/professional-setup-store'

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false)
  const { data: session, isPending: sessionPending } = useAuthSession()
  const { data: userProfile, isPending: profilePending } = useUserProfile()

  const user = userProfile?.user || session?.user
  const isEngineer = user?.role === 'worker'
  const isVerified = !!(
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.verificationStatus === 'approved' ||
    userProfile?.engineerProfile?.approvedAt
  )
  const showVerificationOverlay = isEngineer && !isVerified

  const { data: bookings, isPending: bookingsPending } = useUserBookings({ enabled: !showVerificationOverlay })
  const [isUploaderOpen, setIsUploaderOpen] = React.useState(false)
  const updateField = useProfessionalSetupStore((state) => state.updateField)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (user) {
      console.log('Dashboard Debug - User:', user);
      console.log('Dashboard Debug - Is Engineer:', isEngineer);
      console.log('Dashboard Debug - Is Verified:', isVerified);
    }
  }, [user, isEngineer, isVerified]);

  React.useEffect(() => {
    if (showVerificationOverlay) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showVerificationOverlay])

  const avgRating = isEngineer ? "4.8" : "5.0"

  // Derive some stats from bookings
  const completedBookings = bookings?.filter((b: any) => b.status?.toUpperCase() === 'COMPLETED') || []
  const completedCount = completedBookings.length
  const totalSpentOrEarned = completedBookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0) || 0
  const activeBookings = bookings?.filter((b: any) => ['pending', 'confirmed', 'in-progress'].includes(b.status.toLowerCase())) || []

  const status = (user as any)?.status

  if (sessionPending || profilePending || (!!user && bookingsPending && !showVerificationOverlay)) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white border border-zinc-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="transition-all duration-300">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Total Bookings"
            value={bookings?.length || 0}
            change="+12%"
            icon={HiOutlineClipboardCheck}
          />
          <StatCard
            label="Messages"
            value="4"
            change="New"
            icon={HiOutlineChatAlt}
          />
          <StatCard
            label="Earnings"
            value="₦0.00"
            change="+0%"
            icon={HiOutlineCurrencyDollar}
          />
          <StatCard
            label="Rating"
            value="4.8"
            change="Top"
            icon={HiOutlineStar}
          />
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          <RecentRequests />
        </div>
      </div>

      {/* Global Uploader for this page */}
      <FileUpload
        isOpen={isUploaderOpen && showVerificationOverlay}
        onRequestClose={() => setIsUploaderOpen(false)}
        onSuccess={(files) => {
          const url = files[0].response.body.data.file.url
          updateField('idPhoto', url)
          setIsUploaderOpen(false)
        }}
        uploadType="image"
      />
    </div>
  )
}
