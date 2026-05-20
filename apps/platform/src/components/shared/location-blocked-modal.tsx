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

export const LocationBlockedModal: React.FC<LocationBlockedModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  isRetrying = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chrome-desktop')

  // Auto-detect browser/OS to default to correct instructions
  useEffect(() => {
    if (!isOpen) return
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

  const tabs = [
    { id: 'chrome-desktop' as TabType, label: 'Chrome (Desktop)', icon: HiOutlineDesktopComputer },
    { id: 'safari-desktop' as TabType, label: 'Safari (Mac)', icon: HiOutlineDesktopComputer },
    { id: 'ios' as TabType, label: 'iOS Safari / Chrome', icon: HiOutlineDeviceMobile },
    { id: 'android' as TabType, label: 'Android Chrome', icon: HiOutlineDeviceMobile },
  ]

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-150 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 border border-red-100">
              <HiOutlineLocationMarker className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-neutral-800 text-lg font-bold">Location Access Blocked</h3>
              <p className="text-zinc-500 text-xs mt-0.5 font-medium">Please allow location permissions to find exact service address.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="bg-zinc-50 p-2 border-b border-zinc-150 flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-white text-blue-700 shadow-sm border border-zinc-200/50' 
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Instructions Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {activeTab === 'chrome-desktop' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Look at the top left of your browser, in the address bar (where the URL is listed).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Click the <strong className="text-zinc-850 font-semibold inline-flex items-center gap-1"><HiOutlineCog className="w-4 h-4 text-blue-700 inline" /> Lock / Settings</strong> icon next to the website URL.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Locate <strong className="text-zinc-850 font-semibold">Location</strong> in the drop-down menu and toggle it to <strong className="text-green-700 font-semibold">Allow</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Reload the page (press <strong className="text-zinc-850 font-semibold">Cmd+R</strong> on Mac or <strong className="text-zinc-850 font-semibold">Ctrl+R</strong> on Windows) and click <strong className="text-zinc-850 font-semibold">Try Again</strong> below!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'safari-desktop' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Click on <strong className="text-zinc-850 font-semibold">Safari</strong> in the top Apple menu bar, then choose <strong className="text-zinc-850 font-semibold">Settings...</strong> (or Preferences).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Go to the <strong className="text-zinc-850 font-semibold">Websites</strong> tab at the top of the settings panel.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Select <strong className="text-zinc-850 font-semibold">Location</strong> from the list on the left side.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Find this site in the list of websites on the right and change the dropdown permission to <strong className="text-green-700 font-semibold">Allow</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Open your iPhone/iPad <strong className="text-zinc-850 font-semibold">Settings</strong> app.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Tap on <strong className="text-zinc-850 font-semibold">Privacy & Security</strong> and then select <strong className="text-zinc-850 font-semibold">Location Services</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Make sure <strong className="text-zinc-850 font-semibold">Location Services</strong> is toggled <strong className="text-zinc-850 font-semibold">ON</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Scroll down the page, select <strong className="text-zinc-850 font-semibold">Safari Websites</strong> (or your browser app), and set it to <strong className="text-green-700 font-semibold">While Using the App</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Tap the <strong className="text-zinc-850 font-semibold">Three Dots (Menu)</strong> in the top-right corner of Chrome, then choose <strong className="text-zinc-850 font-semibold">Settings</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Tap on <strong className="text-zinc-850 font-semibold">Site Settings</strong> under the Advanced section, then choose <strong className="text-zinc-850 font-semibold">Location</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Ensure <strong className="text-zinc-850 font-semibold">Location</strong> is toggled <strong className="text-zinc-850 font-semibold">ON</strong>. If this site is listed under blocked, click it and tap <strong className="text-green-700 font-semibold">Allow</strong>.
                </p>
              </div>
            </div>
          )}

          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 mt-2">
            <h4 className="text-neutral-800 text-xs font-semibold mb-1 flex items-center gap-1.5">
              <HiOutlineCog className="w-4 h-4 text-zinc-500" /> Why do we need this?
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              We reverse-geocode your coordinates to populate your address state, city, and nearest landmark accurately without guesses. Your coordinates also help direct nearby Pro Partners exactly to your house.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={onRetry}
            isLoading={isRetrying}
            className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 border-none shadow-none text-sm cursor-pointer"
          >
            {!isRetrying && <HiOutlineRefresh className="w-4 h-4 shrink-0" />}
            I've allowed it, Try Again
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 text-sm shadow-none cursor-pointer"
          >
            Enter Location Manually
            <HiOutlineChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

      </div>
    </div>
  )
}
