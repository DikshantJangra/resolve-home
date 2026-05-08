'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HiOutlineHome, 
  HiOutlineClipboardList, 
  HiOutlineChatAlt, 
  HiOutlineUser, 
  HiOutlineCreditCard, 
  HiOutlineCog
} from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { useUserProfile } from '@/hooks/api-hooks'
import { Skeleton } from '@/components/ui/skeleton'

const sidebarItems = [
  { label: 'Home', icon: HiOutlineHome, href: '/dashboard' },
  { label: 'Bookings', icon: HiOutlineClipboardList, href: '/bookings' },
  { label: 'Messages', icon: HiOutlineChatAlt, href: '/messages' },
  { label: 'My Profile', icon: HiOutlineUser, href: '/profile' },
  { label: 'My Wallet', icon: HiOutlineCreditCard, href: '/wallet' },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings' },
]

interface SidebarProps {
  onClose?: () => void
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = React.useState(false)
  const { data: user, isLoading: isLoadingUser } = useUserProfile()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <aside className="w-48 h-full min-h-screen bg-white border-r border-zinc-300 flex flex-col relative">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-[-40px] w-8 h-8 bg-white border border-zinc-300 rounded-full flex items-center justify-center text-zinc-600 shadow-sm"
      >
        <span className="text-xl">×</span>
      </button>
      {/* Logo Section */}
      <div className="h-16 px-6 border-b border-zinc-300 flex items-center">
        <Link href="/">
          <img src="/resolve_home.svg" alt="Resolv" className="w-24 h-9 object-contain" />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-slate-50 border-r-2 border-blue-700" 
                  : "hover:bg-slate-50"
              )}
            >
              <Icon className={cn(
                "w-6 h-6 transition-colors",
                isActive ? "text-blue-700" : "text-zinc-600 group-hover:text-blue-600"
              )} />
              <span className={cn(
                "text-base font-normal font-inter leading-6",
                isActive ? "text-blue-700 font-medium" : "text-zinc-600 group-hover:text-blue-600"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}

      </nav>
    </aside>
  )
}
