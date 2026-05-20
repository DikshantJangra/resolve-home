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
  HiOutlineTrash,
  HiOutlineRefresh,
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

  const { data: jobResponse, isLoading: isJobLoading, error, refetch } = useEngineerBookingDetail(id as string, { enabled: !!isVerified })
  const job = jobResponse?.booking || jobResponse
  const { mutate: acceptJob, isPending: isAccepting } = useAcceptJob()
  const { mutate: rejectJob, isPending: isRejecting } = useRejectJob()
  const { mutate: completeJob, isPending: isCompleting } = useCompleteJob()
  const { mutate: updateJobStatus, isPending: isUpdatingStatus } = useUpdateJobStatus()
  const { mutate: createQuotation, isPending: isCreatingQuote } = useCreateQuotation()
  const { data: existingQuotation, refetch: refetchQuotation } = useBookingQuotation(id as string)

  const handleRefetch = async () => {
    toast.promise(
      Promise.all([
        refetch(),
        refetchQuotation()
      ]),
      {
        loading: 'Refreshing booking details...',
        success: 'Booking details refreshed!',
        error: 'Failed to refresh booking details.'
      }
    )
  }

  // Local state tracks on_the_way / arrived transitions (backend may not expose these)
  const [localStatus, setLocalStatus] = React.useState<'on_the_way' | 'arrived' | null>(null)
  const [showQuoteForm, setShowQuoteForm] = React.useState(false)
  const [showCompleteModal, setShowCompleteModal] = React.useState(false)
  const [laborFee, setLaborFee] = React.useState<string>('0')
  const [materials, setMaterials] = React.useState<Array<{ id: string; name: string; price: string; quantity: string }>>([
    { id: '1', name: '', price: '0', quantity: '1' }
  ])

  const handleAddItem = () => {
    setMaterials(prev => [...prev, { id: Math.random().toString(), name: '', price: '0', quantity: '1' }])
  }

  const handleRemoveItem = (itemId: string) => {
    setMaterials(prev => prev.filter(item => item.id !== itemId))
  }

  const handleUpdateItem = (itemId: string, field: 'name' | 'price' | 'quantity', value: string) => {
    setMaterials(prev => prev.map(item => item.id === itemId ? { ...item, [field]: value } : item))
  }

  const totalEstimatedAmount = React.useMemo(() => {
    const labor = parseFloat(laborFee) || 0
    const mats = materials.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      const qty = parseInt(item.quantity) || 1
      return sum + (price * qty)
    }, 0)
    return labor + mats
  }, [laborFee, materials])

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
  const isActive = ['confirmed', 'on_the_way', 'arrived', 'in-progress', 'in_progress', 'active', 'awaiting_quotation_approval', 'payment_pending', 'payment_completed', 'completed'].includes(jobStatus)

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
    setShowCompleteModal(true)
  }

  const handleOnTheWay = () => {
    updateJobStatus({ bookingId: job.id, status: 'on_the_way' }, {
      onSuccess: () => {
        setLocalStatus('on_the_way')
        toast.success('Customer notified you are on the way!')
      },
      onError: () => toast.error('Failed to update status. Please try again.')
    })
  }

  const handleArrived = () => {
    updateJobStatus({ bookingId: job.id, status: 'arrived' }, {
      onSuccess: () => {
        setLocalStatus('arrived')
        toast.success('Arrival confirmed! You can now send a quote.')
      },
      onError: () => toast.error('Failed to update status. Please try again.')
    })
  }

  const handleStartJob = () => {
    updateJobStatus({ bookingId: job.id, status: 'in-progress' }, {
      onSuccess: () => {
        toast.success('Job started! Work is now in progress.')
      },
      onError: () => toast.error('Failed to start job. Please try again.')
    })
  }

  const handleSubmitQuote = () => {
    const labor = parseFloat(laborFee)
    if (isNaN(labor) || labor < 0) {
      toast.error('Enter a valid labor fee')
      return
    }

    const formattedMaterials = materials
      .map(item => ({
        name: item.name.trim(),
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1
      }))
      .filter(item => item.name !== '')

    for (const mat of formattedMaterials) {
      if (mat.price < 0) {
        toast.error(`Price for ${mat.name} must be a positive number`)
        return
      }
      if (mat.quantity < 1) {
        toast.error(`Quantity for ${mat.name} must be at least 1`)
        return
      }
    }

    createQuotation({
      bookingId: job.id,
      laborFee: labor,
      materials: formattedMaterials,
    }, {
      onSuccess: () => {
        toast.success('Quote sent to homeowner!')
        setShowQuoteForm(false)
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to send quote. Please try again.')
      }
    })
  }

  return (
    <div className="relative">
      <div className={cn(
        "flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto pb-10 transition-all duration-300",
        showVerificationOverlay && "blur-md pointer-events-none select-none opacity-50"
      )}>
        <div className="flex-1 flex flex-col gap-6">
          {/* Breadcrumb & Refresh */}
          <div className="flex justify-between items-center">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1 text-zinc-600 hover:text-blue-700 transition-colors w-fit group"
            >
              <HiOutlineChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Bookings</span>
            </Link>
            <Button
              variant="outline"
              onClick={handleRefetch}
              className="h-9 px-3.5 border-zinc-200 text-zinc-600 hover:bg-zinc-50 flex items-center gap-1.5 font-semibold text-xs rounded-xl"
            >
              <HiOutlineRefresh className="w-4 h-4 text-zinc-500" />
              Refresh
            </Button>
          </div>

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

            {/* Action Bar for Active Job Workflow */}
            {['confirmed', 'on_the_way', 'arrived', 'payment_completed', 'in-progress', 'in_progress'].includes(jobStatus) && (
              <div className="p-6 bg-blue-50 border-t border-blue-100 flex flex-col sm:flex-row gap-3 items-center">
                <div className="sm:mr-auto">
                  <p className="text-sm font-semibold text-blue-800">Job Actions</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {jobStatus === 'confirmed' && "Start your journey to the customer's location."}
                    {jobStatus === 'on_the_way' && "Let the customer know you've arrived at their location."}
                    {jobStatus === 'arrived' && "Create a job quotation to outline labor and materials costs."}
                    {jobStatus === 'payment_completed' && "Start the job now that the customer's payment is secured in escrow."}
                    {['in-progress', 'in_progress'].includes(jobStatus) && "Mark the job as complete once you finish the work."}
                  </p>
                </div>

                {jobStatus === 'confirmed' && (
                  <Button onClick={handleOnTheWay} disabled={isUpdatingStatus}
                    className="w-full sm:w-auto h-11 bg-blue-700 hover:bg-blue-800 gap-2 font-semibold">
                    <HiOutlineTruck className="w-5 h-5" />
                    {isUpdatingStatus ? 'Updating...' : 'Start'}
                  </Button>
                )}

                {jobStatus === 'on_the_way' && (
                  <Button onClick={handleArrived} disabled={isUpdatingStatus}
                    className="w-full sm:w-auto h-11 bg-emerald-600 hover:bg-emerald-700 gap-2 font-semibold">
                    <HiOutlineHome className="w-5 h-5" />
                    {isUpdatingStatus ? 'Updating...' : 'Arrived'}
                  </Button>
                )}

                {jobStatus === 'arrived' && (
                  <Button
                    onClick={() => {
                      if (existingQuotation) {
                        setLaborFee((existingQuotation.laborFee || 0).toString())
                        setMaterials(existingQuotation.materials?.map((m: any) => ({
                          name: m.name,
                          price: (m.price || 0).toString(),
                          quantity: (m.quantity || 1).toString()
                        })) || [])
                      }
                      setShowQuoteForm(true)
                    }}
                    className="w-full sm:w-auto h-11 bg-blue-700 hover:bg-blue-800 gap-2 font-semibold"
                  >
                    <HiOutlineDocumentText className="w-5 h-5" />
                    {existingQuotation ? 'Update Job Quotation' : 'Create Job Quotation'}
                  </Button>
                )}

                {jobStatus === 'payment_completed' && (
                  <Button
                    onClick={handleStartJob}
                    disabled={isUpdatingStatus}
                    className="w-full sm:w-auto h-11 bg-blue-700 hover:bg-blue-800 gap-2 font-semibold animate-pulse"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    {isUpdatingStatus ? 'Updating...' : 'Start Job'}
                  </Button>
                )}

                {['in-progress', 'in_progress'].includes(jobStatus) && (
                  <Button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="w-full sm:w-auto h-11 bg-emerald-600 hover:bg-emerald-700 gap-2 font-semibold"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    {isCompleting ? 'Completing...' : 'Complete Job'}
                  </Button>
                )}
              </div>
            )}

            {/* Action Bar Badges for pending review / payment / completed */}
            {['awaiting_quotation_approval', 'payment_pending', 'completed'].includes(jobStatus) && (
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3 items-center">
                <div className="sm:mr-auto">
                  <p className="text-sm font-semibold text-zinc-800">Job Status</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {jobStatus === 'awaiting_quotation_approval' && "The customer is currently reviewing your quotation."}
                    {jobStatus === 'payment_pending' && "Your quotation has been approved! Awaiting customer deposit."}
                    {jobStatus === 'completed' && "This job has been completed successfully."}
                  </p>
                </div>

                {jobStatus === 'awaiting_quotation_approval' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Awaiting Quote Approval
                  </span>
                )}

                {jobStatus === 'payment_pending' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 animate-pulse">
                    Awaiting Customer Payment
                  </span>
                )}

                {jobStatus === 'completed' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <HiOutlineCheckCircle className="w-4 h-4" />
                    Job Completed
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quotation Summary Card — shown immediately under Home Service Request card if existingQuotation is present */}
          {existingQuotation && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-800">Job Quotation Sent</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Submitted breakdown of labor and materials costs.</p>
                </div>
                <div className="flex items-center gap-3">
                  {['awaiting_quotation_approval', 'arrived'].includes(jobStatus) && (
                    <Button
                      onClick={() => {
                        if (existingQuotation) {
                          setLaborFee((existingQuotation.laborFee || 0).toString())
                          setMaterials(existingQuotation.materials?.map((m: any) => ({
                            name: m.name,
                            price: (m.price || 0).toString(),
                            quantity: (m.quantity || 1).toString()
                          })) || [])
                        }
                        setShowQuoteForm(true)
                      }}
                      className="h-9 px-4 text-xs bg-blue-700 hover:bg-blue-800 gap-1.5 font-semibold shrink-0"
                    >
                      <HiOutlineDocumentText className="w-4 h-4" />
                      Update Quotation
                    </Button>
                  )}
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    existingQuotation.status === 'pending' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      existingQuotation.status === 'approved' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        "bg-rose-50 text-rose-700 border border-rose-100"
                  )}>
                    {existingQuotation.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Cost Breakdown items */}
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-zinc-100 text-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Call Out Fee</span>
                    <span className="text-base font-bold text-neutral-800 mt-1">₦{(existingQuotation.callOutFee || 10000).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Labor Fee</span>
                    <span className="text-base font-bold text-neutral-800 mt-1">₦{(existingQuotation.laborFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Material Cost</span>
                    <span className="text-base font-bold text-neutral-800 mt-1">₦{(existingQuotation.materialCost || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Materials List if present */}
                {existingQuotation.materials && existingQuotation.materials.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Materials Breakdown</h4>
                    <div className="flex flex-col gap-2 bg-stone-50 rounded-2xl p-4 max-h-[200px] overflow-y-auto">
                      {existingQuotation.materials.map((mat: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-medium">
                          <span className="text-zinc-700">{mat.name} <span className="text-xs text-zinc-400 font-normal">x {mat.quantity}</span></span>
                          <span className="text-neutral-800">₦{(mat.price * mat.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="bg-blue-50 rounded-2xl p-5 flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-blue-800">Total Price</span>
                  <span className="text-2xl font-extrabold text-blue-900">
                    ₦{(existingQuotation.totalCost || existingQuotation.totalPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

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
                {(() => {
                  const customer = job.user || job.customer || job.customerDetails
                  const name = customer?.name || 'Homeowner'
                  const image = customer?.image
                  return (
                    <>
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-blue-50 flex items-center justify-center">
                        {image ? (
                          <img src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL}${image}`}
                            alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
                            alt={name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-neutral-800">{name}</h4>
                        <p className="text-sm text-zinc-500">{customer?.email || 'Homeowner'}</p>
                      </div>
                    </>
                  )
                })()}

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

                  {/* Show Make Quote button ONLY when arrived */}
                  {jobStatus === 'arrived' && !showQuoteForm && (
                    <Button
                      onClick={() => {
                        if (existingQuotation) {
                          setLaborFee((existingQuotation.laborFee || 0).toString())
                          setMaterials(existingQuotation.materials?.map((m: any) => ({
                            name: m.name,
                            price: (m.price || 0).toString(),
                            quantity: (m.quantity || 1).toString()
                          })) || [])
                        }
                        setShowQuoteForm(true)
                      }}
                      className="w-full h-11 bg-blue-700 hover:bg-blue-800 gap-2"
                    >
                      <HiOutlineDocumentText className="w-5 h-5" />
                      {existingQuotation ? 'Update Job Quotation' : 'Create Job Quotation'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Premium Create Job Quotation Modal Overlay */}
              {showQuoteForm && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
                  <div className="bg-white rounded-3xl border border-zinc-100 shadow-2xl p-6 md:p-8 flex flex-col gap-6 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">
                          {existingQuotation ? 'Update Job Quotation' : 'Create Job Quotation'}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">Break down costs for labor and materials.</p>
                      </div>
                      <button
                        onClick={() => setShowQuoteForm(false)}
                        className="text-zinc-400 hover:text-zinc-600 text-sm font-semibold transition-colors"
                      >
                        Close
                      </button>
                    </div>

                    {existingQuotation && (
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700">
                        A quote was already sent. Submitting again will revise it.
                      </div>
                    )}

                    {/* Labor Fee input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-zinc-700 tracking-wide">Labor fee (₦) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={laborFee}
                        onChange={e => setLaborFee(e.target.value)}
                        className="w-full border border-zinc-200 rounded-2xl px-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                      />
                    </div>

                    {/* Materials section */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-700 tracking-wide">Materials *</span>
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                        >
                          Add Item
                        </button>
                      </div>

                      <div className="flex flex-col gap-3 max-h-[25vh] overflow-y-auto pr-1">
                        {materials.map((item, index) => (
                          <div key={item.id} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="item name (e.g Copper Pipe)"
                              value={item.name}
                              onChange={e => handleUpdateItem(item.id, 'name', e.target.value)}
                              className="flex-1 border border-zinc-200 rounded-2xl px-3 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="Price"
                              value={item.price}
                              onChange={e => handleUpdateItem(item.id, 'price', e.target.value)}
                              className="w-20 border border-zinc-200 rounded-2xl px-2 h-11 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                              className="w-14 border border-zinc-200 rounded-2xl px-2 h-11 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            {materials.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <HiOutlineTrash className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Total */}
                    <div className="flex items-end justify-between border-t border-zinc-100 pt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Estimated Amount</span>
                        <span className="text-3xl font-extrabold text-neutral-900 mt-1">
                          ₦{totalEstimatedAmount.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        onClick={handleSubmitQuote}
                        disabled={isCreatingQuote}
                        className="h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 rounded-2xl shadow-lg shadow-blue-700/15"
                      >
                        {isCreatingQuote ? 'Sending Quotation...' : 'Send Quotation'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
        )}
          </div>

      {/* Complete Job Confirmation Modal Overlay */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-150 flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-center items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
                <HiOutlineCheckCircle className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-bold text-neutral-800">Complete Job?</h3>
                <p className="text-sm text-zinc-500 px-4">
                  Are you sure you want to mark this job as complete? This will notify the homeowner to release the escrow funds.
                </p>
              </div>

              <div className="flex gap-3 w-full mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 h-11 border-zinc-200 text-zinc-700 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    completeJob(job.id, {
                      onSuccess: () => {
                        toast.success('Job marked as complete')
                        setShowCompleteModal(false)
                        setTimeout(() => {
                          window.location.reload()
                        }, 800)
                      },
                      onError: (err: any) => {
                        toast.error(err.response?.data?.message || 'Failed to complete job.')
                      }
                    })
                  }}
                  disabled={isCompleting}
                  className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 font-semibold"
                >
                  {isCompleting ? 'Completing...' : 'Yes, Complete'}
                </Button>
              </div>
            </div>
          </div>
        )}

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

      function JobLocationMap({job, engineerCoords}: {job: any; engineerCoords: [number, number] | null }) {
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
