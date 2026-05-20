'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookingWizard } from './booking-wizard'
import { useBookingStore } from '@/store/booking-store'
import { useRouter } from 'next/navigation'

export function BookingWizardModal() {
  const { isOpen, resetBooking, saveDraft, currentStep, bookingId } = useBookingStore()
  const router = useRouter()

  React.useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow
      const originalHtmlOverflow = document.documentElement.style.overflow
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalBodyOverflow
        document.documentElement.style.overflow = originalHtmlOverflow
      }
    }
  }, [isOpen])

  const handleClose = () => {
    // Save as draft if user is mid-flow and hasn't completed a booking
    if (currentStep > 1 && !bookingId) {
      saveDraft()
    }
    // If a booking was created and a pro was selected (step 8), redirect to messages request tab
    const bid = bookingId
    resetBooking()
    if (bid && currentStep >= 8) {
      router.push(`/messages?tab=Request&bookingId=${bid}`)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex md:items-center md:justify-center md:bg-black/60 md:backdrop-blur-sm md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 hidden md:block"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full h-full md:h-auto md:max-w-[669px] max-h-full overflow-y-auto pointer-events-auto md:rounded-2xl"
          >
            <BookingWizard onClose={handleClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
