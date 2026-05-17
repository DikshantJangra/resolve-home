'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/store/booking-store'
import { useCreateBooking, useAvailableEngineers, useCancelBooking } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi'
import { Button, LoadingSpinner } from '@resolve/ui'
import { useRouter } from 'next/navigation'

const COUNTDOWN = 15

type Phase = 'creating' | 'searching' | 'done' | 'error'

export const MatchingStep = () => {
  const {
    setStep, priority, serviceIds, issueDetails, location, photos,
    setAvailableEngineers, setBookingId, isOpen, clearActiveDraft,
  } = useBookingStore()

  const { mutateAsync: createBooking } = useCreateBooking()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const router = useRouter()

  const hasCalled = useRef(false)
  const isOpenRef = useRef(isOpen)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [phase, setPhase] = useState<Phase>('creating')
  const [bookingId, setLocalBookingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(COUNTDOWN)
  const [bookingData, setBookingData] = useState<any>(null)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])
  useEffect(() => { if (!isOpen) clearInterval(intervalRef.current!) }, [isOpen])

  const { refetch: refetchEngineers, isFetching: isRefetching } = useAvailableEngineers(bookingId || '')

  const handleRefresh = async () => {
    if (!bookingId) return
    try {
      const result = await refetchEngineers()
      const engineers = result.data?.engineers
      if (engineers && engineers.length > 0) {
        setAvailableEngineers(engineers)
        clearInterval(intervalRef.current!)
        setStep(7)
        toast.success(`Successfully matched with ${engineers.length} Pro Partner(s)!`)
      } else {
        toast.info("Still searching for Pro Partners... We will notify you as soon as someone is available.")
      }
    } catch (err) {
      toast.error("Failed to check for partners. Please try again.")
    }
    setCountdown(COUNTDOWN)
  }

  // Start countdown once bookingId is set
  useEffect(() => {
    if (!bookingId) return
    clearInterval(intervalRef.current!)
    intervalRef.current = setInterval(() => {
      if (!isOpenRef.current) { clearInterval(intervalRef.current!); return }
      setCountdown(prev => {
        if (prev <= 1) { handleRefresh(); return COUNTDOWN }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [bookingId])

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    const { scheduledDate, scheduledTime, serviceIds: freshServiceIds } = useBookingStore.getState()

    const doCreate = async (lat: number, lng: number) => {
      try {
        const data = await createBooking({
          serviceIds: freshServiceIds,
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
        })

        const bid = data?.data?.booking?.id
        if (!bid) {
          setErrorMsg(data?.error || 'Booking creation failed')
          setPhase('error')
          return
        }

        setBookingData(data)
        setBookingId(bid)
        setLocalBookingId(bid)
        clearActiveDraft() // remove draft now that booking is created

        if (data?.data?.availableEngineers?.length > 0) {
          setAvailableEngineers(data.data.availableEngineers)
          setStep(7)
        } else {
          setAvailableEngineers([])
          setPhase('done')
        }
      } catch (error: any) {
        const responseData = error?.response?.data
        // Booking may have been created even if status was non-2xx
        const bid = responseData?.data?.booking?.id
        if (responseData?.success && bid) {
          setBookingData(responseData)
          setBookingId(bid)
          setLocalBookingId(bid)
          clearActiveDraft()
          setAvailableEngineers([])
          setPhase('done')
          return
        }
        const msg = responseData?.error || error?.message || 'Failed to create booking'
        setErrorMsg(msg)
        setPhase('error')
      }
    }

    const storedLat = location?.latitude || 0
    const storedLng = location?.longitude || 0

    if (storedLat && storedLng) {
      doCreate(storedLat, storedLng)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doCreate(pos.coords.latitude, pos.coords.longitude),
        () => { toast.error('Location is off. Please enable it and try again.'); setStep(5) }
      )
    } else {
      toast.error('Location is off. Please enable it and try again.')
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

  if (phase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-5 bg-white rounded-2xl">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <HiOutlineExclamationCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-neutral-700">Booking Failed</h3>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-xs">{errorMsg}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button className="w-full bg-blue-700 rounded-xl"
            onClick={() => { setErrorMsg(null); hasCalled.current = false; setPhase('creating'); setStep(5) }}>
            Go Back
          </Button>
          <Button variant="outline" className="w-full rounded-xl"
            onClick={() => { useBookingStore.getState().setIsOpen(false); router.push('/subscriptions') }}>
            Upgrade Plan
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'done' && bookingId) {
    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
        <CountdownBar />
        <div className="flex flex-col items-center justify-center flex-1 p-10 text-center gap-5">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
            <HiOutlineExclamationCircle className="w-8 h-8 text-orange-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-700">No Pro Partners found yet</h3>
            <p className="text-zinc-500 text-sm">Your booking is live. We're still searching nearby.</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={handleRefresh} disabled={isRefetching}
              className="w-full bg-blue-700 rounded-xl flex items-center justify-center gap-2">
              <HiOutlineRefresh className={isRefetching ? 'animate-spin' : ''} />
              {isRefetching ? 'Checking...' : 'Refresh Now'}
            </Button>
            <Button variant="outline" className="w-full rounded-xl"
              onClick={() => { useBookingStore.getState().setIsOpen(false); router.push(`/bookings/${bookingId}`) }}>
              View Booking
            </Button>
            <Button variant="outline" className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              disabled={isCancelling}
              onClick={() => cancelBooking(bookingId, {
                onSuccess: () => { useBookingStore.getState().setIsOpen(false); router.push('/bookings') }
              })}>
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // creating phase
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl">
      <div className="flex flex-col items-center justify-center flex-1 px-5 space-y-8">
        <div className="w-80 h-60 relative overflow-hidden flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Outer Ripple */}
            <motion.div
              className="absolute w-36 h-36 rounded-full border border-blue-100 bg-blue-50/10"
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Inner Ripple */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border border-blue-200 bg-blue-50/30"
              animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Core Spinner Ring */}
            <div className="relative w-16 h-16 bg-white rounded-full shadow-md border border-zinc-100/80 flex items-center justify-center z-10">
              <LoadingSpinner className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Creating Booking...</h3>
          <p className="text-zinc-600 text-sm font-inter leading-5 max-w-[280px]">Please wait while we set up your booking.</p>
        </div>
      </div>
    </div>
  )
}
