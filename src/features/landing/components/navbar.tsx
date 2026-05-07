'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthSession } from '@/hooks/api-hooks';
import { IoNotificationsOutline } from 'react-icons/io5';
import { HiMenuAlt4 } from 'react-icons/hi';

export const Navbar = () => {
  const { data: session } = useAuthSession();
  const [activeSection, setActiveSection] = useState('hero');

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
    <nav className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 lg:px-16">
        <Link 
          href="/" 
          onClick={(e) => handleScroll(e, 'hero')}
          className="flex items-center transition-opacity hover:opacity-90"
        >
          <div className="relative h-9 w-[102px]">
            <Image
              src="/resolve_home.svg"
              alt="Resolve Home"
              fill
              className="object-contain"
              priority
              sizes="102px"
            />
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {session?.user ? (
            // Logged In Links
            loggedInLinks.map((link) => (
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
          {session?.user ? (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative flex h-10 w-10 items-center justify-center text-zinc-600 transition-colors hover:text-zinc-900">
                <IoNotificationsOutline size={24} />
              </button>
              
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-200">
                  <Image
                    src={session.user.image || "https://placehold.co/47x47"}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Menu Pill */}
                <button className="flex h-[48px] w-32 items-center justify-between rounded-[100px] border border-zinc-600 px-6 py-3 transition-all hover:bg-zinc-50">
                  <HiMenuAlt4 className="h-5 w-5 text-zinc-600" />
                  <span className="text-sm font-medium leading-5 text-zinc-600">Menu</span>
                </button>
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
    </nav>
  );
};

