'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HiOutlineViewGrid, 
  HiOutlineClipboardList, 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineExclamationCircle, 
  HiOutlineBadgeCheck, 
  HiOutlineCreditCard, 
  HiOutlineCog
} from 'react-icons/hi'
import { cn } from "@resolve/ui"

const sidebarItems = [
  { label: 'Overview', icon: HiOutlineViewGrid, href: '/' },
  { label: 'Bookings', icon: HiOutlineClipboardList, href: '/bookings' },
  { label: 'Homeowners', icon: HiOutlineUsers, href: '/homeowners' },
  { label: 'Professionals', icon: HiOutlineUserGroup, href: '/professionals' },
  { label: 'Complaints', icon: HiOutlineExclamationCircle, href: '/complaints' },
  { label: 'Verification', icon: HiOutlineBadgeCheck, href: '/verification' },
  { label: 'Wallet', icon: HiOutlineCreditCard, href: '/wallet' },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings' },
]

export const AdminSidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-48 h-full min-h-screen bg-white border-r border-zinc-300 flex flex-col sticky top-0">
      {/* Header / Logo Section */}
      <div className="h-16 px-3 border-b border-zinc-300 flex items-center gap-2 bg-white">
        <img 
          src="https://placehold.co/56x45" 
          alt="Admin Logo" 
          className="w-14 h-11 object-contain" 
        />
        <span className="text-blue-700 text-base font-normal font-inter leading-6">Admin</span>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-2.5 space-y-3 mt-1.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1 transition-all group px-3",
                isActive 
                  ? "bg-slate-50 border-r-2 border-blue-700" 
                  : "hover:bg-slate-50/50"
              )}
            >
              <div className="py-2.5 flex items-center gap-1">
                <Icon className={cn(
                  "w-6 h-6 transition-colors",
                  isActive ? "text-blue-700" : "text-zinc-600 group-hover:text-blue-700"
                )} />
                <div className="p-2.5 flex justify-end items-center">
                  <span className={cn(
                    "text-base font-inter leading-6",
                    isActive 
                      ? "text-blue-700 font-semibold" 
                      : "text-zinc-600 font-normal group-hover:text-blue-700"
                  )}>
                    {item.label}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
