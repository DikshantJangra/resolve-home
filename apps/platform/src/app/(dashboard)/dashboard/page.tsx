'use client'

import React from 'react'
import { HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { StatCard } from '@/features/dashboard/components/stat-card'
import { RecentRequests } from '@/features/dashboard/components/recent-requests'
import { BookingRequestCard } from '@/features/dashboard/components/booking-request-card'
import { useAuthSession, useUserProfile, useUserBookings, useEngineerDashboard } from '@/hooks/api-hooks'
import { cn, FileUpload, Skeleton } from "@resolve/ui"
import { useProfessionalSetupStore } from '@/store/professional-setup-store'
import Link from 'next/link'
import { VerificationRequired } from '@/features/professional-setup/components/verification-required'
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'
import { createPortal } from 'react-dom'

function EngineerRecentRequests({ requests }: { requests: any[] }) {
  if (!requests.length) {
    return (
      <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-4 border border-zinc-200">
        <h3 className="text-slate-900 text-sm font-semibold">Recent Requests</h3>
        <p className="text-zinc-400 text-sm">No recent booking requests yet.</p>
      </div>
    )
  }
  return (
    <div className="w-full p-5 bg-stone-50 rounded-xl flex flex-col gap-4 border border-zinc-200">
      <h3 className="text-slate-900 text-sm font-semibold">Recent Requests</h3>
      <div className="flex flex-wrap gap-5">
        {requests.map((request: any) => (
          <BookingRequestCard key={request.id} booking={request} isWorker={true} />
        ))}
      </div>
    </div>
  )
}

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

  const { data: bookings, isPending: bookingsPending } = useUserBookings({ enabled: !showVerificationOverlay && !isEngineer })
  const { data: engineerDashboard, isPending: engineerDashPending } = useEngineerDashboard(isEngineer && isVerified)
  const [isUploaderOpen, setIsUploaderOpen] = React.useState(false)
  const [isSetupOpen, setIsSetupOpen] = React.useState(false)
  const isPendingVerification = userProfile?.engineerProfile?.verificationStatus === 'pending'
  const updateField = useProfessionalSetupStore((state) => state.updateField)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (showVerificationOverlay && !isSetupOpen) {
      document.body.style.overflow = 'unset'
    } else if (showVerificationOverlay && isSetupOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showVerificationOverlay, isSetupOpen])

  const avgRating = isEngineer ? "4.8" : "5.0"

  // Derive some stats from bookings
  const completedBookings = bookings?.filter((b: any) => b.status?.toUpperCase() === 'COMPLETED') || []
  const completedCount = completedBookings.length
  const totalSpentOrEarned = completedBookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0) || 0
  const activeBookings = bookings?.filter((b: any) => ['pending', 'confirmed', 'in-progress'].includes(b.status.toLowerCase())) || []

  const status = (user as any)?.status

  if (sessionPending || profilePending || (!!user && bookingsPending && !showVerificationOverlay && !isEngineer) || (isEngineer && isVerified && engineerDashPending)) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white border border-zinc-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (showVerificationOverlay) {
    if (isPendingVerification) {
      return (
        <div className="flex items-start justify-center pt-10 pb-20 max-w-2xl mx-auto">
          <ProfessionalSetupWizard onComplete={() => {}} />
        </div>
      )
    }

    return (
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <VerificationRequired onVerify={() => setIsSetupOpen(true)} />
        
        {isSetupOpen && mounted && createPortal(
          <div className="fixed inset-0 z-[1000] flex items-start justify-center sm:pt-10 sm:pb-20 overflow-y-auto bg-white/10 backdrop-blur-md">
            <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} isModal={true} />
            </div>
          </div>,
          document.body
        )}
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

        {/* Stats Grid - engineers only */}
        {isEngineer && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <StatCard
              label="Completed Jobs"
              value={engineerDashboard?.stats?.completedJobs ?? 0}
              change={`${engineerDashboard?.stats?.activeRequests ?? 0} active`}
              icon={HiOutlineClipboardCheck}
            />
            <StatCard
              label="Active Requests"
              value={engineerDashboard?.stats?.activeRequests ?? 0}
              change="Pending"
              icon={HiOutlineChatAlt}
            />
            <StatCard
              label="Earnings"
              value={`₦${(engineerDashboard?.stats?.totalEarnings ?? 0).toLocaleString()}`}
              change="Total"
              icon={HiOutlineCurrencyDollar}
            />
            <StatCard
              label="Rating"
              value={engineerDashboard?.stats?.avgRating ?? 0}
              change={`${engineerDashboard?.stats?.totalReviews ?? 0} reviews`}
              icon={HiOutlineStar}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="w-full">
          {isEngineer ? (
            <EngineerRecentRequests requests={engineerDashboard?.recentRequests ?? []} />
          ) : (
            <RecentRequests />
          )}
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
