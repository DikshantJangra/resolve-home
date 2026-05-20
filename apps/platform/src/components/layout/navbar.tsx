'use client'

import React, { useState } from 'react'
import {
  HiOutlineMenuAlt1, HiOutlineMenu, HiOutlineBadgeCheck,
  HiOutlineHome, HiOutlineChatAlt, HiOutlineUser, HiOutlineCreditCard,
  HiOutlineCog, HiOutlineLockClosed, HiOutlineClipboardCheck, HiOutlinePlusCircle,
  HiOutlineBell
} from 'react-icons/hi'
import { IoLogOutOutline, IoPerson } from 'react-icons/io5'
import { useUserProfile, useMySubscription, useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/api-hooks'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { cn, formatImageUrl } from '@resolve/ui'
import { LogoutModal } from '@/features/auth/components/logout-modal'
import { useBookingStore } from '@/store/booking-store'
import { usePathname } from 'next/navigation'
import { format } from 'date-fns'

interface NavbarProps {
  onMenuClick?: () => void
}

const navItems = [
  { label: 'Home', icon: HiOutlineHome, href: '/dashboard', requiresVerification: false, hideForEngineers: false },
  { label: 'Bookings', icon: HiOutlineClipboardCheck, href: '/bookings', requiresVerification: true, hideForEngineers: false },
  { label: 'Messages', icon: HiOutlineChatAlt, href: '/messages', requiresVerification: true, hideForEngineers: false },
  { label: 'Subscriptions', icon: HiOutlineCreditCard, href: '/subscriptions', requiresVerification: false, hideForEngineers: true },
  { label: 'My Profile', icon: HiOutlineUser, href: '/profile', requiresVerification: false, hideForEngineers: false },
  { label: 'My Wallet', icon: HiOutlineCreditCard, href: '/wallet', requiresVerification: true, hideForEngineers: false },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings', requiresVerification: false, hideForEngineers: false },
]

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: user } = useUserProfile()
  const { data: subscription } = useMySubscription()
  const { data: notifications = [] } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead } = useMarkAllNotificationsRead()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const unreadCount = notifications.filter((n: any) => !n.isRead).length

  React.useEffect(() => { setIsMounted(true) }, [])

  const isEngineer = user?.user?.role === 'worker'
  const isVerified = !!(
    (user?.user as any)?.isVerified ||
    (user?.user as any)?.status === 'verified' ||
    user?.engineerProfile?.verificationStatus === 'approved' ||
    user?.engineerProfile?.isVerified
  )

  const filteredItems = navItems.filter(item => {
    if (item.hideForEngineers && isEngineer) return false
    return true
  })

  return (
    <>
      <header className="h-16 px-4 md:px-8 bg-white border-b border-zinc-200 flex items-center justify-between sticky top-0 z-50">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-zinc-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <Link href="/">
            <Image src="/logo.svg" alt="ResolvHome" width={192} height={56} priority className="w-44 sm:w-48 h-12 sm:h-14 object-contain object-left" />
          </Link>
        </div>

        {/* Search — removed */}
        <div className="hidden sm:flex flex-1 ml-4 lg:ml-0" />

        {/* Right: name + avatar + menu */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {isMounted && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-semibold text-zinc-700 leading-tight">{user?.user?.name}</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                {isEngineer ? 'Pro Partner' : 'Home Owner'}
              </span>
            </div>
          )}

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="relative h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-full border-2 border-blue-700 flex items-center justify-center bg-zinc-100">
              {isMounted ? (
                <img
                  src={user?.user?.image ? formatImageUrl(user.user.image) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user?.name || 'User'}`}
                  alt={user?.user?.name || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IoPerson className="h-5 w-5 text-zinc-400" />
              )}
            </div>
            {isMounted && subscription && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-zinc-100">
                <HiOutlineBadgeCheck className="w-3.5 h-3.5 text-blue-700" />
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMenuOpen(false) }}
              className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-zinc-300 hover:bg-zinc-50 transition-all"
            >
              <HiOutlineBell className="h-4 w-4 md:h-5 md:w-5 text-zinc-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 top-16 z-[40]"
                    onClick={() => setIsNotifOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white shadow-xl z-[50] overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-slate-50 border-b border-zinc-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-700">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllRead()}
                          className="text-xs text-blue-700 font-medium hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-2 text-zinc-400">
                          <HiOutlineBell className="w-8 h-8" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 20).map((n: any) => (
                          <div
                            key={n.id}
                            onClick={() => { if (!n.isRead) markRead(n.id) }}
                            className={cn(
                              'px-4 py-3 border-b border-zinc-50 last:border-0 cursor-pointer hover:bg-zinc-50 transition-colors',
                              !n.isRead && 'bg-blue-50/40'
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && <div className="w-1.5 h-1.5 bg-blue-700 rounded-full mt-1.5 shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <p className={cn('text-xs leading-relaxed', !n.isRead ? 'text-neutral-700 font-medium' : 'text-zinc-500')}>
                                  {n.message || n.title}
                                </p>
                                {n.createdAt && (
                                  <p className="text-[10px] text-zinc-400 mt-0.5">
                                    {format(new Date(n.createdAt), 'MMM d · h:mm a')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 md:h-10 w-9 md:w-28 items-center justify-center md:justify-between rounded-full md:rounded-xl border border-zinc-300 px-2.5 md:px-4 transition-all hover:bg-zinc-50 active:scale-95 gap-2"
            >
              <HiOutlineMenuAlt1 className="h-4 w-4 text-zinc-600 shrink-0" />
              <span className="hidden md:block text-sm font-medium text-zinc-600">Menu</span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 top-16 z-[40]"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white shadow-xl z-[50] overflow-hidden"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 bg-slate-50 border-b border-zinc-100 flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-blue-700 bg-zinc-100">
                        {isMounted && (
                          <img
                            src={user?.user?.image ? formatImageUrl(user.user.image) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user?.name || 'User'}`}
                            alt={user?.user?.name || 'User'}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{user?.user?.name || 'My Account'}</p>
                        <p className="text-xs text-zinc-500 truncate">{user?.user?.email}</p>
                        <span className="text-[10px] font-medium text-blue-700 uppercase tracking-wide">
                          {isEngineer ? 'Pro Partner' : 'Home Owner'}
                        </span>
                      </div>
                    </div>

                    {/* Nav items */}
                    <div className="p-2">
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-zinc-700 hover:bg-zinc-50 hover:text-blue-700">
                          <HiOutlineHome className="w-4 h-4 shrink-0" />
                          <span className="flex-1">Home</span>
                        </div>
                      </Link>
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-zinc-700 hover:bg-zinc-50 hover:text-blue-700">
                          <HiOutlineUser className="w-4 h-4 shrink-0" />
                          <span className="flex-1">My Profile</span>
                        </div>
                      </Link>

                      <div className="h-px bg-zinc-100 mx-1 my-1" />

                      <button
                        onClick={() => { setIsMenuOpen(false); setIsLogoutOpen(true) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <IoLogOutOutline className="w-4 h-4 shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  )
}
