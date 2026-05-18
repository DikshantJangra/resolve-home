'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { cn } from "@resolve/ui"
import { 
  HiOutlineLocationMarker
} from 'react-icons/hi'
import { useEngineerLocationTracker, useUserProfile, useAuthSession } from '@/hooks/api-hooks'
import { VerificationRequired } from '@/features/professional-setup/components/verification-required'
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'
import { createPortal } from 'react-dom'

function LocationPermissionModal({ onAllow, onDismiss }: { onAllow: () => void, onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <HiOutlineLocationMarker className="w-8 h-8 text-blue-700" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-neutral-700 text-lg font-bold">Enable Location</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              ResolvHome needs your location to match you with nearby bookings and show your availability to homeowners.
            </p>
          </div>
          <div className="w-full flex flex-col gap-2 pt-2">
            <button
              onClick={onAllow}
              className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Allow Location Access
            </button>
            <button
              onClick={onDismiss}
              className="w-full h-11 border border-zinc-200 text-zinc-500 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locationGranted, setLocationGranted] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: session, isPending: isSessionPending } = useAuthSession()
  const { data: userProfile, isPending: isProfilePending } = useUserProfile()

  useEngineerLocationTracker(locationGranted)

  useEffect(() => {
    setMounted(true)
    if (!navigator.geolocation) return
    navigator.permissions?.query({ name: 'geolocation' as PermissionName }).then(result => {
      if (result.state === 'granted') {
        setLocationGranted(true)
      } else if (result.state === 'prompt') {
        setShowLocationModal(true)
      }
    }).catch(() => {
      setShowLocationModal(true)
    })
  }, [])

  const handleAllowLocation = () => {
    setShowLocationModal(false)
    navigator.geolocation.getCurrentPosition(
      () => setLocationGranted(true),
      () => {}
    )
  }

  const user = userProfile?.user || session?.user
  const isVerified = !!(
    (user as any)?.isVerified || 
    (user as any)?.status === 'verified' || 
    userProfile?.engineerProfile?.verificationStatus === 'approved' ||
    userProfile?.engineerProfile?.isVerified ||
    userProfile?.engineerProfile?.approvedAt
  )

  const isPendingVerification = userProfile?.engineerProfile?.verificationStatus === 'pending'
  const [isSetupOpen, setIsSetupOpen] = useState(false)

  const isPending = isSessionPending || isProfilePending

  useEffect(() => {
    if (!isVerified && isSetupOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVerified, isSetupOpen])

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {showLocationModal && (
        <LocationPermissionModal
          onAllow={handleAllowLocation}
          onDismiss={() => setShowLocationModal(false)}
        />
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-[1001] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-[1001]",
        isSidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none lg:translate-x-0 lg:pointer-events-auto"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 flex-grow">
          <div className="max-w-[1440px] mx-auto">
            {isPending ? (
              <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 animate-bounce" />
                  <div className="h-4 w-32 bg-zinc-200 rounded" />
                </div>
              </div>
            ) : !isVerified ? (
              isPendingVerification ? (
                <div className="flex items-start justify-center pt-10 pb-20 max-w-2xl mx-auto w-full">
                  <ProfessionalSetupWizard onComplete={() => {}} />
                </div>
              ) : (
                <div className="relative min-h-[60vh] flex items-center justify-center w-full">
                  <VerificationRequired onVerify={() => setIsSetupOpen(true)} />
                  
                  {isSetupOpen && mounted && createPortal(
                    <div className="fixed inset-0 z-[1000] flex items-start justify-center sm:pt-10 sm:pb-20 overflow-y-auto bg-white/10 backdrop-blur-md">
                      <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} isModal={true} />
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              )
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
