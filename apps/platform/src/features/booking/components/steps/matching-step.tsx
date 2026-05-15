'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/store/booking-store'
import { useCreateBooking, useAvailableEngineers, useCancelBooking } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi'
import { Button } from '@resolve/ui'
import { useRouter } from 'next/navigation'

export const MatchingStep = () => {
  const {
    setStep,
    priority,
    serviceId,
    issueDetails,
    location,
    photos,
    setAvailableEngineers,
    setBookingId,
  } = useBookingStore()

  const { mutate: createBooking } = useCreateBooking()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const router = useRouter()

  // Use refs so remounts don't reset state
  const hasCalled = useRef(false)
  const isDoneRef = useRef(false)
  const [isDone, setIsDone] = useState(false)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    const { scheduledDate, scheduledTime } = useBookingStore.getState()

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
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
      },
      photos,
    }, {
      onSuccess: (data: any) => {
        if (data.success) {
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
          }
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create booking')
        setStep(5)
      }
    })
  }, [])

  const hasGps = (location?.latitude ?? 0) !== 0

  const { refetch: refetchEngineers, isFetching: isRefetching } = useAvailableEngineers(
    isDone && currentBookingId && hasGps ? currentBookingId : ''
  )

  const handleRefresh = async () => {
    if (!currentBookingId || !hasGps) {
      toast.error('GPS location required to find nearby professionals.')
      return
    }
    const result = await refetchEngineers()
    const engineers = result.data?.engineers
    if (engineers?.length > 0) {
      setAvailableEngineers(engineers)
      setStep(7)
    } else {
      toast.error('Still no Pro Partners found nearby.')
    }
  }

  if (isDone && currentBookingId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-5 bg-white">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
          <HiOutlineExclamationCircle className="w-8 h-8 text-orange-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-neutral-700">No Pro Partners found</h3>
          <p className="text-zinc-500 text-sm">Your booking was created but no professionals are available near you right now.</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="w-full bg-blue-700 flex items-center justify-center gap-2"
          >
            <HiOutlineRefresh className={isRefetching ? 'animate-spin' : ''} />
            {isRefetching ? 'Checking...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              useBookingStore.getState().setIsOpen(false)
              router.push(`/bookings/${currentBookingId}`)
            }}
          >
            View Booking
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
            disabled={isCancelling}
            onClick={() => {
              cancelBooking(currentBookingId, {
                onSuccess: () => {
                  useBookingStore.getState().setIsOpen(false)
                  router.push('/bookings')
                }
              })
            }}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-5 space-y-10 bg-white">
      <div className="w-80 h-72 relative overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            y: [0, -10, 0]
          }}
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
        <h3 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
          Finding Pro Partner...
        </h3>
        <p className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5 max-w-[280px]">
          We are matching your request with the best Pro Partner near you.
        </p>
      </div>
    </div>
  )
}
