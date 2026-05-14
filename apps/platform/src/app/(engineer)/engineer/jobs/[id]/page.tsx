'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { 
  HiOutlineChevronLeft, 
  HiOutlineClock, 
  HiOutlineLocationMarker, 
  HiOutlineBriefcase,
  HiOutlineUser,
  HiOutlineChatAlt,
  HiOutlinePhone
} from 'react-icons/hi'
import { Button, Skeleton } from "@resolve/ui"
import { toast } from 'sonner'
import { useEngineerBookingDetail, useAcceptJob, useRejectJob, useCompleteJob, useUserProfile, useAuthSession } from '@/hooks/api-hooks'
import { cn } from "@resolve/ui"
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'
import { createPortal } from 'react-dom'

export default function JobDetailsPage() {
  const [mounted, setMounted] = React.useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useAuthSession()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const { data: userProfile, isPending: isProfilePending } = useUserProfile()

  const user = userProfile?.user || session?.user
  const isVerified = (user as any)?.isVerified || (user as any)?.status === 'verified'
  const status = (user as any)?.status

  const { data: job, isPending: isJobPending, error } = useEngineerBookingDetail(id as string, { enabled: !!isVerified })
  const { mutate: acceptJob, isPending: isAccepting } = useAcceptJob()
  const { mutate: rejectJob, isPending: isRejecting } = useRejectJob()
  const { mutate: completeJob, isPending: isCompleting } = useCompleteJob()

  const [isSetupOpen, setIsSetupOpen] = React.useState(false)
  const showVerificationOverlay = !isVerified
  const isPending = isSessionPending || isProfilePending || (!!user && !showVerificationOverlay && isJobPending)

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-pulse">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-zinc-500">Failed to load job details.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const isJobStatusPending = job.status === 'pending'
  const isActive = ['confirmed', 'in-progress'].includes(job.status)

  const handleAccept = () => {
    acceptJob(job.id, {
      onSuccess: () => {
        toast.success('Job accepted successfully!')
      },
    })
  }

  const handleReject = () => {
    if (confirm('Are you sure you want to decline this job request?')) {
      rejectJob(job.id, {
        onSuccess: () => {
          toast.success('Job declined')
          router.push('/engineer')
        },
      })
    }
  }

  const handleComplete = () => {
    if (confirm('Are you sure you want to mark this job as complete?')) {
      completeJob(job.id, {
        onSuccess: () => toast.success('Job marked as complete')
      })
    }
  }

  return (
    <div className="relative">
      {/* Main Content */}
      <div className={cn(
        "flex flex-col gap-6 max-w-4xl mx-auto pb-10 transition-all duration-300",
        showVerificationOverlay && "blur-md pointer-events-none select-none opacity-50"
      )}>
        {/* Breadcrumb */}
        <Link 
          href="/engineer" 
          className="inline-flex items-center gap-1 text-zinc-600 hover:text-blue-700 transition-colors w-fit group"
        >
          <HiOutlineChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Jobs</span>
        </Link>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <HiOutlineBriefcase className="w-7 h-7 text-blue-700" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-neutral-800">{job.service?.name || 'Home Service Request'}</h1>
                  <p className="text-sm text-zinc-500 font-medium tracking-wider uppercase mt-1">JOB ID: {job.id.slice(0, 8)}</p>
                </div>
              </div>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
                isJobStatusPending ? "bg-amber-50 text-amber-600" :
                isActive ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-600"
              )}>
                {job.status}
              </span>
            </div>

            <div className="prose prose-sm text-zinc-600 max-w-none">
              <h3 className="text-sm font-semibold text-neutral-800 mb-2">Issue Description</h3>
              <p>{job.notes || job.service?.description || 'No additional details provided by the customer.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-zinc-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                  <HiOutlineClock className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-0.5">Scheduled For</p>
                  <p className="text-sm font-semibold text-neutral-800">{job.scheduledDate} at {job.scheduledTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                  <HiOutlineLocationMarker className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-neutral-800">
                    {isActive ? job.customerDetails?.address : 'Address revealed after acceptance'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {isJobStatusPending && (
            <div className="p-6 bg-stone-50 border-t border-zinc-200 flex flex-col sm:flex-row gap-4 justify-end items-center">
              <p className="text-sm text-zinc-500 sm:mr-auto">Accept this job to view full customer details and send a quotation.</p>
              <Button 
                variant="outline" 
                onClick={handleReject}
                disabled={isRejecting || isAccepting}
                className="w-full sm:w-auto h-12 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                {isRejecting ? 'Declining...' : 'Decline Job'}
              </Button>
              <Button 
                onClick={handleAccept}
                disabled={isAccepting || isRejecting}
                className="w-full sm:w-auto h-12 bg-blue-700 hover:bg-blue-800 px-8"
              >
                {isAccepting ? 'Accepting...' : 'Accept Job'}
              </Button>
            </div>
          )}
        </div>

        {/* Customer Info (Only visible if active) */}
        {isActive && (
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm p-6 md:p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
              <h3 className="text-lg font-bold text-neutral-800">Customer Details</h3>
              {job.status === 'in-progress' && (
                <Button 
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isCompleting ? 'Completing...' : 'Mark as Complete'}
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <HiOutlineUser className="w-8 h-8 text-blue-700" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-neutral-800">{job.customerDetails?.name || 'Customer'}</h4>
                <p className="text-sm text-zinc-500">Member since 2024</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1 h-12 bg-blue-700 hover:bg-blue-800">
                <HiOutlineChatAlt className="w-5 h-5 mr-2" />
                Message Customer
              </Button>
              <Button variant="outline" className="flex-1 h-12 border-zinc-200 text-zinc-700">
                <HiOutlinePhone className="w-5 h-5 mr-2" />
                Call Customer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Overlay - Portal'd to body for clean stacking */}
      {showVerificationOverlay && mounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 pb-20 overflow-y-auto bg-white/10 backdrop-blur-md">
          <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {status === 'pending' ? (
              <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} initialStep={4} />
            ) : (
              <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
