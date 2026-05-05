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
  HiOutlineCog,
  HiOutlineLogout
} from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { LogoutModal } from '@/features/auth/components/logout-modal'
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

export const Sidebar = () => {
  const pathname = usePathname()
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false)
  const { data: user, isLoading: isLoadingUser } = useUserProfile()

  return (
    <aside className="w-48 h-screen bg-white border-r border-zinc-300 flex flex-col sticky top-0">
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

        {/* Logout Button */}
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-rose-50 group"
        >
          <HiOutlineLogout className="w-6 h-6 text-zinc-600 group-hover:text-rose-600 transition-colors" />
          <span className="text-base font-normal font-inter leading-6 text-zinc-600 group-hover:text-rose-600">
            Log out
          </span>
        </button>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-zinc-300">
        {isLoadingUser ? (
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-24" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-100 shrink-0">
              <img 
                src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                alt={user?.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-zinc-700 text-xs font-bold truncate">{user?.name}</span>
              <span className="text-zinc-500 text-[10px] truncate">{user?.email}</span>
            </div>
          </div>
        )}
      </div>

      <LogoutModal 
        isOpen={isLogoutOpen} 
        onClose={() => setIsLogoutOpen(false)} 
      />
    </aside>
  )
}
