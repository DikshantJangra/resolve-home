'use client'

import React, { useState } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { cn } from "@resolve/ui"
import { 
  HiOutlineBriefcase, 
  HiOutlineClipboardList, 
  HiOutlineChatAlt, 
  HiOutlineUser, 
  HiOutlineCreditCard, 
  HiOutlineCog 
} from 'react-icons/hi'

const engineerSidebarItems = [
  { label: 'Jobs Feed', icon: HiOutlineBriefcase, href: '/engineer' },
  { label: 'Active Jobs', icon: HiOutlineClipboardList, href: '/engineer/jobs', requiresVerification: true },
  { label: 'Messages', icon: HiOutlineChatAlt, href: '/messages', requiresVerification: true },
  { label: 'Earnings', icon: HiOutlineCreditCard, href: '/wallet', requiresVerification: true },
  { label: 'My Profile', icon: HiOutlineUser, href: '/profile' },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings' },
]

export default function EngineerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, shown as drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[100] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-[100]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} items={engineerSidebarItems} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 flex-grow overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
