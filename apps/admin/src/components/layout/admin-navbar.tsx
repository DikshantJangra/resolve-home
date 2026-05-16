'use client'

import React, { useState } from 'react'
import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi'
import { formatImageUrl, cn } from '@resolve/ui'
import { useUserProfile, useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/api-hooks'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

interface AdminNavbarProps {
  onMenuClick?: () => void
}

export const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const { data: user } = useUserProfile()
  const { data: notifications = [] } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead } = useMarkAllNotificationsRead()
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  const unreadCount = notifications.filter((n: any) => !n.isRead).length
  const adminName = user?.name || user?.user?.name || 'Admin'
  const adminRole = user?.role || user?.user?.role || 'Admin'
  const adminImage = user?.image || user?.user?.image
  const avatarSrc = adminImage ? formatImageUrl(adminImage) : `https://api.dicebear.com/7.x/initials/svg?seed=${adminName}`

  return (
    <header className="h-16 px-4 lg:px-8 bg-white border-b border-zinc-200 flex justify-between items-center sticky top-0 z-20 shrink-0">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 lg:hidden text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <HiOutlineMenuAlt2 className="w-6 h-6" />
        </button>
        <Link href="/" className="lg:hidden shrink-0">
          <img src="/logo.svg" alt="ResolvHome" className="w-28 h-9 object-contain" />
        </Link>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 hover:bg-zinc-50 transition-all"
          >
            <HiOutlineBell className="h-5 w-5 text-zinc-600" />
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
                      <button onClick={() => markAllRead()} className="text-xs text-blue-700 font-medium hover:underline">
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

        {/* Profile */}
        <Link href="/settings" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-blue-700 object-cover bg-zinc-100"
            src={avatarSrc}
            alt={adminName}
          />
          <div className="hidden sm:flex flex-col justify-center">
            <span className="text-zinc-700 text-sm font-semibold leading-tight truncate max-w-[120px]">
              {adminName}
            </span>
            <span className="text-zinc-400 text-xs capitalize leading-tight">
              {adminRole}
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
