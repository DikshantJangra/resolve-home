'use client'

import React, { useState, useEffect } from 'react'
import {
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineCog,
  HiOutlineDeviceMobile,
  HiOutlineDesktopComputer
} from 'react-icons/hi'
import { Button } from '@resolve/ui'

interface LocationBlockedModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
  isRetrying?: boolean
}

type TabType = 'chrome-desktop' | 'safari-desktop' | 'ios' | 'android'

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return /iphone|ipad|ipod|android/i.test(window.navigator.userAgent)
}

// Visual: browser address bar with location icon
const BrowserAddressBarHint = ({ platform }: { platform: 'ios' | 'android' }) => (
  <div className="bg-zinc-900 rounded-2xl p-3 mb-4 select-none">
    <div className="flex items-center gap-2 bg-zinc-700 rounded-xl px-3 py-2">
      {/* lock icon */}
      <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
      <span className="text-zinc-300 text-xs flex-1 truncate">resolvehome.com</span>
      {/* location dot - the thing users need to tap */}
      <div className="flex items-center gap-1 bg-red-500/20 border border-red-400/50 rounded-lg px-2 py-0.5 animate-pulse">
        <HiOutlineLocationMarker className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span className="text-red-300 text-[10px] font-semibold">Blocked</span>
      </div>
    </div>
    <p className="text-zinc-400 text-[10px] text-center mt-2">
      {platform === 'ios' ? 'Tap the location icon in your browser address bar' : 'Tap the lock icon → Site Settings → Location'}
    </p>
  </div>
)

