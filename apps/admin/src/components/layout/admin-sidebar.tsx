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
  HiOutlineCog,
  HiOutlineX
} from 'react-icons/hi'
import { cn } from "@resolve/ui"

const sidebarItems = [
  { label: 'Overview', icon: HiOutlineViewGrid, href: '/dashboard' },
  { label: 'Services', icon: HiOutlineUserGroup, href: '/categories' },
  { label: 'Bookings', icon: HiOutlineClipboardList, href: '/bookings' },
  { label: 'Homeowners', icon: HiOutlineUsers, href: '/homeowners' },
  { label: 'Professionals', icon: HiOutlineUserGroup, href: '/professionals' },
  { label: 'Complaints', icon: HiOutlineExclamationCircle, href: '/complaints' },
  { label: 'Verification', icon: HiOutlineBadgeCheck, href: '/verification' },
  { label: 'Wallet', icon: HiOutlineCreditCard, href: '/wallet' },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings' },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-zinc-300 flex flex-col z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-48 lg:translate-x-0 lg:z-0 shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header / Logo Section */}
        <div className="h-16 px-6 border-b border-zinc-300 flex items-center justify-between bg-white shrink-0">
          <Link href="/dashboard" onClick={onClose}>
            <img 
              src="/logo.svg" 
              alt="ResolvHome" 
              className="w-32 h-12 object-contain" 
            />
          </Link>
          <button 
            onClick={onClose}
            className="p-2 lg:hidden text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 flex flex-col overflow-y-auto">
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
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
    </>
  )
}
