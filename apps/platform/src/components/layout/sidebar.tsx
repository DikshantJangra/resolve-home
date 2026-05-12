'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HiOutlineHome, 
  HiOutlineChatAlt, 
  HiOutlineUser, 
  HiOutlineCreditCard, 
  HiOutlineCog, 
  HiOutlineLockClosed, 
  HiOutlineClipboardCheck, 
  HiOutlineX,
  HiOutlinePlusCircle
} from 'react-icons/hi'
import { cn } from "@resolve/ui"
import { useUserProfile } from '@/hooks/api-hooks'
import { useBookingStore } from '@/store/booking-store'

interface SidebarItem {
  label: string
  icon: React.ElementType
  href: string
  requiresVerification?: boolean
}

const defaultSidebarItems: SidebarItem[] = [
  { label: 'Home', icon: HiOutlineHome, href: '/dashboard' },
  { label: 'Bookings', icon: HiOutlineClipboardCheck, href: '/bookings', requiresVerification: true },
  { label: 'Messages', icon: HiOutlineChatAlt, href: '/messages', requiresVerification: true },
  { label: 'My Profile', icon: HiOutlineUser, href: '/profile' },
  { label: 'My Wallet', icon: HiOutlineCreditCard, href: '/wallet', requiresVerification: true },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings' },
]

interface SidebarProps {
  onClose?: () => void
  items?: SidebarItem[]
}

export const Sidebar = ({ onClose, items = defaultSidebarItems }: SidebarProps) => {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = React.useState(false)
  const { data: userProfile, isLoading: isLoadingUser } = useUserProfile()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const isEngineer = userProfile?.user?.role === 'worker'
  const isVerified = (userProfile?.user as any)?.isVerified || (userProfile?.user as any)?.status === 'verified'

  React.useEffect(() => {
    if (userProfile) {
      console.log('Sidebar Debug - User Profile:', userProfile);
      console.log('Sidebar Debug - Is Engineer:', isEngineer);
      console.log('Sidebar Debug - Is Verified:', isVerified);
    }
  }, [userProfile, isEngineer, isVerified]);

  return (
    <aside className="w-48 h-full min-h-screen bg-white border-r border-zinc-300 flex flex-col relative">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-[-40px] w-8 h-8 bg-white border border-zinc-300 rounded-full flex items-center justify-center text-zinc-600 shadow-sm"
      >
        <HiOutlineX className="w-5 h-5" />
      </button>
      {/* Logo Section */}
      <div className="h-16 px-6 border-b border-zinc-300 flex items-center">
        <Link href="/">
          <img src="/logo.svg" alt="ResolvHome" className="w-32 h-12 object-contain" />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 flex flex-col">
        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/engineer' && pathname.startsWith(item.href))
            const isLocked = isEngineer && !isVerified && item.requiresVerification

            const content = (
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative",
                  isActive 
                    ? "bg-slate-50 border-r-2 border-blue-700" 
                    : "hover:bg-slate-50",
                  isLocked && "opacity-50 cursor-not-allowed grayscale"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-700" : "text-zinc-600 group-hover:text-blue-600"
                )} />
                <span className={cn(
                  "text-sm font-normal font-inter leading-5 flex-1",
                  isActive ? "text-blue-700 font-medium" : "text-zinc-600 group-hover:text-blue-600"
                )}>
                  {item.label}
                </span>
                {isLocked && (
                  <HiOutlineLockClosed className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </div>
            )

            if (isLocked) {
              return <div key={item.href} title="Verification required">{content}</div>
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
              >
                {content}
              </Link>
            )
          })}
          
          {/* Book a service Button - Hide for workers entirely, and only show when loaded and verified */}
          {!isLoadingUser && userProfile && !isEngineer && (
            <button
              onClick={() => {
                useBookingStore.getState().setIsOpen(true)
                onClose?.()
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group text-blue-700 hover:bg-blue-50 mt-2"
            >
              <HiOutlinePlusCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold font-inter leading-5 whitespace-nowrap">
                Book a service
              </span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  )
}
