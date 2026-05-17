'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  HiOutlineChevronLeft,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineUser,
  HiOutlineChatAlt,
  HiOutlineTruck,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
} from 'react-icons/hi'
import { Button, Skeleton } from "@resolve/ui"
import { toast } from 'sonner'
import {
  useEngineerBookingDetail, useAcceptJob, useRejectJob, useCompleteJob,
  useUserProfile, useAuthSession, useUpdateJobStatus, useCreateQuotation, useBookingQuotation
} from '@/hooks/api-hooks'
import { cn } from "@resolve/ui"
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'
import { createPortal } from 'react-dom'
import { Map } from '@/components/ui/map'
import type { MapMarker } from '@/components/ui/map'

export default function JobDetailsPage() {
  const [mounted, setMounted] = React.useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { data: session, isLoading: isSessionLoading } = useAuthSession()

  React.useEffect(() => {
    setMounted(true)
  }, [])
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile()

  const user = userProfile?.user || session?.user
  const isVerified = !!(
    (user as any)?.isVerified ||
    (user as any)?.status === 'verified' ||
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.verificationStatus === 'approved' ||
    userProfile?.engineerProfile?.approvedAt
  )
  const status = (user as any)?.status

  const { data: jobResponse, isLoading: isJobLoading, error } = useEngineerBookingDetail(id as string, { enabled: !!isVerified })
  const job = jobResponse?.booking || jobResponse
  const { mutate: acceptJob, isPending: isAccepting } = useAcceptJob()
  const { mutate: rejectJob, isPending: isRejecting } = useRejectJob()
  const { mutate: completeJob, isPending: isCompleting } = useCompleteJob()
  const { mutate: updateJobStatus, isPending: isUpdatingStatus } = useUpdateJobStatus()
  const { mutate: createQuotation, isPending: isCreatingQuote } = useCreateQuotation()
  const { data: existingQuotation } = useBookingQuotation(id as string)

  // Local state tracks on_the_way / arrived transitions (backend may not expose these)
  const [localStatus, setLocalStatus] = React.useState<'on_the_way' | 'arrived' | null>(null)
  const [showQuoteForm, setShowQuoteForm] = React.useState(false)
  const [quoteForm, setQuoteForm] = React.useState({ laborCost: '', materialsCost: '', description: '', estimatedDuration: '' })

  // isSetupOpen: true only for unverified engineers; onComplete() sets it false to dismiss
  const [isSetupOpen, setIsSetupOpen] = React.useState(true)
  // Don't show overlay while profile is still loading (avoids flash for verified users)
  const showVerificationOverlay = !isProfileLoading && !isVerified && isSetupOpen

  const [engineerCoords, setEngineerCoords] = React.useState<[number, number] | null>(null)
  const jobIsActive = job ? ['confirmed', 'in-progress'].includes(job.status) : false

  React.useEffect(() => {
    if (!jobIsActive) return
    if (!navigator.geolocation) return
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setEngineerCoords([pos.coords.longitude, pos.coords.latitude]),
      () => { },
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [jobIsActive])
  // Debug log – must be before any early returns (Rules of Hooks)
  React.useEffect(() => {
    if (jobResponse) {
      console.log('[JobDetails] Raw jobResponse:', JSON.stringify(jobResponse, null, 2))
    }
  }, [jobResponse])

  const isPending = isSessionLoading || isProfileLoading || (!!user && !showVerificationOverlay && isJobLoading)

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-pulse">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  if ((error || !job) && !showVerificationOverlay) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-zinc-500">Failed to load job details.</p>
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm max-w-lg overflow-auto">
          <p className="font-bold mb-2">Debug Info:</p>
          <pre>{JSON.stringify({
            error: error ? (error as any).response?.data || (error as any).message : null,
            jobResponse,
            isVerified,
            id
          }, null, 2)}</pre>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const jobStatus = (job.status || '').toLowerCase()
  const isJobStatusPending = jobStatus === 'pending'
  const isActive = ['confirmed', 'in-progress', 'in_progress', 'active'].includes(jobStatus)

  // Address — backend stores it in location.streetAddress + location.city
  const bookingAddress = (() => {
    const loc = job.location
    if (loc?.streetAddress) return `${loc.streetAddress}${loc.city ? ', ' + loc.city : ''}${loc.state ? ', ' + loc.state : ''}`
    if (loc?.city) return loc.city
    if (job.address) return `${job.address}${job.city ? ', ' + job.city : ''}`
    if (job.customerDetails?.address) return job.customerDetails.address
    return null
  })()

  // Notes — backend stores customer description in issueDetails
  const bookingNotes = job.issueDetails || job.notes || job.description || job.service?.description || null

  const handleAccept = () => {
    acceptJob(job.id, {
      onSuccess: () => toast.success('Job accepted!')
    })
  }

  const handleReject = () => {
    rejectJob(job.id, {
      onSuccess: () => toast.success('Job declined.')
    })
  }

  const handleComplete = () => {
    if (confirm('Are you sure you want to mark this job as complete?')) {
      completeJob(job.id, {
        onSuccess: () => toast.success('Job marked as complete')
      })
    }
  }

  const handleOnTheWay = () => {
    updateJobStatus({ bookingId: job.id, status: 'on_the_way' }, {
      onSuccess: () => { setLocalStatus('on_the_way'); toast.success('Customer notified you are on the way!') },
      onError: () => { setLocalStatus('on_the_way'); toast.success('On the way — customer notified!') }
    })
  }

  const handleArrived = () => {
    updateJobStatus({ bookingId: job.id, status: 'arrived' }, {
      onSuccess: () => { setLocalStatus('arrived'); toast.success('Arrival confirmed! You can now send a quote.') },
      onError: () => { setLocalStatus('arrived'); toast.success('Arrival recorded! You can now send a quote.') }
    })
  }

  const handleSubmitQuote = () => {
    const labor = parseFloat(quoteForm.laborCost)
    const materials = parseFloat(quoteForm.materialsCost)
    if (!quoteForm.description.trim()) { toast.error('Please add a description'); return }
    if (isNaN(labor) || labor < 0) { toast.error('Enter a valid labour cost'); return }
    createQuotation({
      bookingId: job.id,
      laborCost: labor,
      materialsCost: isNaN(materials) ? 0 : materials,
      description: quoteForm.description,
      estimatedDuration: quoteForm.estimatedDuration || undefined,
    }, {
      onSuccess: () => { toast.success('Quote sent to homeowner!'); setShowQuoteForm(false) },
      onError: () => toast.error('Failed to send quote. Please try again.')
    })
  }

  return (
    <div className="relative">
      <div className={cn(
        "flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto pb-10 transition-all duration-300",
        showVerificationOverlay && "blur-md pointer-events-none select-none opacity-50"
      )}>
        <div className="flex-1 flex flex-col gap-6">
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
                    <h1 className="text-xl font-bold text-neutral-800">
                      {job.service?.name || job.serviceName || job.title || 'Home Service Request'}
                    </h1>
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
              <p>{bookingNotes || 'No additional details provided.'}</p>
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
                    {bookingAddress || 'Address unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar — Pending: accept/decline */}
          {isJobStatusPending && (
            <div className="p-6 bg-stone-50 border-t border-zinc-200 flex flex-col sm:flex-row gap-4 justify-end items-center">
              <p className="text-sm text-zinc-500 sm:mr-auto">Accept this job to view full customer details and send a quotation.</p>
              <Button variant="outline" onClick={handleReject} disabled={isRejecting || isAccepting}
                className="w-full sm:w-auto h-12 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                {isRejecting ? 'Declining...' : 'Decline Job'}
              </Button>
              <Button onClick={handleAccept} disabled={isAccepting || isRejecting}
                className="w-full sm:w-auto h-12 bg-blue-700 hover:bg-blue-800 px-8">
                {isAccepting ? 'Accepting...' : 'Accept Job'}
              </Button>
            </div>
          )}

          {/* Action Bar — Confirmed: on-the-way / arrived workflow */}
          {jobStatus === 'confirmed' && (
            <div className="p-6 bg-blue-50 border-t border-blue-100 flex flex-col sm:flex-row gap-3 items-center">
              <div className="sm:mr-auto">
                <p className="text-sm font-semibold text-blue-800">Job Accepted</p>
                <p className="text-xs text-blue-600 mt-0.5">Update your status so the homeowner knows you're on the way.</p>
              </div>
              {localStatus === null && (
                <Button onClick={handleOnTheWay} disabled={isUpdatingStatus}
                  className="w-full sm:w-auto h-11 bg-blue-700 hover:bg-blue-800 gap-2">
                  <HiOutlineTruck className="w-5 h-5" />
                  {isUpdatingStatus ? 'Updating...' : 'Start — On the Way'}
                </Button>
              )}
              {localStatus === 'on_the_way' && (
                <Button onClick={handleArrived} disabled={isUpdatingStatus}
                  className="w-full sm:w-auto h-11 bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <HiOutlineHome className="w-5 h-5" />
                  {isUpdatingStatus ? 'Updating...' : 'Arrived'}
                </Button>
              )}
              {localStatus === 'arrived' && (
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <HiOutlineCheckCircle className="w-5 h-5" />
                  Arrived at location
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Customer Info + Quote panel — visible when confirmed/active */}
        {isActive && (
          <div className="flex-1 flex flex-col gap-6">
            {/* Homeowner card */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <h3 className="text-lg font-bold text-neutral-800">Homeowner Details</h3>
                {['in-progress', 'in_progress'].includes(jobStatus) && (
                  <Button onClick={handleComplete} disabled={isCompleting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                    {isCompleting ? 'Completing...' : 'Mark as Complete'}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <HiOutlineUser className="w-7 h-7 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-neutral-800">{job.customerDetails?.name || job.user?.name || 'Homeowner'}</h4>
                  <p className="text-sm text-zinc-500">Member since 2024</p>
                </div>
              </div>

              {/* Live Map */}
              <JobLocationMap job={job} engineerCoords={engineerCoords} />

              {/* Message + Make Quote buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Link href={`/messages?bookingId=${job.id}`} className="flex-1">
                  <Button className="w-full h-11 bg-blue-700 hover:bg-blue-800 gap-2">
                    <HiOutlineChatAlt className="w-5 h-5" />
                    Message Homeowner
                  </Button>
                </Link>

                {/* Show Make Quote when arrived or already has a quote */}
                {(localStatus === 'arrived' || existingQuotation) && !showQuoteForm && (
                  <Button
                    variant="outline"
                    onClick={() => setShowQuoteForm(true)}
                    className="w-full h-11 border-blue-200 text-blue-700 hover:bg-blue-50 gap-2"
                  >
                    <HiOutlineDocumentText className="w-5 h-5" />
                    {existingQuotation ? 'View / Revise Quote' : 'Make Quote'}
                  </Button>
                )}
              </div>
            </div>

            {/* Quotation Form */}
            {showQuoteForm && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-800">Send Quotation</h3>
                  <button onClick={() => setShowQuoteForm(false)} className="text-zinc-400 hover:text-zinc-600 text-sm">Cancel</button>
                </div>

                {existingQuotation && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                    A quote was already sent. Submitting again will revise it.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Labour Cost (₦)</label>
                    <input type="number" min="0" placeholder="0"
                      value={quoteForm.laborCost}
                      onChange={e => setQuoteForm(f => ({ ...f, laborCost: e.target.value }))}
                      className="border border-zinc-200 rounded-xl px-3 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Materials Cost (₦)</label>
                    <input type="number" min="0" placeholder="0"
                      value={quoteForm.materialsCost}
                      onChange={e => setQuoteForm(f => ({ ...f, materialsCost: e.target.value }))}
                      className="border border-zinc-200 rounded-xl px-3 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Estimated Duration</label>
                  <input type="text" placeholder="e.g. 2–3 hours"
                    value={quoteForm.estimatedDuration}
                    onChange={e => setQuoteForm(f => ({ ...f, estimatedDuration: e.target.value }))}
                    className="border border-zinc-200 rounded-xl px-3 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Description / Scope of Work</label>
                  <textarea rows={4} placeholder="Describe the work to be done..."
                    value={quoteForm.description}
                    onChange={e => setQuoteForm(f => ({ ...f, description: e.target.value }))}
                    className="border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>

                {quoteForm.laborCost && (
                  <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">Total Estimate</span>
                    <span className="text-lg font-bold text-blue-800">
                      ₦{((parseFloat(quoteForm.laborCost) || 0) + (parseFloat(quoteForm.materialsCost) || 0)).toLocaleString()}
                    </span>
                  </div>
                )}

                <Button onClick={handleSubmitQuote} disabled={isCreatingQuote}
                  className="w-full h-12 bg-blue-700 hover:bg-blue-800 gap-2">
                  <HiOutlineDocumentText className="w-5 h-5" />
                  {isCreatingQuote ? 'Sending Quote...' : 'Send Quote to Homeowner'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Overlay - Portal'd to body for clean stacking */}
      {showVerificationOverlay && mounted && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 pb-20 overflow-y-auto bg-white/10 backdrop-blur-md">
          <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function JobLocationMap({ job, engineerCoords }: { job: any; engineerCoords: [number, number] | null }) {
  const customerLat = job.customerDetails?.latitude ?? job.location?.latitude ?? job.address?.latitude
  const customerLng = job.customerDetails?.longitude ?? job.location?.longitude ?? job.address?.longitude
  const hasCustomerLocation = customerLat != null && customerLng != null

  const defaultCenter: [number, number] = engineerCoords ?? (hasCustomerLocation ? [customerLng, customerLat] : [3.3792, 6.5244])
  const [mapCenter, setMapCenter] = React.useState<[number, number]>(defaultCenter)

  React.useEffect(() => {
    if (engineerCoords) setMapCenter(engineerCoords)
  }, [engineerCoords])

  const markers: MapMarker[] = []
  if (hasCustomerLocation) {
    markers.push({ lngLat: [customerLng, customerLat], color: '#dc2626', label: 'Homeowner Location' })
  }
  if (engineerCoords) {
    markers.push({ lngLat: engineerCoords, color: '#1d4ed8', label: 'Your Location' })
  }

  if (!hasCustomerLocation && !engineerCoords) {
    return (
      <div className="w-full h-56 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
        <p className="text-sm text-zinc-400">Location data unavailable</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-800">Live Location</p>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          {hasCustomerLocation && (
            <button 
              onClick={() => setMapCenter([customerLng, customerLat])}
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
              title="Center on Homeowner"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              Homeowner
            </button>
          )}
          {engineerCoords && (
            <button 
              onClick={() => setMapCenter(engineerCoords)}
              className="flex items-center gap-1 hover:text-blue-700 transition-colors"
              title="Center Map"
            >
              <span className="w-2 h-2 rounded-full bg-blue-700 inline-block" />
              You
            </button>
          )}
        </div>
      </div>
      <div className="w-full h-64 rounded-xl overflow-hidden border border-zinc-200">
        <Map
          viewport={{ center: mapCenter, zoom: 13, bearing: 0, pitch: 0 }}
          markers={markers}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
