'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter()

  const handleLogout = async () => {
    // In a real app, you'd call your logout API here
    // For now, we'll just clear local storage and redirect
    localStorage.removeItem('auth_token')
    toast.success('Logged out successfully')
    router.push('/')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-96 px-6 py-8 bg-white rounded-xl flex flex-col justify-start items-center gap-10 overflow-hidden shadow-2xl"
          >
            <div className="w-80 flex flex-col justify-start items-center gap-4">
              {/* Icon Section */}
              <div className="w-14 h-14 relative bg-amber-600/10 rounded-[300px] overflow-hidden">
                <div className="w-6 h-6 left-[18px] top-[18px] absolute">
                  <div className="w-5 h-5 left-[2px] top-[2px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-amber-600" />
                  <div className="w-0 h-[5px] left-[12px] top-[8px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-amber-600" />
                  <div className="w-[0.01px] h-px left-[11.99px] top-[16px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-amber-600" />
                  <div className="w-6 h-6 left-0 top-0 absolute opacity-0" />
                </div>
              </div>

              {/* Text Section */}
              <div className="self-stretch flex flex-col justify-start items-center gap-[5px]">
                <h3 className="w-64 text-center justify-start text-neutral-700 text-2xl font-semibold font-heading leading-8">
                  Are you sure you want to log out?
                </h3>
                <p className="self-stretch text-center justify-start text-zinc-600 text-base font-normal font-inter leading-6">
                  You are about to log out of your account, are you sure you want log out.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="self-stretch inline-flex justify-start items-start gap-5">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-blue-700 flex justify-center items-center text-blue-700 text-sm font-medium font-inter leading-5 hover:bg-blue-50 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-blue-700 rounded-xl flex justify-center items-center text-neutral-50 text-sm font-medium font-inter leading-5 hover:bg-blue-800 transition-colors"
              >
                Yes, Log out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
