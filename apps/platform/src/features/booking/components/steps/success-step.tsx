'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HiOutlineStar, HiOutlineBriefcase, HiOutlineRefresh } from 'react-icons/hi'
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
  const [confirming, setConfirming] = useState(false)
  const isSelecting = isPending && selectedId === engineer.id
  const isAlreadySelected = currentEngineerId === engineer.id

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col gap-4 shadow-sm">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          {engineer.image ? (
            <img src={formatImageUrl(engineer.image)} alt={engineer.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
              {engineer.name?.[0] || 'P'}
            </div>
          )}
          <span className={cn(
            "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white",
            engineer.isOnline ? "bg-green-500" : "bg-zinc-400"
          )} title={engineer.isOnline ? "Online" : "Offline"} />
        </div>

        {/* Name + badge + stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-700 text-sm font-bold uppercase">{engineer.name}</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 border border-orange-400 text-orange-500 text-[9px] font-bold rounded">
              ✦ PRO VERIFIED
            </span>
          </div>
          <span className="text-blue-600 text-xs font-medium">Professional Partner</span>

          {/* Rating row */}
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(s => (
              <HiOutlineStar key={s} className={cn('w-3 h-3', s <= Math.round(engineer.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-200')} />
            ))}
            <span className="text-zinc-500 text-xs ml-1">{(engineer.rating || 0).toFixed(1)} ({engineer.reviews?.length || 0})</span>
          </div>
        </div>

        {/* Jobs done + rating boxes */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="flex flex-col items-center bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 min-w-[64px]">
            <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wide">Jobs Done</span>
            <div className="flex items-center gap-1 mt-0.5">
              <HiOutlineBriefcase className="w-3 h-3 text-zinc-500" />
              <span className="text-sm font-bold text-neutral-700">{engineer.completedJobs || 0}</span>
            </div>
          </div>
          <div className="flex flex-col items-center bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 min-w-[64px]">
            <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wide">Rating</span>
            <div className="flex items-center gap-1 mt-0.5">
              <HiOutlineStar className="w-3 h-3 text-zinc-500" />
              <span className="text-sm font-bold text-neutral-700">
                {engineer.rating ? engineer.rating.toFixed(1) : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Distance + Address */}
      {(engineer.distance !== null && engineer.distance !== undefined) || engineer.location?.city ? (
        <div className="flex items-center gap-2 flex-wrap">
          <IoLocationOutline className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          {engineer.distance !== null && engineer.distance !== undefined && (
            <span className="text-blue-600 text-xs font-semibold">{engineer.distance}km away</span>
          )}
          {engineer.location?.city && (
            <>
              {engineer.distance !== null && engineer.distance !== undefined && (
                <span className="text-zinc-300 text-xs">·</span>
              )}
              <span className="text-zinc-500 text-xs">
                {[engineer.location.city, engineer.location.state].filter(Boolean).join(', ')}
              </span>
            </>
          )}
        </div>
      ) : null}

      {/* Services + Bio */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-100">
        {/* Services offered */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wide">Services Offered</span>
          {(engineer.assignedServicesDetail?.length > 0 || engineer.services?.length > 0) ? (
            <div className="flex flex-wrap gap-1">
              {(engineer.assignedServicesDetail?.length > 0
                ? engineer.assignedServicesDetail.map((s: any) => s.name)
                : engineer.services
              ).map((name: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] rounded-full border border-zinc-200">
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-zinc-400 text-xs italic">Not specified</span>
          )}
        </div>

        {/* About me */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wide">About Me</span>
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
            {engineer.aboutMe || engineer.bio || 'No introduction provided yet by this Pro Partner.'}
          </p>
        </div>
      </div>

      {/* Reviews */}
      {engineer.reviews?.length > 0 && (
        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1 no-scrollbar border-t border-zinc-100 pt-2">
          {engineer.reviews.slice(0, 2).map((r: any, i: number) => (
            <div key={i} className="p-2.5 bg-stone-50 rounded-xl border border-zinc-100">
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

      {/* Select / Confirm buttons */}
      {confirming ? (
        <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-neutral-700 text-center">
            Confirm <span className="text-blue-700">{engineer.name}</span> as your Pro Partner?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 h-9 rounded-xl text-sm font-semibold border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={() => { setConfirming(false); onSelect(engineer.id) }}
              disabled={isSelecting}
              className="flex-1 h-9 rounded-xl text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSelecting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Selecting...
                </>
              ) : 'Confirm'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => !isAlreadySelected && setConfirming(true)}
          disabled={isPending || isAlreadySelected}
          className={cn(
            'w-full h-10 rounded-xl text-sm font-semibold transition-all',
            isAlreadySelected
              ? 'bg-emerald-600 text-white cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-[0.98]'
          )}
        >
          {isAlreadySelected ? '✓ Selected' : 'Select Pro Partner'}
        </button>
      )}
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

  // Fetch engineers on mount if list is empty (e.g. coming back from FinalSuccessStep)
  useEffect(() => {
    if (availableEngineers.length === 0 && bookingId) {
      doRefetch()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  // Show all engineers, sort by distance (nulls last)
  const engineers = [...(availableEngineers || [])]
    .sort((a: any, b: any) => {
      if (a.distance === null || a.distance === undefined) return 1
      if (b.distance === null || b.distance === undefined) return -1
      return a.distance - b.distance
    })

  const mins = Math.floor(countdown / 60).toString().padStart(2, '0')
  const secs = (countdown % 60).toString().padStart(2, '0')

  const handleSelect = (engineerId: string) => {
    toast.loading('Selecting Pro Partner...', { id: 'select-engineer' })
    selectEngineer({ bookingId: bookingId || '', engineerId }, {
      onSuccess: () => {
        toast.dismiss('select-engineer')
        clearInterval(intervalRef.current!)
        setSelectedEngineerId(engineerId)
        toast.success('Pro Partner selected!')
        setStep(8)
      },
      onError: (err: any) => {
        toast.dismiss('select-engineer')
        toast.error(err?.message || 'Failed to select engineer')
      }
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
