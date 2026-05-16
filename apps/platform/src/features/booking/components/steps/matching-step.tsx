'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/store/booking-store'
import { useCreateBooking, useAvailableEngineers, useCancelBooking } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi'
import { Button } from '@resolve/ui'
import { useRouter } from 'next/navigation'

const COUNTDOWN = 15

export const MatchingStep = () => {
  const {
    setStep, priority, serviceId, issueDetails, location, photos,
    setAvailableEngineers, setBookingId, isOpen,
  } = useBookingStore()

  const { mutate: createBooking } = useCreateBooking()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const router = useRouter()

  const hasCalled = useRef(false)
  const isDoneRef = useRef(false)
  const isOpenRef = useRef(isOpen)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isDone, setIsDone] = useState(false)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(COUNTDOWN)
  const [isCreating, setIsCreating] = useState(true)
  const [createResponse, setCreateResponse] = useState<any>(null)
  const [phase, setPhase] = useState<'creating' | 'searching' | 'done' | 'error'>('creating')

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  // Stop interval when modal closes
  useEffect(() => {
    if (!isOpen) clearInterval(intervalRef.current!)
  }, [isOpen])

  const { refetch: refetchEngineers, isFetching: isRefetching } = useAvailableEngineers(
    currentBookingId || ''
  )

  const handleRefresh = async () => {
    if (!currentBookingId || !isOpenRef.current) return
    const result = await refetchEngineers()
    const engineers = result.data?.engineers
    if (engineers?.length > 0) {
      setAvailableEngineers(engineers)
      clearInterval(intervalRef.current!)
      setStep(7)
    }
    setCountdown(COUNTDOWN)
  }

  // Start countdown once bookingId is set
  useEffect(() => {
    if (!currentBookingId) return
    clearInterval(intervalRef.current!)
    intervalRef.current = setInterval(() => {
      if (!isOpenRef.current) { clearInterval(intervalRef.current!); return }
      setCountdown(prev => {
        if (prev <= 1) {
          handleRefresh()
          return COUNTDOWN
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [currentBookingId])

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    const { scheduledDate, scheduledTime } = useBookingStore.getState()

    const doCreate = (lat: number, lng: number) => {
      createBooking({
        serviceId,
        priority: priority?.toLowerCase() as 'emergency' | 'standard',
        issueDetails,
        scheduledDate,
        scheduledTime,
        location: {
          country: location?.country,
          state: location?.state,
          city: location?.city,
          streetAddress: location?.streetAddress,
          nearestLandmark: location?.landmark,
          latitude: lat,
          longitude: lng,
        },
        photos,
      }, {
        onSuccess: (data: any) => {
          setIsCreating(false)
          if (!data.success) {
            setErrorMsg(data.error || 'Failed to create booking')
            setPhase('error')
            return
          }
          setCreateResponse(data)
          const bid = data.data.booking.id
          setBookingId(bid)
          setCurrentBookingId(bid)
          if (data.data.availableEngineers?.length > 0) {
            setAvailableEngineers(data.data.availableEngineers)
            setStep(7)
          } else {
            setAvailableEngineers([])
            isDoneRef.current = true
            setIsDone(true)
            setPhase('done')
          }
        },
        onError: (error: any) => {
          setIsCreating(false)
          const responseData = error?.response?.data
          // If booking was actually created (success:true) but returned non-2xx status
          if (responseData?.success && responseData?.data?.booking) {
            setCreateResponse(responseData)
            const bid = responseData.data.booking.id
            setBookingId(bid)
            setCurrentBookingId(bid)
            setAvailableEngineers([])
            isDoneRef.current = true
            setIsDone(true)
            setPhase('done')
            return
          }
          const msg = responseData?.error || error?.message || 'Failed to create booking'
          setErrorMsg(msg)
          setPhase('error')
        }
      })
    }

    const storedLat = location?.latitude || 0
    const storedLng = location?.longitude || 0

    if (storedLat && storedLng) {
      doCreate(storedLat, storedLng)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doCreate(pos.coords.latitude, pos.coords.longitude),
        () => { toast.error('Cannot create booking because your location is off. Please enable location and try again.'); setStep(5) }
      )
    } else {
      toast.error('Cannot create booking because your location is off. Please enable location and try again.')
      setStep(5)
    }
  }, [])

  const mins = Math.floor(countdown / 60).toString().padStart(2, '0')
  const secs = (countdown % 60).toString().padStart(2, '0')

  const CountdownBar = () => (
    <div className="w-full px-5 py-3 border-b border-zinc-100 flex items-center justify-between shrink-0">
      <span className="text-zinc-500 text-xs">Searching for Pro Partners...</span>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
        <span className="text-zinc-600 text-xs font-mono font-semibold">Refreshing in {mins}:{secs}</span>
        <button onClick={handleRefresh} disabled={isRefetching}
          className="text-blue-700 hover:text-blue-800 transition-colors disabled:opacity-50">
          <HiOutlineRefresh className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )

  if (phase === 'error' || errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-5 bg-white">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <HiOutlineExclamationCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-neutral-700">Booking Failed</h3>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-xs">{errorMsg}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button className="w-full bg-blue-700"
            onClick={() => { setErrorMsg(null); hasCalled.current = false; setStep(5) }}>
            Go Back
          </Button>
          <Button variant="outline" className="w-full"
            onClick={() => { useBookingStore.getState().setIsOpen(false); router.push('/subscriptions') }}>
            Upgrade Plan
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'done' && currentBookingId) {
    return (
      <div className="flex flex-col h-full bg-white">
        <CountdownBar />
        <div className="flex flex-col items-center justify-center flex-1 p-10 text-center gap-5">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
            <HiOutlineExclamationCircle className="w-8 h-8 text-orange-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-700">No Pro Partners found</h3>
            <p className="text-zinc-500 text-sm">Your booking was created. We're still searching nearby.</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={handleRefresh} disabled={isRefetching}
              className="w-full bg-blue-700 flex items-center justify-center gap-2">
              <HiOutlineRefresh className={isRefetching ? 'animate-spin' : ''} />
              {isRefetching ? 'Checking...' : 'Refresh Now'}
            </Button>
            <Button variant="outline" className="w-full"
              onClick={() => { useBookingStore.getState().setIsOpen(false); router.push(`/bookings/${currentBookingId}`) }}>
              View Booking
            </Button>
            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"
              disabled={isCancelling}
              onClick={() => cancelBooking(currentBookingId, {
                onSuccess: () => { useBookingStore.getState().setIsOpen(false); router.push('/bookings') }
              })}>
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {currentBookingId && <CountdownBar />}
      <div className="flex flex-col items-center justify-center flex-1 px-5 space-y-8">
        {phase === 'creating' ? (
          <>
            <div className="w-80 h-60 relative overflow-hidden flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360, y: [0, -10, 0] }}
                transition={{
                  rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="w-20 h-20 relative"
              >
                <div className="absolute left-[33.33px] top-[16.67px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse" />
                <div className="absolute left-[33.33px] top-[50px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-75" />
                <div className="absolute left-[16.67px] top-[33.33px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-150" />
                <div className="absolute left-[50px] top-[33.33px] w-3.5 h-3.5 bg-indigo-200 rounded-full animate-pulse delay-200" />
                <div className="absolute left-[16.67px] top-[33.33px] w-3.5 h-3.5 bg-blue-700 rounded-full animate-ping" />
                <div className="absolute left-[50px] top-[33.33px] w-3.5 h-3.5 bg-blue-700 rounded-full animate-ping delay-150" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">Creating Booking...</h3>
              <p className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5 max-w-[280px]">Please wait while we set up your booking.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-full px-2 py-4 bg-stone-50 rounded-2xl border border-zinc-100 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-semibold text-neutral-700">
                  {createResponse?.message || 'Booking created successfully'}
                </span>
              </div>
              {createResponse?.data?.booking && (
                <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span>Booking ID</span>
                    <span className="font-mono font-semibold text-zinc-700">#{createResponse.data.booking.id?.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="capitalize font-medium text-blue-700">{createResponse.data.booking.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engineers found</span>
                    <span className="font-medium text-zinc-700">{createResponse.data.engineersCount ?? createResponse.data.availableEngineers?.length ?? 0}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">Finding Pro Partner...</h3>
              <p className="text-zinc-600 text-sm font-['Inter'] leading-5 max-w-[280px]">We are matching your request with the best Pro Partner near you.</p>
            </div>
          </>
        )}
        {currentBookingId && (
          <div className="flex flex-col gap-3 w-full px-5">
            <Button variant="outline" className="w-full"
              onClick={() => { useBookingStore.getState().setIsOpen(false); router.push(`/bookings/${currentBookingId}`) }}>
              View Booking
            </Button>
            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50"
              disabled={isCancelling}
              onClick={() => cancelBooking(currentBookingId, {
                onSuccess: () => { useBookingStore.getState().setIsOpen(false); router.push('/bookings') }
              })}>
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
