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
      <div className="h-16 px-6 border-b border-zinc-300 flex items-center bg-white">
        <Link href="/">
          <img 
            src="/resolve_home.svg" 
            alt="Resolv" 
            className="w-24 h-9 object-contain" 
          />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-4 flex flex-col">
        <div className="flex flex-col gap-0.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative",
                  isActive 
                    ? "bg-slate-50 border-r-2 border-blue-700" 
                    : "hover:bg-slate-50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-700" : "text-zinc-600 group-hover:text-blue-600"
                )} />
                <span className={cn(
                  "text-sm font-inter leading-5 flex-1",
                  isActive 
                    ? "text-blue-700 font-medium" 
                    : "text-zinc-600 font-normal group-hover:text-blue-600"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
