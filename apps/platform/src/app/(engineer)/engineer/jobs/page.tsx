'use client'

import React from 'react'
import Link from 'next/link'
import { HiOutlineBriefcase, HiOutlineClock, HiOutlineLocationMarker, HiOutlineChevronRight } from 'react-icons/hi'
import { cn, Skeleton } from "@resolve/ui"
import { useEngineerBookings, useUserProfile, useAuthSession } from '@/hooks/api-hooks'
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'
import { createPortal } from 'react-dom'

export default function ActiveJobsPage() {
  const [mounted, setMounted] = React.useState(false)
  const { data: session, isPending: isSessionPending } = useAuthSession()
  const { data: userProfile, isPending: isProfilePending } = useUserProfile()

  const user = userProfile?.user || session?.user
  const isVerified = !!(
    (user as any)?.isVerified ||
    (user as any)?.status === 'verified' ||
    userProfile?.engineerProfile?.verificationStatus === 'approved' ||
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.approvedAt
  )
  const [isSetupOpen, setIsSetupOpen] = React.useState(true)
  const showVerificationOverlay = !isProfilePending && !isVerified && isSetupOpen

  const { data: bookings, isPending: isBookingsPending } = useEngineerBookings({
    enabled: !!isVerified,
    filter: 'requests',
    page: 1,
    limit: 20,
  })
  const isPending = isSessionPending || isProfilePending || (!!user && !showVerificationOverlay && isBookingsPending)

  React.useEffect(() => { setMounted(true) }, [])

  const activeJobs = (bookings || []).filter((b: any) => ['in-progress', 'confirmed'].includes(b.status))

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-48 bg-zinc-100 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className={cn(
        "flex flex-col gap-8 max-w-6xl mx-auto pb-10 transition-all duration-300",
        showVerificationOverlay && "blur-md pointer-events-none select-none opacity-50"
      )}>
        <div className="flex flex-col gap-2">
          <h1 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Active Jobs</h1>
          <p className="text-zinc-500 text-base leading-6">Jobs you have accepted and are currently managing.</p>
        </div>

        {activeJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <HiOutlineBriefcase className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-zinc-500 font-medium">No active jobs</p>
            <p className="text-zinc-400 text-sm mt-1">Accept a job from the Jobs Feed to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job: any) => (
              <ActiveJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {showVerificationOverlay && mounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-start justify-center sm:pt-10 sm:pb-20 overflow-y-auto bg-white/10 backdrop-blur-md">
          <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function ActiveJobCard({ job }: { job: any }) {
  const statusColor = job.status === 'in-progress' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'

  return (
    <Link href={`/engineer/jobs/${job.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white rounded-2xl border border-blue-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <HiOutlineBriefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-700 line-clamp-1">{job.service?.name || 'Home Service'}</h3>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">ID: {job.id.slice(-8)}</p>
            </div>
          </div>
          <span className={cn('px-2.5 py-1 rounded-md text-[10px] font-bold uppercase', statusColor)}>
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
            <span className="line-clamp-1">{job.customerDetails?.address || 'Address on file'}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-medium text-blue-700">
          <span>Manage Job</span>
          <HiOutlineChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
