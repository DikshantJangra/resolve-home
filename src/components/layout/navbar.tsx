'use client'

import React from 'react'
import { HiOutlineSearch, HiOutlineMenuAlt1 } from 'react-icons/hi'
import { Input } from '@/components/ui/input'

export const Navbar = () => {
  return (
    <header className="h-16 px-8 bg-white border-b border-zinc-300 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-[911px]">
        <div className="relative w-80 group">
          <Input 
            placeholder="Search resolv"
            className="h-10 pl-4 pr-10 border-zinc-300 rounded-lg text-sm placeholder:text-zinc-300 focus:border-blue-700 transition-all"
          />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-blue-700 pointer-events-none" />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
          alt="Profile" 
          className="w-12 h-12 rounded-full border border-blue-700 object-cover"
        />
        <button className="h-11 px-6 rounded-full border border-zinc-600 flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <HiOutlineMenuAlt1 className="w-5 h-5 text-zinc-600" />
          <span className="text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Menu</span>
        </button>
      </div>
    </header>
  )
}
