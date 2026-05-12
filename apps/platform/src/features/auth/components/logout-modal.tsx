'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoLogOutOutline } from 'react-icons/io5'
import { useSignOut } from '@/hooks/api-hooks'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { mutate: signOut } = useSignOut()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    signOut()
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md px-6 py-8 bg-white rounded-2xl flex flex-col items-center gap-8 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Icon Section */}
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <IoLogOutOutline className="size-8" />
              </div>

              {/* Text Section */}
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-center text-zinc-900 text-2xl font-bold font-heading">
                  Confirm Logout
                </h3>
                <p className="text-center text-zinc-500 text-base font-normal max-w-[280px]">
                  Are you sure you want to log out? You will need to sign in again to access your account.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-blue-700 rounded-xl text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/20"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
