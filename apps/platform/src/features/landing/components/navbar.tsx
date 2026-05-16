'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@resolve/ui'
import { useAuthSession, useUserProfile, useMySubscription } from '@/hooks/api-hooks'
import {
  HiMenuAlt4, HiOutlineBadgeCheck,
  HiOutlineHome, HiOutlineChatAlt, HiOutlineUser, HiOutlineCreditCard,
  HiOutlineCog, HiOutlineLockClosed, HiOutlineClipboardCheck, HiOutlinePlusCircle
} from 'react-icons/hi'
import { IoPerson, IoLogOutOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoutModal } from '@/features/auth/components/logout-modal'
import { useBookingStore } from '@/store/booking-store'
import { formatImageUrl } from '@resolve/ui'

const navItems = [
  { label: 'Home', icon: HiOutlineHome, href: '/dashboard', requiresVerification: false, hideForEngineers: false },
  { label: 'Bookings', icon: HiOutlineClipboardCheck, href: '/bookings', requiresVerification: true, hideForEngineers: false },
  { label: 'Messages', icon: HiOutlineChatAlt, href: '/messages', requiresVerification: true, hideForEngineers: false },
  { label: 'Subscriptions', icon: HiOutlineCreditCard, href: '/subscriptions', requiresVerification: false, hideForEngineers: true },
  { label: 'My Profile', icon: HiOutlineUser, href: '/profile', requiresVerification: false, hideForEngineers: false },
  { label: 'My Wallet', icon: HiOutlineCreditCard, href: '/wallet', requiresVerification: true, hideForEngineers: false },
  { label: 'Settings', icon: HiOutlineCog, href: '/settings', requiresVerification: false, hideForEngineers: false },
]

