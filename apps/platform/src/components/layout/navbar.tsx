'use client'

import React, { useState } from 'react'
import { HiOutlineSearch, HiOutlineMenuAlt1, HiOutlineMenu } from 'react-icons/hi'
import { IoGridOutline, IoPersonOutline, IoLogOutOutline, IoPerson } from 'react-icons/io5'
import { Input } from "@resolve/ui"
import { useAuthSession, useUserProfile } from '@/hooks/api-hooks'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn, formatImageUrl } from "@resolve/ui"
import { LogoutModal } from '@/features/auth/components/logout-modal'

interface NavbarProps {
  onMenuClick?: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: session } = useAuthSession()
  const { data: user } = useUserProfile()
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="h-16 px-4 md:px-8 bg-white border-b border-zinc-300 flex items-center justify-between sticky top-0 z-50">
      {/* Mobile Hamburger */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <HiOutlineMenu className="w-6 h-6" />
      </button>

      {/* Search Bar - Hidden on extra small mobile, adjustable width */}
      <div className="flex-1 ml-2 lg:ml-0 overflow-hidden">
        <div className="relative w-full max-w-[160px] md:max-w-xs group">
          <Input 
            placeholder="Search resolv"
            className="h-9 md:h-10 pl-3 md:pl-4 pr-10 border-zinc-300 rounded-lg text-xs md:text-sm placeholder:text-zinc-300 focus:border-blue-700 transition-all bg-slate-50/50 md:bg-white"
          />
          <HiOutlineSearch className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-blue-700 pointer-events-none" />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {isMounted && (
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-xs font-semibold text-zinc-700">{user?.user?.name}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              {user?.user?.role === 'Work as a Professional' ? 'worker' : user?.user?.role}
            </span>
          </div>
        )}
        
        <div className="relative flex items-center gap-3">
          <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border border-blue-700 flex items-center justify-center bg-zinc-100 shrink-0">
            {isMounted ? (
              <img
                src={user?.user?.image ? formatImageUrl(user.user.image) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user?.name || 'User'}`}
                alt={user?.user?.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <IoPerson className="h-5 w-5 md:h-7 md:w-7" />
              </div>
            )}
          </div>
          
          {/* Menu Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-[42px] md:h-[48px] w-auto md:w-32 items-center justify-center md:justify-between rounded-[100px] border border-zinc-600 px-3 md:px-6 transition-all hover:bg-zinc-50 active:scale-95"
            >
              <HiOutlineMenuAlt1 className="h-5 w-5 text-zinc-600" />
              <span className="hidden md:block text-sm font-medium leading-5 text-zinc-600">Menu</span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 top-16 z-[40] bg-black/5" 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-[50]"
                  >
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[13px] font-semibold text-zinc-900 truncate">
                        {user?.user?.name || "My Account"}
                      </p>
                      <p className="text-[12px] text-zinc-500 truncate">
                        {user?.user?.email}
                      </p>
                    </div>
                    
                    <div className="h-[1px] bg-zinc-100 mx-1 mb-1" />

                    <Link 
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-blue-700"
                    >
                      <IoGridOutline className="size-4" />
                      Dashboard
                    </Link>

                    <Link 
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-blue-700"
                    >
                      <IoPersonOutline className="size-4" />
                      My Profile
                    </Link>

                    <div className="h-[1px] bg-zinc-100 mx-1 my-1" />

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsLogoutOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <IoLogOutOutline className="size-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <LogoutModal 
        isOpen={isLogoutOpen} 
        onClose={() => setIsLogoutOpen(false)} 
      />
    </header>
  )
}
