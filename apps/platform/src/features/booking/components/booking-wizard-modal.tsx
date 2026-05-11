'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookingWizard } from './booking-wizard'
import { useBookingStore } from '@/store/booking-store'

export function BookingWizardModal() {
  const { isOpen, setIsOpen, resetBooking } = useBookingStore()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              // Only close if we are at step 1 or 8 (Success)
              // Actually, better to let the wizard handle its own close logic via the header
              // but we need a way to close the modal if clicked outside
              // For now, let's just make the backdrop clickable to close
              resetBooking()
            }}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[669px] pointer-events-auto"
          >
            <BookingWizard />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