const landingLinks = [
  { label: 'Home', href: '/', id: 'hero' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'Membership', href: '#membership', id: 'membership' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
]

export const Navbar = () => {
  const { data: session } = useAuthSession()
  const { data: userProfile } = useUserProfile()
  const { data: subscription } = useMySubscription()
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const user = session?.user || userProfile?.user || userProfile
  const isLoggedIn = !!user
  const isEngineer = user?.role === 'worker'
  const isVerified = !!(
    (userProfile?.user as any)?.isVerified ||
    (userProfile?.user as any)?.status === 'verified' ||
    userProfile?.engineerProfile?.verificationStatus === 'approved' ||
    userProfile?.engineerProfile?.isVerified
  )

  const filteredNavItems = navItems.filter(item => !(item.hideForEngineers && isEngineer))

  useEffect(() => {
    const sections = ['hero', 'services', 'how-it-works', 'membership', 'faq']
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { root: null, rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    )
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === 'hero' && window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('hero')
      return
    }
    const element = document.getElementById(id)
    if (element) {
      e.preventDefault()
      const offset = 72
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const userImage = user?.image ? formatImageUrl(user.image) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-16">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen
                ? <span className="text-2xl leading-none font-light">×</span>
                : <HiMenuAlt4 className="h-6 w-6" />}
            </button>
            <Link href="/" onClick={(e) => handleScroll(e, 'hero')} className="flex items-center transition-opacity hover:opacity-90">
              <div className="relative h-10 w-[120px] sm:h-12 sm:w-[136px]">
                <Image src="/logo.svg" alt="ResolvHome" fill className="object-contain" priority sizes="136px" />
              </div>
            </Link>
          </div>

          {/* Center: desktop nav links */}
          <div className="hidden items-center gap-6 lg:flex">
            {isMounted && isLoggedIn ? (
              filteredNavItems.slice(0, 4).map(item => (
                <Link key={item.href} href={item.href}
                  className="text-[15px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-1">
                  {item.label}
                </Link>
              ))
            ) : (
              landingLinks.map(link => (
                <Link key={link.id} href={link.href} onClick={(e) => handleScroll(e, link.id)}
                  className={cn(
                    'text-[15px] transition-all duration-200 relative py-1',
                    activeSection === link.id
                      ? "text-blue-700 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700 after:rounded-full"
                      : 'text-zinc-600 font-medium hover:text-zinc-900'
                  )}>
                  {link.label}
                </Link>
              ))
            )}
          </div>

          {/* Right: auth actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isMounted && isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="relative h-9 w-9 sm:h-11 sm:w-11 overflow-hidden rounded-full border-2 border-blue-700 flex items-center justify-center bg-zinc-100">
                    <img src={userImage} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                  </div>
                  {subscription && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-zinc-100">
                      <HiOutlineBadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
                    </div>
                  )}
                </div>

                {/* Menu pill */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex h-9 sm:h-11 w-9 sm:w-28 items-center justify-center sm:justify-between rounded-full sm:rounded-xl border border-zinc-300 sm:border-zinc-600 px-2.5 sm:px-5 transition-all hover:bg-zinc-50 active:scale-95 gap-2"
                  >
                    <HiMenuAlt4 className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 shrink-0" />
                    <span className="hidden sm:block text-sm font-medium text-zinc-600">Menu</span>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="fixed inset-0 top-[72px] z-[40]"
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white shadow-xl z-[50] overflow-hidden"
                        >
                          {/* User header */}
                          <div className="px-4 py-3 bg-slate-50 border-b border-zinc-100 flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-blue-700 bg-zinc-100">
                              <img src={userImage} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-zinc-900 truncate">{user?.name || 'My Account'}</p>
                              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                              <span className="text-[10px] font-medium text-blue-700 uppercase tracking-wide">
                                {isEngineer ? 'Pro Partner' : 'Home Owner'}
                              </span>
                            </div>
                          </div>

                          {/* Nav items */}
                          <div className="p-2">
                            {filteredNavItems.map(item => {
                              const Icon = item.icon
                              const isLocked = isEngineer && !isVerified && item.requiresVerification
                              const content = (
                                <div className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                                  'text-zinc-700 hover:bg-zinc-50 hover:text-blue-700',
                                  isLocked && 'opacity-50 cursor-not-allowed'
                                )}>
                                  <Icon className="w-4 h-4 shrink-0" />
                                  <span className="flex-1">{item.label}</span>
                                  {isLocked && <HiOutlineLockClosed className="w-3.5 h-3.5 text-zinc-400" />}
                                </div>
                              )
                              if (isLocked) return <div key={item.href} title="Verification required">{content}</div>
                              return (
                                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                                  {content}
                                </Link>
                              )
                            })}

                            {!isEngineer && (
                              <button
                                onClick={() => { setIsMenuOpen(false); useBookingStore.getState().setIsOpen(true) }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                              >
                                <HiOutlinePlusCircle className="w-4 h-4 shrink-0" />
                                Book a service
                              </button>
                            )}

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
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="h-10 rounded-xl border border-blue-700 bg-transparent px-4 sm:px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
                    Log In
                  </button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <button className="h-10 rounded-xl bg-blue-700 px-4 sm:px-5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 top-[72px] z-[40] bg-black/20 lg:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute left-0 right-0 top-full z-[50] border-b border-zinc-200 bg-white shadow-lg lg:hidden"
              >
                <div className="flex flex-col gap-1 px-4 py-4">
                  {isMounted && isLoggedIn ? (
                    <>
                      {/* User info */}
                      <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-slate-50 rounded-xl">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-blue-700 bg-zinc-100">
                          <img src={userImage} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 truncate">{user?.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                        </div>
                      </div>

                      {filteredNavItems.map(item => {
                        const Icon = item.icon
                        const isLocked = isEngineer && !isVerified && item.requiresVerification
                        const content = (
                          <div className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors',
                            'text-zinc-700 hover:bg-zinc-50',
                            isLocked && 'opacity-50 cursor-not-allowed'
                          )}>
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {isLocked && <HiOutlineLockClosed className="w-4 h-4 text-zinc-400" />}
                          </div>
                        )
                        if (isLocked) return <div key={item.href} title="Verification required">{content}</div>
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            {content}
                          </Link>
                        )
                      })}

                      {!isEngineer && (
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); useBookingStore.getState().setIsOpen(true) }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <HiOutlinePlusCircle className="w-5 h-5 shrink-0" />
                          Book a service
                        </button>
                      )}

                      <div className="h-px bg-zinc-100 my-1" />

                      <button
                        onClick={() => { setIsMobileMenuOpen(false); setIsLogoutOpen(true) }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <IoLogOutOutline className="w-5 h-5 shrink-0" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      {landingLinks.map(link => (
                        <Link key={link.id} href={link.href}
                          onClick={(e) => { setIsMobileMenuOpen(false); if (link.href.startsWith('#')) handleScroll(e, link.id) }}
                          className={cn(
                            'block rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors',
                            activeSection === link.id ? 'text-blue-700 bg-blue-50' : 'text-zinc-700 hover:bg-zinc-50'
                          )}>
                          {link.label}
                        </Link>
                      ))}
                      <div className="h-px bg-zinc-100 my-2" />
                      <div className="flex gap-3 pb-1">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                          <button className="w-full h-11 rounded-xl border border-blue-700 text-blue-700 text-sm font-semibold">Log In</button>
                        </Link>
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                          <button className="w-full h-11 rounded-xl bg-blue-700 text-white text-sm font-semibold">Get Started</button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  )
}
