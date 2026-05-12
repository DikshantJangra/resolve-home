'use client'

import React from 'react'
import { HiOutlineSearch, HiOutlineMenuAlt2 } from 'react-icons/hi'
import { Input, formatImageUrl } from "@resolve/ui"
import { useUserProfile } from '@/hooks/api-hooks'
import Link from 'next/link'

interface AdminNavbarProps {
  onMenuClick?: () => void
}

export const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const { data: user } = useUserProfile()

  return (
    <header className="h-16 px-4 lg:px-8 bg-white border-b border-zinc-300 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-20 flex-1">
        <button 
          type="button"
          onClick={onMenuClick}
          className="p-2 lg:hidden text-zinc-500 hover:text-zinc-700 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <HiOutlineMenuAlt2 className="w-6 h-6" />
        </button>

        <Link href="/" className="shrink-0 lg:hidden">
          <img 
            src="/logo.svg" 
            alt="ResolvHome" 
            className="w-28 sm:w-36 h-10 sm:h-12 object-contain" 
          />
        </Link>

        <div className="relative w-full max-w-80 hidden md:block lg:ml-0">
          <Input 
            placeholder="Search ResolvHome" 
            className="h-10 pl-4 pr-10 border-zinc-300 rounded-lg text-sm placeholder:text-zinc-300"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
        </div>
      </div>

      <Link href="/settings" className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity">
        <img 
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-blue-700 object-cover bg-zinc-100" 
          src={formatImageUrl(user?.avatar || user?.image) || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Admin'}`} 
          alt="Profile" 
        />
        <div className="hidden sm:flex flex-col justify-center">
          <span className="text-zinc-600 text-sm lg:text-base font-semibold font-inter leading-tight lg:leading-6 truncate max-w-[120px]">
            {user?.name || "Tollideen Samwood"}
          </span>
          <span className="text-zinc-600 text-xs lg:text-sm font-normal font-inter leading-tight lg:leading-5">
            {user?.role || "Admin"}
          </span>
        </div>
      </Link>
    </header>
  )
}
