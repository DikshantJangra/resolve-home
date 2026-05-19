'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  HiOutlineStar,
  HiStar,
  HiOutlineBriefcase,
  HiOutlineRefresh,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLocationMarker,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineThumbUp,
} from 'react-icons/hi'
import { useBookingStore } from '@/store/booking-store'
import { Button, cn, formatImageUrl } from '@resolve/ui'
import { useSelectEngineer, useAvailableEngineers } from '@/hooks/api-hooks'
import { toast } from 'sonner'

const MAX_DISTANCE_KM = 10
const COUNTDOWN_SECONDS = 15

// ─── Star Rating display ──────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          star <= Math.round(rating)
            ? <HiStar key={star} className="w-3.5 h-3.5 text-amber-400" />
            : <HiOutlineStar key={star} className="w-3.5 h-3.5 text-zinc-300" />
        ))}
      </div>
      <span className="text-xs text-zinc-500 font-medium">
        {rating > 0 ? rating.toFixed(1) : '0.0'} <span className="text-zinc-400">({count})</span>
      </span>
    </div>
  )
}

// ─── Engineer Card ────────────────────────────────────────────────────────────
function EngineerCard({
  engineer,
  onSelect,
  isPending,
  selectedId,
  currentEngineerId,
}: {
  engineer: any
  onSelect: (id: string) => void
  isPending: boolean
  selectedId: string | null
  currentEngineerId: string | null
}) {
  const [bioExpanded, setBioExpanded] = useState(false)
  const isSelecting = isPending && selectedId === engineer.id
  const isAlreadySelected = currentEngineerId === engineer.id

  const aboutText = engineer.aboutMe || 'No introduction provided yet by this Pro Partner.'
  const isLongBio = aboutText.length > 200
  const displayBio = bioExpanded || !isLongBio ? aboutText : `${aboutText.slice(0, 200)}...`

  const completedJobs = engineer.completedJobs ?? 0
  const rating = typeof engineer.rating === 'number' ? engineer.rating : 0
  const reviewCount = engineer.reviews?.length ?? 0
  const services: any[] = engineer.assignedServicesDetail ?? []
  const displayServices = services.slice(0, 5)
  const extraServices = services.length - displayServices.length

  return (
    <div
      className={cn(
        'bg-white border rounded-2xl overflow-hidden transition-all duration-200',
        isAlreadySelected
          ? 'border-emerald-400 shadow-md ring-1 ring-emerald-200'
          : 'border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300',
      )}
    >
      {/* ── Top Header strip ── */}
      <div className="px-5 pt-5 pb-4 flex flex-col md:flex-row md:items-start gap-4">

        {/* Avatar + identity */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            {engineer.image ? (
              <img
                src={formatImageUrl(engineer.image)}
                alt={engineer.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold ring-2 ring-white shadow">
                {engineer.name?.[0]?.toUpperCase() ?? 'P'}
              </div>
            )}
            {/* Online dot */}
            <span
              className={cn(
                'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white',
                engineer.isOnline ? 'bg-green-500' : 'bg-zinc-400',
              )}
              title={engineer.isOnline ? 'Online' : 'Offline'}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-neutral-800 tracking-tight truncate">
                {engineer.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-extrabold uppercase rounded tracking-wider shrink-0">
                <HiOutlineShieldCheck className="w-3 h-3" />
                Pro Verified
              </span>
            </div>

            <p className="text-xs font-semibold text-blue-700 truncate">
              {engineer.categoryName ?? engineer.specialty ?? 'Professional Partner'}
            </p>

            <StarRating rating={rating} count={reviewCount} />

            {engineer.distance != null && (
              <div className="flex items-center gap-1 text-zinc-400 text-[11px] pt-0.5">
                <HiOutlineLocationMarker className="w-3.5 h-3.5 text-blue-500" />
                <span>{engineer.distance} km away</span>
              </div>
            )}
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex md:flex-col gap-3 md:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2">
            <HiOutlineBriefcase className="w-4 h-4 text-zinc-500 shrink-0" />
            <div>
              <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider leading-none">
                Jobs Done
              </p>
              <p className="text-sm font-bold text-neutral-700 leading-snug">{completedJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2">
            <HiOutlineThumbUp className="w-4 h-4 text-zinc-500 shrink-0" />
            <div>
              <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider leading-none">
                Rating
              </p>
              <p className="text-sm font-bold text-neutral-700 leading-snug">
                {rating > 0 ? rating.toFixed(1) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-zinc-100" />

      {/* ── Body: Services + About ── */}
      <div className="px-5 py-4 grid md:grid-cols-2 gap-5">

        {/* Services */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Services Offered
          </p>
          {displayServices.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {displayServices.map((s: any) => (
                <span
                  key={s.id}
                  className="text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 transition-colors px-2.5 py-1 rounded-md"
                >
                  {s.name}
                </span>
              ))}
              {extraServices > 0 && (
                <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                  +{extraServices} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-zinc-400 italic">
              General {engineer.categoryName ?? 'Service'}
            </span>
          )}
        </div>

        {/* About me */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            About Me
          </p>
          <div className="text-xs text-zinc-600 leading-relaxed">
            <p className="whitespace-pre-line">{displayBio}</p>
            {isLongBio && (
              <button
                onClick={() => setBioExpanded(!bioExpanded)}
                className="mt-1 inline-flex items-center gap-0.5 text-blue-700 font-bold hover:text-blue-800 transition-colors text-[11px]"
              >
                {bioExpanded ? (
                  <><HiOutlineChevronUp className="w-3.5 h-3.5" /> View less</>
                ) : (
                  <><HiOutlineChevronDown className="w-3.5 h-3.5" /> View more</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Action Footer ── */}
      <div className="px-5 pb-5">
        <button
          onClick={() => !isAlreadySelected && onSelect(engineer.id)}
          disabled={isPending || isAlreadySelected}
          className={cn(
            'w-full h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            isAlreadySelected
              ? 'bg-emerald-600 text-white cursor-not-allowed focus-visible:ring-emerald-500'
              : isSelecting
                ? 'bg-blue-700 text-white opacity-70 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white shadow-sm focus-visible:ring-blue-500',
          )}
        >
          {isAlreadySelected ? '✓ Pro Partner Selected' : isSelecting ? 'Selecting...' : 'Select Pro Partner'}
        </button>
      </div>
    </div>
  )
}

// ─── Main SuccessStep ─────────────────────────────────────────────────────────
export const SuccessStep = () => {
  const { mutate: selectEngineer, isPending, variables: selectVars } = useSelectEngineer()
  const {
    availableEngineers,
    setAvailableEngineers,
    setStep,
    bookingId,
    isOpen,
    selectedEngineerId,
    setSelectedEngineerId,
  } = useBookingStore()

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isOpenRef = useRef(isOpen)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  const { refetch } = useAvailableEngineers(bookingId ?? '')

  const doRefetch = useCallback(async () => {
    if (!isOpenRef.current) return
    const result = await refetch()
    const engineers = result.data?.engineers ?? []
    if (engineers.length > 0) setAvailableEngineers(engineers)
    setCountdown(COUNTDOWN_SECONDS)
  }, [refetch, setAvailableEngineers])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isOpenRef.current) { clearInterval(intervalRef.current!); return }
      setCountdown((prev) => {
        if (prev <= 1) { doRefetch(); return COUNTDOWN_SECONDS }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [doRefetch])

  // Filter ≤10km, sort by distance
  const engineers = [...(availableEngineers ?? [])]
    .filter((e: any) => e.distance === null || e.distance === undefined || e.distance <= MAX_DISTANCE_KM)
    .sort((a: any, b: any) => {
      if (a.distance == null) return 1
      if (b.distance == null) return -1
      return a.distance - b.distance
    })

  const mins = Math.floor(countdown / 60).toString().padStart(2, '0')
  const secs = (countdown % 60).toString().padStart(2, '0')

  const handleSelect = (engineerId: string) => {
    selectEngineer(
      { bookingId: bookingId ?? '', engineerId },
      {
        onSuccess: () => {
          clearInterval(intervalRef.current!)
          setSelectedEngineerId(engineerId)
          toast.success('Pro Partner selected!')
          setStep(8)
        },
        onError: (err: any) => toast.error(err?.message ?? 'Failed to select engineer'),
      },
    )
  }

  // ── Empty state ──
  if (engineers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-5 bg-white">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
          <HiOutlineClock className="w-8 h-8 text-orange-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-700">Searching for Pro Partners</h3>
          <p className="text-zinc-500 text-sm">
            No professionals found within {MAX_DISTANCE_KM} km yet. Refreshing in {mins}:{secs}.
          </p>
        </div>
        <Button onClick={doRefetch} variant="outline" className="flex items-center gap-2">
          <HiOutlineRefresh className="w-4 h-4" /> Refresh Now
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Header bar ── */}
      <div className="px-5 pt-4 pb-3 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <p className="text-sm font-bold text-neutral-700">
            {engineers.length} Pro Partner{engineers.length > 1 ? 's' : ''} found nearby
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Review their profiles and select one to get started
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping inline-block" />
          <span className="text-zinc-600 text-[11px] font-mono font-semibold">
            {mins}:{secs}
          </span>
          <button
            onClick={doRefetch}
            className="text-blue-700 hover:text-blue-800 transition-colors ml-1"
            title="Refresh now"
          >
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Engineer list ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
        {engineers.map((engineer: any) => (
          <EngineerCard
            key={engineer.id}
            engineer={engineer}
            onSelect={handleSelect}
            isPending={isPending}
            selectedId={(selectVars as any)?.engineerId ?? null}
            currentEngineerId={selectedEngineerId}
          />
        ))}
      </div>
    </div>
  )
}
