'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HiOutlineStar, HiOutlineBriefcase, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineRefresh } from 'react-icons/hi'
import { IoLocationOutline } from 'react-icons/io5'
import { useBookingStore } from '@/store/booking-store'
import { Button, cn, formatImageUrl } from '@resolve/ui'
import { useSelectEngineer, useAvailableEngineers } from '@/hooks/api-hooks'
import { toast } from 'sonner'

const MAX_DISTANCE_KM = 10
const COUNTDOWN_SECONDS = 15 // 15 seconds

function EngineerCard({ engineer, onSelect, isPending, selectedId, currentEngineerId }: {
  engineer: any
  onSelect: (id: string) => void
  isPending: boolean
  selectedId: string | null
  currentEngineerId: string | null
}) {
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const isSelecting = isPending && selectedId === engineer.id
  const isAlreadySelected = currentEngineerId === engineer.id

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col gap-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {engineer.image ? (
            <img src={formatImageUrl(engineer.image)} alt={engineer.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
              {engineer.name?.[0] || 'P'}
            </div>
          )}
          {/* Online indicator */}
          <span className={cn(
            "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
            engineer.isOnline ? "bg-green-500" : "bg-zinc-400"
          )} title={engineer.isOnline ? "Online" : "Offline"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-700 text-sm font-bold">{engineer.name}</span>
            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded">Pro Verified</span>
          </div>
          <span className="text-zinc-500 text-xs">{engineer.categoryName || engineer.specialty || 'Professional'}</span>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <HiOutlineStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-zinc-600 text-xs font-semibold">{engineer.rating || 0}</span>
              <span className="text-zinc-400 text-xs">({engineer.reviews?.length || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <HiOutlineBriefcase className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-600 text-xs">{engineer.completedJobs || 0} jobs</span>
            </div>
            {engineer.distance !== null && engineer.distance !== undefined && (
              <div className="flex items-center gap-1">
                <IoLocationOutline className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-600 text-xs font-semibold">{engineer.distance}km away</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews toggle */}
      {engineer.reviews?.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setReviewsOpen(v => !v)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-700 transition-colors"
          >
            {reviewsOpen ? <HiOutlineChevronUp className="w-3.5 h-3.5" /> : <HiOutlineChevronDown className="w-3.5 h-3.5" />}
            {reviewsOpen ? 'Hide reviews' : `See ${engineer.reviews.length} review${engineer.reviews.length > 1 ? 's' : ''}`}
          </button>
          {reviewsOpen && (
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 no-scrollbar">
              {engineer.reviews.map((r: any, i: number) => (
                <div key={i} className="p-3 bg-stone-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <HiOutlineStar key={s} className={cn('w-3 h-3', s <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-200')} />
                    ))}
                    <span className="text-zinc-400 text-[10px] ml-1">{r.customerName}</span>
                  </div>
                  <p className="text-zinc-600 text-xs leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Select button */}
      <button
        onClick={() => !isAlreadySelected && onSelect(engineer.id)}
        disabled={isPending || isAlreadySelected}
        className={cn(
          'w-full h-10 rounded-xl text-sm font-semibold transition-all',
          isAlreadySelected
            ? 'bg-emerald-600 text-white cursor-not-allowed'
            : isSelecting
              ? 'bg-blue-700 text-white opacity-70 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-[0.98]'
        )}
      >
        {isAlreadySelected ? '✓ Selected' : isSelecting ? 'Selecting...' : 'Select Pro Partner'}
      </button>
    </div>
  )
}

export const SuccessStep = () => {
  const { mutate: selectEngineer, isPending, variables: selectVars } = useSelectEngineer()
  const { availableEngineers, setAvailableEngineers, setStep, bookingId, isOpen, selectedEngineerId, setSelectedEngineerId } = useBookingStore()
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isOpenRef = useRef(isOpen)

  // Keep ref in sync with store
  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  const { refetch } = useAvailableEngineers(bookingId || '')

  const doRefetch = useCallback(async () => {
    if (!isOpenRef.current) return
    const result = await refetch()
    const engineers = result.data?.engineers || []
    if (engineers.length > 0) setAvailableEngineers(engineers)
    setCountdown(COUNTDOWN_SECONDS)
  }, [refetch, setAvailableEngineers])

  // Countdown + auto-refetch
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isOpenRef.current) {
        clearInterval(intervalRef.current!)
        return
      }
      setCountdown(prev => {
        if (prev <= 1) {
          doRefetch()
          return COUNTDOWN_SECONDS
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [doRefetch])

  // Filter: ≤10km, sort by distance
  const engineers = [...(availableEngineers || [])]
    .filter((e: any) => e.distance === null || e.distance === undefined || e.distance <= MAX_DISTANCE_KM)
    .sort((a: any, b: any) => {
      if (a.distance === null || a.distance === undefined) return 1
      if (b.distance === null || b.distance === undefined) return -1
      return a.distance - b.distance
    })

  const mins = Math.floor(countdown / 60).toString().padStart(2, '0')
  const secs = (countdown % 60).toString().padStart(2, '0')

  const handleSelect = (engineerId: string) => {
    selectEngineer({ bookingId: bookingId || '', engineerId }, {
      onSuccess: () => {
        clearInterval(intervalRef.current!)
        setSelectedEngineerId(engineerId)
        toast.success('Pro Partner selected!')
        setStep(8)
      },
      onError: (err: any) => toast.error(err?.message || 'Failed to select engineer')
    })
  }

  if (engineers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-5 bg-white">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
          <HiOutlineRefresh className="w-8 h-8 text-orange-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-700">Searching for Pro Partners</h3>
          <p className="text-zinc-500 text-sm">No professionals found within {MAX_DISTANCE_KM}km yet. Refreshing in {mins}:{secs}.</p>
        </div>
        <Button onClick={doRefetch} variant="outline" className="flex items-center gap-2">
          <HiOutlineRefresh className="w-4 h-4" /> Refresh Now
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Countdown bar */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-zinc-100">
        <span className="text-zinc-500 text-xs">{engineers.length} Pro Partner{engineers.length > 1 ? 's' : ''} found nearby</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span className="text-zinc-600 text-xs font-mono font-semibold">Refreshing in {mins}:{secs}</span>
          <button onClick={doRefetch} className="text-blue-700 hover:text-blue-800 transition-colors">
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable engineer list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
        {engineers.map((engineer: any) => (
          <EngineerCard
            key={engineer.id}
            engineer={engineer}
            onSelect={handleSelect}
            isPending={isPending}
            selectedId={(selectVars as any)?.engineerId || null}
            currentEngineerId={selectedEngineerId}
          />
        ))}
      </div>
    </div>
  )
}
