'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { cn } from "@resolve/ui"
import { 
  HiOutlineBriefcase, 
  HiOutlineClipboardList, 
  HiOutlineChatAlt, 
  HiOutlineUser, 
  HiOutlineCreditCard, 
  HiOutlineCog,
  HiOutlineLocationMarker
} from 'react-icons/hi'
import { useEngineerLocationTracker } from '@/hooks/api-hooks'

const engineerSidebarItems = [
  { label: 'Jobs Feed', icon: HiOutlineBriefcase, href: '/engineer' },
  { label: 'Active Jobs', icon: HiOutlineClipboardList, href: '/engineer/jobs', requiresVerification: true },
  { label: 'Messages', icon: HiOutlineChatAlt, href: '/messages', requiresVerification: true },
  { label: 'Earnings', icon: HiOutlineCreditCard, href: '/wallet', requiresVerification: true },
  { label: 'My Profile', icon: HiOutlineUser, href: '/profile' },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings' },
]

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

  useEngineerLocationTracker(locationGranted)

  useEffect(() => {
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
        "fixed inset-y-0 left-0 z-[100] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-[100]",
        isSidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} items={engineerSidebarItems} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 flex-grow">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
