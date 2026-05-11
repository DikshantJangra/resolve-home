'use client'

import React from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { Input, formatImageUrl } from "@resolve/ui"
import { useUserProfile } from '@/hooks/api-hooks'
import Link from 'next/link'

export const AdminNavbar = () => {
  const { data: user } = useUserProfile()

  return (
    <header className="h-16 px-8 bg-white border-b border-zinc-300 flex justify-between items-center sticky top-0 z-10">
      <div className="flex-1 max-w-[911px] flex items-center gap-20">
        <div className="relative w-80">
          <Input 
            placeholder="Search resolv" 
            className="h-10 pl-4 pr-10 border-zinc-300 rounded-lg text-sm placeholder:text-zinc-300"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
        </div>
      </div>

      <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img 
          className="w-12 h-12 rounded-full border border-blue-700 object-cover bg-zinc-100" 
          src={formatImageUrl(user?.avatar || user?.image) || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Admin'}`} 
          alt="Profile" 
        />
        <div className="flex flex-col justify-center">
          <span className="text-zinc-600 text-base font-semibold font-inter leading-6">
            {user?.name || "Tollideen Samwood"}
          </span>
          <span className="text-zinc-600 text-sm font-normal font-inter leading-5">
            {user?.role || "Admin"}
          </span>
        </div>
      </Link>
    </header>
  )
}
