'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  HiOutlineChevronLeft,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlinePhone,
  HiOutlineChatAlt,
  HiOutlineLocationMarker,
  HiOutlineRefresh
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { BookingProgressTracker } from '@/features/booking/components/booking-progress-tracker'
import { ReviewCard } from '@/features/booking/components/review-card'
import { ReviewForm } from '@/features/booking/components/review-form'
import { QuotationView } from '@/features/booking/components/quotation-view'
import { Map, type MapViewport, type MapMarker } from '@/components/ui/map'
import { Button, cn, formatImageUrl, LoadingSpinner } from "@resolve/ui"
import { useBookingDetail, useCancelBooking, useBookingQuotation, useUserProfile, useAvailableEngineers, useEngineerLocation, useSelectEngineer } from '@/hooks/api-hooks'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ProgressStep } from '@/features/booking/types'

export default function BookingDetailsPage() {
  const { id } = useParams()
  const { data: userProfile } = useUserProfile()
  const { data: booking, isLoading, error, refetch } = useBookingDetail(id as string)
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const { data: quotation, refetch: refetchQuotation } = useBookingQuotation(id as string)
  const queryClient = useQueryClient()

  const engineer = !isLoading && booking
    ? (booking.engineer || booking.engineers?.[0] || null)
    : null
  const hasNoEngineer = !isLoading && !!booking && !engineer

  const { data: availableEngineersData, refetch: refetchEngineers, isFetching: isRefetchingEngineers } = useAvailableEngineers(
    hasNoEngineer ? id as string : ''
  )
  const availableEngineers: any[] = availableEngineersData?.engineers || []

  const { mutate: selectEngineer, isPending: isSelectingEngineer, variables: selectVars } = useSelectEngineer()
  const [selectedEngineerId, setSelectedEngineerId] = React.useState<string | null>(null)

  const handleSelectEngineer = (engineerId: string) => {
    selectEngineer({ bookingId: id as string, engineerId }, {
      onSuccess: () => {
        setSelectedEngineerId(engineerId)
        toast.success('Pro Partner selected!')
        refetch()
      },
      onError: (err: any) => toast.error(err?.message || 'Failed to select engineer')
    })
  }

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

  const handleRefreshPro = async () => {
    await queryClient.invalidateQueries({ queryKey: ['booking-detail', id] })
    if (hasNoEngineer) {
      const result = await refetchEngineers()
      if (result.data?.engineers?.length > 0) {
        await queryClient.invalidateQueries({ queryKey: ['booking-detail', id] })
      }
    }
  }

  const isWorker = userProfile?.user?.role === 'worker'

  const trackingActive = !!engineer && ['confirmed', 'on_the_way', 'arrived', 'in_progress', 'in-progress'].includes(booking?.status ?? '')
  const { data: engineerLocation } = useEngineerLocation(id as string, !isLoading && !!booking && trackingActive)

  const [mapViewport, setMapViewport] = React.useState<MapViewport>({
    center: [-3.4, 6.4],
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

  const engineerStoredLocation = engineer?.location ?? null

  React.useEffect(() => {
    if (engineerLocation?.latitude && engineerLocation?.longitude) {
      setMapViewport(v => ({ ...v, center: [engineerLocation.longitude!, engineerLocation.latitude!], zoom: 15 }))
    } else if (engineerStoredLocation?.latitude && engineerStoredLocation?.longitude) {
      setMapViewport(v => ({ ...v, center: [engineerStoredLocation.longitude, engineerStoredLocation.latitude], zoom: 14 }))
    } else if (booking?.location?.longitude && booking?.location?.latitude) {
      setMapViewport(v => ({ ...v, center: [booking.location.longitude, booking.location.latitude], zoom: 14 }))
    }
  }, [engineerLocation, engineerStoredLocation, booking])

  const mapMarkers = React.useMemo<MapMarker[]>(() => {
    const markers: MapMarker[] = []
    if (engineerLocation?.latitude && engineerLocation?.longitude) {
      markers.push({ lngLat: [engineerLocation.longitude, engineerLocation.latitude], color: '#1d4ed8', label: 'Pro Partner' })
    } else if (engineerStoredLocation?.latitude && engineerStoredLocation?.longitude) {
      markers.push({ lngLat: [engineerStoredLocation.longitude, engineerStoredLocation.latitude], color: '#1d4ed8', label: 'Pro Partner' })
    } else if (booking?.location?.latitude && booking?.location?.longitude) {
      markers.push({ lngLat: [booking.location.longitude, booking.location.latitude], color: '#ef4444', label: 'Your location' })
    }
    return markers
  }, [booking, engineerLocation, engineerStoredLocation])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 w-32 bg-zinc-200 rounded" />

        {/* Main Status Card Skeleton */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-5 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-200 rounded-xl shrink-0" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-zinc-200 rounded" />
                <div className="h-4 w-72 bg-zinc-200 rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-zinc-200 rounded-full" />
          </div>
          <div className="h-2 bg-zinc-150 rounded-full w-full mt-4" />
          <div className="flex justify-between items-center py-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 w-16 bg-zinc-200 rounded" />
            ))}
          </div>
        </div>

        {/* Two Column Layout Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
            <div className="h-6 w-32 bg-zinc-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-zinc-100 rounded" />
              <div className="h-4 w-full bg-zinc-100 rounded" />
              <div className="h-4 w-2/3 bg-zinc-100 rounded" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
            <div className="h-6 w-32 bg-zinc-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-zinc-100 rounded" />
              <div className="h-4 w-full bg-zinc-100 rounded" />
              <div className="h-4 w-2/3 bg-zinc-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-zinc-500">Failed to load booking details.</p>
        <Link href="/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    )
  }

  const statusSteps: ProgressStep[] = [
    {
      label: 'Pro Matched',
      status: (['confirmed', 'on_the_way', 'arrived', 'awaiting_quotation_approval', 'payment_pending', 'payment_completed', 'in_progress', 'in-progress', 'completed'].includes(booking.status) ? 'completed' : 'pending') as any
    },
    {
      label: 'On the way',
      status: (booking.status === 'on_the_way'
        ? 'current'
        : (['arrived', 'awaiting_quotation_approval', 'payment_pending', 'payment_completed', 'in_progress', 'in-progress', 'completed'].includes(booking.status) ? 'completed' : 'pending')) as any
    },
    {
      label: 'Arrived',
      status: (booking.status === 'arrived'
        ? 'current'
        : (['awaiting_quotation_approval', 'payment_pending', 'payment_completed', 'in_progress', 'in-progress', 'completed'].includes(booking.status) ? 'completed' : 'pending')) as any
    },
    {
      label: 'In progress',
      status: (['in_progress', 'in-progress'].includes(booking.status)
        ? 'current'
        : (['completed'].includes(booking.status) ? 'completed' : 'pending')) as any
    },
    {
      label: 'Completed',
      status: (booking.status === 'completed' ? 'completed' : 'pending') as any
    },
  ]

  const customer = booking.user

  const displayUser = isWorker ? customer : engineer
  const displayName = displayUser?.name || (isWorker ? 'Homeowner' : 'Pro Partner')
  const displayImage = displayUser?.image
    ? formatImageUrl(displayUser.image)
    : (displayUser?.idDocument
      ? formatImageUrl(displayUser.idDocument)
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`)
  const userRole = isWorker ? 'Homeowner' : (engineer?.role || 'Pro Partner')

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Breadcrumb & Refresh */}
      <div className="flex justify-between items-center">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-zinc-600 hover:text-blue-700 transition-colors group"
        >
          <div className="w-5 h-5 flex items-center justify-center rotate-180">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-medium">Bookings details</span>
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

      {/* Main Status Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-5 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 px-2.5 rounded-xl flex items-center justify-center shrink-0",
              booking.urgency?.toUpperCase() === 'EMERGENCY' ? "bg-red-600" : "bg-blue-50"
            )}>
              <HiWrenchScrewdriver className={cn("w-5 h-5", booking.urgency?.toUpperCase() === 'EMERGENCY' ? "text-white" : "text-blue-700")} />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-neutral-700 text-base font-semibold">{booking.service?.name || 'Service'}</h2>
                <span className="text-zinc-500 text-[10px] font-medium uppercase">JOB ID: #RH-{booking.id ? booking.id.slice(-6).toUpperCase() : 'N/A'}</span>
              </div>
              <p className="text-zinc-600 text-xs">{booking.notes || 'Job details and investigation required.'}</p>
            </div>
          </div>
          <div className={cn(
            "px-5 py-1.5 rounded-full flex items-center shrink-0",
            ['in_progress', 'in-progress'].includes(booking.status) ? "bg-stone-500/10" : "bg-emerald-500/10"
          )}>
            <div className={cn(
              "text-xs font-medium capitalize",
              ['in_progress', 'in-progress'].includes(booking.status) ? "text-stone-500" : "text-green-700"
            )}>
              {booking.status?.replace('_', ' ')?.replace('-', ' ') || 'Pending'}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Timeline */}
        <div className="py-4 border-t border-b border-stone-50 flex flex-col md:flex-row items-center gap-10">
          {engineer && (
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={displayImage}
                alt={displayName}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm font-semibold">{displayName}</span>
                {engineer?.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-gray-700 text-xs font-semibold">{engineer.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 w-full min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[500px] px-2">
              {statusSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                      step.status === 'completed' ? "bg-blue-700" : step.status === 'current' ? "bg-blue-700" : "bg-zinc-200"
                    )}>
                      {step.status === 'completed' ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
                      )}
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium whitespace-nowrap",
                      step.status !== 'pending' ? "text-neutral-700" : "text-zinc-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-[2px] -mt-6 transition-colors duration-500",
                      statusSteps[idx + 1].status !== 'pending' ? "bg-blue-700" : "bg-zinc-200"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduling Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 text-blue-700">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-neutral-700 text-xs">
              {booking.scheduledDate && booking.scheduledTime
                ? `Scheduled: ${format(new Date(`${booking.scheduledDate}T${booking.scheduledTime}`), 'MMM d, yyyy · h:mm a')}`
                : 'Schedule pending'}
            </span>
          </div>
          {booking.address && (
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker className="w-3.5 h-3.5 text-red-600" />
              <span className="text-zinc-600 text-xs">{booking.address}, {booking.city || 'Lagos'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Visualization */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 h-[520px] rounded-2xl relative overflow-hidden shadow-sm border border-zinc-100">
          <Map viewport={mapViewport} onViewportChange={setMapViewport} markers={mapMarkers} />
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-100 flex items-center gap-2">
            {trackingActive ? (
              <>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">Live Tracking</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Map View</span>
              </>
            )}
          </div>
          {!engineer && (
            <div className="absolute inset-0 z-10 flex items-end justify-center pb-6 pointer-events-none">
              <div className="px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 flex items-center gap-2">
                <HiOutlineLocationMarker className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-500">No Pro Partner assigned yet</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile and Review Sidebar */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!engineer ? (
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-700">
                    {availableEngineers.length > 0
                      ? `${availableEngineers.length} Pro Partner${availableEngineers.length > 1 ? 's' : ''} available`
                      : 'Searching for Pro Partners...'}
                  </p>
                  {availableEngineers.length > 0 && (
                    <p className="text-xs text-zinc-500">Select one to get started</p>
                  )}
                </div>
                <Button onClick={handleRefreshPro} disabled={isRefetchingEngineers} variant="outline"
                  className="h-8 px-3 text-xs flex items-center gap-1.5">
                  <HiOutlineRefresh className={cn('w-3.5 h-3.5', isRefetchingEngineers && 'animate-spin')} />
                  Refresh
                </Button>
              </div>

              {availableEngineers.length === 0 ? (
                <div className="p-6 bg-stone-50 rounded-2xl flex flex-col items-center justify-center gap-4 border border-zinc-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                    <HiOutlineBriefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-700">No Pro Partners Found Yet</h3>
                  <p className="text-zinc-500 text-sm">We're still searching nearby. Check back in a moment.</p>
                  {!isCancelling ? (
                    <Button onClick={() => cancelBooking(id as string)} variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50">Cancel Booking</Button>
                  ) : (
                    <Button disabled>Cancelling...</Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {availableEngineers.map((eng: any) => {
                    const isSelecting = isSelectingEngineer && (selectVars as any)?.engineerId === eng.id
                    const isSelected = selectedEngineerId === eng.id
                    return (
                      <div key={eng.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col gap-3 shadow-sm">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            {eng.image ? (
                              <img src={formatImageUrl(eng.image)} alt={eng.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold">
                                {eng.name?.[0] || 'P'}
                              </div>
                            )}
                            <span className={cn('absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                              eng.isOnline ? 'bg-green-500' : 'bg-zinc-400')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-neutral-700 text-sm font-bold uppercase">{eng.name}</span>
                              <span className="px-1.5 py-0.5 border border-orange-400 text-orange-500 text-[9px] font-bold rounded">✦ PRO VERIFIED</span>
                            </div>
                            <span className="text-blue-600 text-xs font-medium">Professional Partner</span>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <HiOutlineStar key={s} className={cn('w-3 h-3', s <= Math.round(eng.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-200')} />
                                ))}
                                <span className="text-zinc-500 text-xs ml-1">{(eng.rating || 0).toFixed(1)} ({eng.reviews?.length || 0})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <HiOutlineBriefcase className="w-3 h-3 text-zinc-400" />
                                <span className="text-zinc-500 text-xs">{eng.completedJobs || 0} jobs</span>
                              </div>
                              {eng.distance != null && (
                                <div className="flex items-center gap-1">
                                  <HiOutlineLocationMarker className="w-3 h-3 text-blue-600" />
                                  <span className="text-blue-600 text-xs font-semibold">{eng.distance}km away</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Services + Bio */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wide">Services Offered</span>
                            {eng.assignedServicesDetail?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {eng.assignedServicesDetail.map((s: any, i: number) => (
                                  <span key={i} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] rounded-full border border-zinc-200">{s.name}</span>
                                ))}
                              </div>
                            ) : <span className="text-zinc-400 text-xs italic">Not specified</span>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wide">About Me</span>
                            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                              {eng.aboutMe || 'No introduction provided yet.'}
                            </p>
                          </div>
                        </div>

                        {/* Select button */}
                        <button
                          onClick={() => !isSelected && handleSelectEngineer(eng.id)}
                          disabled={isSelectingEngineer || isSelected}
                          className={cn('w-full h-10 rounded-xl text-sm font-semibold transition-all',
                            isSelected ? 'bg-emerald-600 text-white cursor-not-allowed'
                              : isSelecting ? 'bg-blue-700 text-white opacity-70 cursor-not-allowed'
                                : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-[0.98]'
                          )}
                        >
                          {isSelected ? '✓ Selected' : isSelecting ? 'Selecting...' : 'Select Pro Partner'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl flex flex-col gap-8 border border-zinc-100 shadow-sm">
              {/* User Profile Header */}
              <div className="flex items-center gap-4">
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-neutral-700 text-base font-bold">{displayName}</h3>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">Pro Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-600 text-xs">{userRole}</span>
                    <div className="w-1 h-1 bg-blue-700 rounded-full" />
                    <div className="flex items-center gap-1">
                      <HiOutlineStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-zinc-600 text-xs font-medium">{engineer?.rating || 0} Rating</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <HiOutlineBriefcase className="w-4 h-4" />
                      <span>{engineer?.completedJobs || 0} Jobs Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex gap-4">
                <Link
                  href={`/messages?bookingId=${booking.id}`}
                  className="flex-1 h-11 px-6 py-3 bg-blue-700 rounded-xl flex justify-center items-center gap-2.5 transition-all shadow-md active:scale-[0.98] hover:bg-blue-800"
                >
                  <HiOutlineChatAlt className="w-5 h-5 text-white" />
                  <div className="justify-start text-neutral-50 text-sm font-medium leading-5">Chat with Pro Partner</div>
                </Link>
              </div>

              {/* Quotation View */}
              {quotation && (
                <QuotationView quotation={quotation} booking={booking} />
              )}

              {/* Engineer Reviews */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-neutral-700">Reviews</h4>
                {engineer?.reviews?.length > 0 ? (
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                    {engineer.reviews.map((r: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-zinc-100 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-700">{r.customerName || 'Customer'}</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <HiOutlineStar key={s} className={cn('w-3 h-3', s <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-200')} />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="text-xs text-zinc-500 leading-relaxed">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 py-3 text-center bg-stone-50 rounded-xl border border-dashed border-zinc-200">No reviews yet</p>
                )}
              </div>

              {/* Review Section (if completed booking and customer hasn't submitted a review yet) */}
              {booking.status === 'completed' && !booking.review && engineer && (
                <ReviewForm
                  bookingId={booking.id}
                  onSuccess={() => {
                    setTimeout(() => {
                      window.location.reload()
                    }, 800)
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}
