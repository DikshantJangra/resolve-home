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
  const [bioExpanded, setBioExpanded] = useState(false)
  const isSelecting = isPending && selectedId === engineer.id
  const isAlreadySelected = currentEngineerId === engineer.id

  const aboutText = engineer.aboutMe || "No introduction provided yet by this Pro Partner."
  const isLongBio = aboutText.length > 180

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 md:p-6 flex flex-col gap-4 md:gap-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Premium Desktop Grid & Mobile Layout */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-5 md:gap-6 items-start">
        
        {/* Column 1: Profile & Actions */}
        <div className="flex md:flex-col items-center md:items-start gap-4 md:col-span-4 w-full border-b md:border-b-0 pb-4 md:pb-0 border-zinc-100">
          <div className="relative shrink-0">
            {engineer.image ? (
              <img src={formatImageUrl(engineer.image)} alt={engineer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold border-2 border-white shadow-md">
                {engineer.name?.[0] || 'P'}
              </div>
            )}
            {/* Online indicator */}
            <span className={cn(
              "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white",
              engineer.isOnline ? "bg-green-500" : "bg-zinc-400"
            )} title={engineer.isOnline ? "Online" : "Offline"} />
          </div>
          
          <div className="flex-1 min-w-0 md:space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-700 text-base font-bold tracking-tight">{engineer.name}</span>
              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-extrabold uppercase rounded tracking-wider">Pro Verified</span>
            </div>
            
            <p className="text-blue-700 text-xs font-semibold">{engineer.categoryName || engineer.specialty || 'Professional Partner'}</p>
            
            {engineer.distance !== null && engineer.distance !== undefined && (
              <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1">
                <IoLocationOutline className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-zinc-650">{engineer.distance}km away</span>
              </div>
            )}
          </div>
          
          {/* Action Select Button (For tablet & desktop, hidden on mobile to show at bottom) */}
          <div className="hidden md:block w-full pt-3">
            <button
              onClick={() => !isAlreadySelected && onSelect(engineer.id)}
              disabled={isPending || isAlreadySelected}
              className={cn(
                'w-full h-11 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2',
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
        </div>

        {/* Column 2: Stats (Desktop 2cols, Mobile horizontal row) */}
        <div className="md:col-span-2 flex flex-col gap-1 w-full">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider hidden md:block">Stats</span>
          <div className="flex flex-row md:flex-col gap-6 md:gap-3 w-full bg-zinc-50 md:bg-transparent p-3 md:p-0 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider md:hidden">Jobs Done</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <HiOutlineBriefcase className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-700 text-xs font-semibold">{engineer.completedJobs || 0} completed</span>
              </div>
            </div>
            
            <div className="flex flex-col border-l md:border-l-0 pl-6 md:pl-0">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider md:hidden">Rating</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <HiOutlineStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-zinc-700 text-xs font-semibold">{engineer.rating || 0} ({engineer.reviews?.length || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Qualifications (Desktop 3cols, Mobile standard) */}
        <div className="md:col-span-3 flex flex-col gap-1.5 w-full">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Services Offered</span>
          <div className="flex flex-wrap gap-1.5">
            {engineer.assignedServicesDetail?.length > 0 ? (
              engineer.assignedServicesDetail.map((s: any) => (
                <span key={s.id} className="text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors px-2.5 py-1 rounded-md">
                  {s.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400 italic">General {engineer.categoryName || 'Service'}</span>
            )}
          </div>
        </div>

        {/* Column 4: Details / About me (Desktop 3cols, Mobile standard) */}
        <div className="md:col-span-3 flex flex-col gap-1.5 w-full">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">About me</span>
          <div className="text-xs text-zinc-650 leading-relaxed space-y-1">
            <p className="whitespace-pre-line">
              {bioExpanded || !isLongBio ? aboutText : `${aboutText.slice(0, 180)}...`}
            </p>
            {isLongBio && (
              <button
                onClick={() => setBioExpanded(!bioExpanded)}
                className="text-blue-700 font-bold hover:text-blue-800 transition-colors inline-block focus:outline-none mt-1 cursor-pointer"
              >
                {bioExpanded ? 'View less' : 'View more'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Select button (Mobile only - hidden on desktop) */}
      <div className="md:hidden w-full pt-1">
        <button
          onClick={() => !isAlreadySelected && onSelect(engineer.id)}
          disabled={isPending || isAlreadySelected}
          className={cn(
            'w-full h-11 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2',
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
