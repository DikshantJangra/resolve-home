'use client'

import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineBriefcase, HiOutlineChevronRight } from 'react-icons/hi'
import { cn, Skeleton } from "@resolve/ui"
import { useEngineerBookings, useUserProfile, useAuthSession } from '@/hooks/api-hooks'
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'
import { createPortal } from 'react-dom'

export default function EngineerDashboardPage() {
  const [mounted, setMounted] = React.useState(false)
  const { data: session, isPending: isSessionPending } = useAuthSession()
  const { data: userProfile, isPending: isProfilePending } = useUserProfile()
  
  const user = userProfile?.user || session?.user
  const isVerified = (user as any)?.isVerified || (user as any)?.status === 'verified'
  const status = (user as any)?.status

  const showVerificationOverlay = !isVerified
  const { data: bookings, isPending: isBookingsPending, error } = useEngineerBookings({ enabled: !!isVerified })
  const isPending = isSessionPending || isProfilePending || (!!user && !showVerificationOverlay && isBookingsPending)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-48 bg-zinc-100 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  // Handle errors (excluding 403 which is handled by verification check above)
  if (!showVerificationOverlay && error && (error as any)?.response?.status !== 403) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 text-center gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <HiOutlineBriefcase className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <p className="text-zinc-700 font-semibold">Failed to load jobs feed</p>
          <p className="text-sm text-zinc-500">There was an error fetching your jobs. Please try again later.</p>
        </div>
      </div>
    )
  }

  const activeJobs = bookings?.filter((b: any) => ['in-progress', 'confirmed'].includes(b.status)) || []
  const availableJobs = bookings?.filter((b: any) => b.status === 'pending') || []

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className={cn(
        "flex flex-col gap-8 max-w-6xl mx-auto pb-10 transition-all duration-300",
        showVerificationOverlay && "blur-md pointer-events-none select-none opacity-50"
      )}>
        <div className="flex flex-col gap-2">
          <h1 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Jobs Feed</h1>
          <p className="text-zinc-500 text-base font-normal leading-6">
            Discover new opportunities and manage your assigned jobs.
          </p>
        </div>

        {activeJobs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Active Jobs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map((job: any) => (
                <JobCard key={job.id} job={job} isActive />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-700">Available Requests</h2>
          {availableJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-zinc-200">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <HiOutlineBriefcase className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-zinc-500 font-medium">No new job requests</p>
              <p className="text-zinc-400 text-sm mt-1">Check back later for new opportunities in your area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableJobs.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verification Overlay - Portal'd to body for clean stacking */}
      {showVerificationOverlay && mounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 pb-20 overflow-y-auto bg-white/10 backdrop-blur-md">
          <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {status === 'pending' ? (
              <ProfessionalSetupWizard onComplete={() => {}} initialStep={4} />
            ) : (
              <ProfessionalSetupWizard onComplete={() => {}} />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function JobCard({ job, isActive = false }: { job: any, isActive?: boolean }) {
  return (
    <Link href={`/engineer/jobs/${job.id}`} className="group block h-full">
      <div className={cn(
        "flex flex-col h-full bg-white rounded-2xl border transition-all duration-300 p-5",
        isActive 
          ? "border-blue-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]" 
          : "border-zinc-200 hover:border-blue-300 hover:shadow-md"
      )}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isActive ? "bg-blue-50 text-blue-700" : "bg-zinc-50 text-zinc-600"
            )}>
              <HiOutlineBriefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 line-clamp-1">{job.service?.name || 'Home Service'}</h3>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">ID: {job.id.slice(-8)}</p>
            </div>
          </div>
          <span className={cn(
            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase",
            isActive ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-600"
          )}>
            {job.status}
          </span>
        </div>

        <p className="text-sm text-zinc-600 line-clamp-2 mb-4 flex-grow">
          {job.notes || job.service?.description || 'No additional details provided.'}
        </p>

        <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100 mt-auto">
          <div className="flex items-center text-xs text-zinc-500 gap-2">
            <HiOutlineClock className="w-4 h-4 text-zinc-400" />
            <span>{job.scheduledDate} at {job.scheduledTime}</span>
          </div>
          <div className="flex items-center text-xs text-zinc-500 gap-2">
            <HiOutlineLocationMarker className="w-4 h-4 text-zinc-400" />
            <span className="line-clamp-1">{job.customerDetails?.address || 'Address hidden until accepted'}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-medium">
          <span className={cn(
            "transition-colors",
            isActive ? "text-blue-700" : "text-zinc-600 group-hover:text-blue-700"
          )}>
            {isActive ? 'Manage Job' : 'View Details'}
          </span>
          <HiOutlineChevronRight className={cn(
            "w-5 h-5 transition-transform group-hover:translate-x-1",
            isActive ? "text-blue-700" : "text-zinc-400 group-hover:text-blue-700"
          )} />
        </div>
      </div>
    </Link>
  )
}
