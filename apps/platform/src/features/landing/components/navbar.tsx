'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@resolve/ui";
import { useAuthSession, useSignOut, useUserProfile } from '@/hooks/api-hooks';
import { HiMenuAlt4 } from 'react-icons/hi';
import { IoPerson, IoGridOutline, IoPersonOutline, IoLogOutOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoutModal } from '@/features/auth/components/logout-modal';

export const Navbar = () => {
  const { data: session } = useAuthSession();
  const { data: userProfile } = useUserProfile();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = session?.user || userProfile?.user || userProfile;
  const isLoggedIn = !!user;

  useEffect(() => {
    const sections = ['hero', 'services', 'how-it-works', 'membership', 'faq'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', id: 'hero' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Membership', href: '#membership', id: 'membership' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ];

  const loggedInLinks = [
    { label: 'Home', href: '/dashboard', id: 'dashboard-home' },
    { label: 'Messages', href: '/messages', id: 'messages' },
    { label: 'Book a service', href: '/booking', id: 'booking' },
    { label: 'FAQ', href: '#faq', id: 'faq-logged' },
    { label: 'My Bookings', href: '/bookings', id: 'bookings' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === 'hero' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
      return;
    }

    if (id !== 'hero') {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        const offset = 72; // Navbar height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
    <nav className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 lg:px-16">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl leading-none">×</span>
            ) : (
              <HiMenuAlt4 className="h-6 w-6" />
            )}
          </button>

          <Link 
            href="/" 
            onClick={(e) => handleScroll(e, 'hero')}
            className="flex items-center transition-opacity hover:opacity-90"
          >
            <div className="relative h-12 w-[136px]">
              <Image
                src="/logo.svg"
                alt="ResolvHome"
                fill
                className="object-contain"
                priority
                sizes="136px"
              />
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {isMounted && isLoggedIn ? (
            // Logged In Links
            loggedInLinks
              .filter(link => {
                const isWorker = user?.role === 'worker'
                return !(link.label === 'Book a service' && isWorker)
              })
              .map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "text-[16px] font-normal leading-6 transition-colors px-2.5 py-2",
                    link.label === 'Home'
                      ? "text-blue-700 font-medium"
                      : "text-zinc-700 hover:text-zinc-900"
                  )}
                >
                  {link.label}
                </Link>
              ))
          ) : (
            // Landing Links
            navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleScroll(e, link.id)}
                className={cn(
                  "text-[15px] transition-all duration-200 relative py-1",
                  activeSection === link.id
                    ? "text-blue-700 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700 after:rounded-full"
                    : "text-zinc-600 font-medium hover:text-zinc-900"
                )}
              >
                {link.label}
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center gap-3">
          {isMounted && isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-blue-700 flex items-center justify-center bg-zinc-100">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                      <IoPerson className="h-7 w-7" />
                    </div>
                  )}
                </div>
                
                {/* Menu Pill & Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex h-[48px] w-32 items-center justify-between rounded-[100px] border border-zinc-600 px-6 py-3 transition-all hover:bg-zinc-50 active:scale-95"
                  >
                    <HiMenuAlt4 className="h-5 w-5 text-zinc-600" />
                    <span className="text-sm font-medium leading-5 text-zinc-600">Menu</span>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <>
                        {/* Full Screen Backdrop */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 top-[72px] z-[40] bg-black/5" 
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
                              {user?.name || "My Account"}
                            </p>
                            <p className="text-[12px] text-zinc-500 truncate">
                              {user?.email}
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
          ) : (
            <>
              <Link href="/login">
                <button className="h-[42px] rounded-[12px] border border-blue-700 bg-transparent px-6 text-[14px] font-semibold text-blue-700 transition-colors hover:bg-blue-50 cursor-pointer">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="h-[42px] rounded-[12px] bg-blue-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[72px] z-[40] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 top-[72px] z-[50] w-[280px] bg-white p-6 shadow-xl lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col gap-6">
                {(isMounted ? (session?.user ? loggedInLinks : navLinks) : [])
                  .filter(link => {
                    const isWorker = user?.role === 'worker'
                    return !(link.label === 'Book a service' && isWorker)
                  })
                  .map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (link.href.startsWith('#')) handleScroll(e, link.id);
                      }}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        activeSection === link.id ? "text-blue-700" : "text-zinc-700"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}

                <div className="mt-4 h-[1px] bg-zinc-100" />
                
                {isMounted && (isLoggedIn ? (
                  <div className="flex flex-col gap-4">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-zinc-700"
                    >
                      <IoPersonOutline className="size-5" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLogoutOpen(true);
                      }}
                      className="flex items-center gap-3 text-red-600 text-left"
                    >
                      <IoLogOutOutline className="size-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full h-12 rounded-xl border border-blue-700 text-blue-700 font-semibold">
                        Log In
                      </button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full h-12 rounded-xl bg-blue-700 text-white font-semibold">
                        Get Started
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </nav>
    <LogoutModal 
      isOpen={isLogoutOpen} 
      onClose={() => setIsLogoutOpen(false)} 
    />
    </>
  );
};