export const LocationBlockedModal: React.FC<LocationBlockedModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  isRetrying = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chrome-desktop')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const mobile = isMobileDevice()
    setIsMobile(mobile)
    const ua = window.navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveTab('ios')
    } else if (/android/.test(ua)) {
      setActiveTab('android')
    } else if (/safari/.test(ua) && !/chrome/.test(ua) && !/chromium/.test(ua)) {
      setActiveTab('safari-desktop')
    } else {
      setActiveTab('chrome-desktop')
    }
  }, [isOpen])

  if (!isOpen) return null

  const desktopTabs = [
    { id: 'chrome-desktop' as TabType, label: 'Chrome', icon: HiOutlineDesktopComputer },
    { id: 'safari-desktop' as TabType, label: 'Safari (Mac)', icon: HiOutlineDesktopComputer },
  ]

  const mobileTabs = [
    { id: 'ios' as TabType, label: 'iPhone / iPad', icon: HiOutlineDeviceMobile },
    { id: 'android' as TabType, label: 'Android', icon: HiOutlineDeviceMobile },
  ]

  const tabs = isMobile ? mobileTabs : [...desktopTabs, ...mobileTabs]

  // Mobile: bottom sheet; Desktop: centered modal
  const containerClass = isMobile
    ? 'fixed inset-0 z-[1000] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'
    : 'fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'

  const sheetClass = isMobile
    ? 'bg-white rounded-t-3xl w-full shadow-2xl flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom duration-300'
    : 'bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-150 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'

  return (
    <div className={containerClass}>
      <div className={sheetClass}>

        {/* Drag handle on mobile */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-zinc-300" />
          </div>
        )}

        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 border border-red-100">
              <HiOutlineLocationMarker className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-neutral-800 text-base font-bold">Location Access Blocked</h3>
              <p className="text-zinc-500 text-xs mt-0.5 font-medium">Allow location to find your address automatically.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600 cursor-pointer shrink-0"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-zinc-50 px-3 pt-2 pb-0 border-b border-zinc-150 flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'bg-white text-blue-700 border-blue-600 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 border-transparent hover:bg-zinc-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          {activeTab === 'chrome-desktop' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <Step n={1} text={<>Look at the <strong className="text-zinc-800">top-left</strong> of your browser in the address bar.</>} />
              <Step n={2} text={<>Click the <strong className="text-zinc-800 inline-flex items-center gap-1"><HiOutlineCog className="w-4 h-4 text-blue-700 inline" /> Lock / Settings</strong> icon next to the URL.</>} />
              <Step n={3} text={<>Find <strong className="text-zinc-800">Location</strong> in the dropdown and set it to <strong className="text-green-700">Allow</strong>.</>} />
              <Step n={4} text={<>Reload the page (<strong className="text-zinc-800">Ctrl+R</strong> / <strong className="text-zinc-800">Cmd+R</strong>) and tap <strong className="text-zinc-800">Try Again</strong>.</>} />
            </div>
          )}

          {activeTab === 'safari-desktop' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <Step n={1} text={<>Click <strong className="text-zinc-800">Safari</strong> in the Apple menu bar → <strong className="text-zinc-800">Settings...</strong></>} />
              <Step n={2} text={<>Go to the <strong className="text-zinc-800">Websites</strong> tab.</>} />
              <Step n={3} text={<>Select <strong className="text-zinc-800">Location</strong> from the left list.</>} />
              <Step n={4} text={<>Find this site and change its permission to <strong className="text-green-700">Allow</strong>.</>} />
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <BrowserAddressBarHint platform="ios" />

              {/* Quick fix: tap the icon in address bar */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5">
                <p className="text-blue-800 text-xs font-semibold mb-0.5">Quick fix — tap the icon in your browser</p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Look at the top of your browser — tap the <strong>location or lock icon</strong> in the address bar and choose <strong>Allow Location Access</strong>.
                </p>
              </div>

              <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wide px-1">Or enable from iPhone Settings</p>

              <Step n={1} text={<>Open the <strong className="text-zinc-800">Settings</strong> app on your iPhone or iPad.</>} />
              <Step n={2} text={<>Tap <strong className="text-zinc-800">Privacy & Security</strong> → <strong className="text-zinc-800">Location Services</strong>.</>} />
              <Step n={3} text={<>Make sure <strong className="text-zinc-800">Location Services</strong> is toggled <strong className="text-zinc-800">ON</strong>.</>} />
              <Step n={4} text={<>Scroll down, find <strong className="text-zinc-800">Safari</strong> (or your browser), and set it to <strong className="text-green-700">While Using the App</strong>.</>} />
              <Step n={5} text={<>Come back here and tap <strong className="text-zinc-800">Try Again</strong> below.</>} />
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <BrowserAddressBarHint platform="android" />

              {/* Quick fix */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5">
                <p className="text-blue-800 text-xs font-semibold mb-0.5">Quick fix — tap the lock icon in Chrome</p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Tap the <strong>lock icon</strong> at the top left of the address bar → <strong>Site Settings</strong> → <strong>Location</strong> → set to <strong>Allow</strong>.
                </p>
              </div>

              <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wide px-1">Or enable from Android Settings</p>

              <Step n={1} text={<>Open your phone <strong className="text-zinc-800">Settings</strong> → <strong className="text-zinc-800">Location</strong> and make sure it&apos;s turned <strong className="text-zinc-800">ON</strong>.</>} />
              <Step n={2} text={<>In Chrome, tap the <strong className="text-zinc-800">three-dot menu ⋮</strong> → <strong className="text-zinc-800">Settings</strong>.</>} />
              <Step n={3} text={<>Tap <strong className="text-zinc-800">Site Settings</strong> → <strong className="text-zinc-800">Location</strong>, then find and unblock this site.</>} />
              <Step n={4} text={<>Come back here and tap <strong className="text-zinc-800">Try Again</strong> below.</>} />
            </div>
          )}

          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 mt-1">
            <h4 className="text-neutral-800 text-xs font-semibold mb-1 flex items-center gap-1.5">
              <HiOutlineCog className="w-4 h-4 text-zinc-500" /> Why do we need this?
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              We use your GPS coordinates to fill in your address automatically and help nearby engineers find your home accurately.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={`border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-3 ${isMobile ? 'p-4 pb-[max(1rem,env(safe-area-inset-bottom))]' : 'p-5'}`}>
          <Button
            type="button"
            onClick={onRetry}
            isLoading={isRetrying}
            className="flex-1 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 border-none shadow-none text-sm cursor-pointer"
          >
            {!isRetrying && <HiOutlineRefresh className="w-4 h-4 shrink-0" />}
            I&apos;ve allowed it, Try Again
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 text-sm cursor-pointer"
          >
            Enter Location Manually
            <HiOutlineChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

      </div>
    </div>
  )
}

function Step({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{n}</span>
      <p className="text-zinc-600 text-sm leading-relaxed">{text}</p>
    </div>
  )
}
