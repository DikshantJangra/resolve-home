'use client'

import React from 'react'
import { HiOutlinePencilAlt, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi'

interface ProfileSummaryCardProps {
  fullName: string
  email: string
  phone: string
  location: string
  memberSince: string
  avatarUrl: string
}

export const ProfileSummaryCard = ({
  fullName,
  email,
  phone,
  location,
  memberSince,
  avatarUrl
}: ProfileSummaryCardProps) => {
  return (
    <div className="w-[488px] p-5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col gap-5 sticky top-24">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3.5">
          <div className="relative w-20 h-20">
            <img 
              className="w-20 h-20 rounded-[40px] border-[3px] border-white shadow-sm object-cover" 
              src={avatarUrl} 
              alt="Avatar"
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-700 rounded-xl border-2 border-white flex items-center justify-center">
               <div className="w-1.5 h-1 border-t-[1.5px] border-r-[1.5px] border-white rotate-45 translate-y-[0.5px] -translate-x-[0.25px]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">{fullName}</h2>
            <p className="text-zinc-600 text-xs font-normal leading-4">{email}</p>
          </div>
        </div>
        
        <button className="flex items-center gap-1 text-blue-700 hover:text-blue-800 transition-colors">
          <HiOutlinePencilAlt className="w-4 h-4" />
          <span className="text-base font-medium leading-6">Edit Profile</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-zinc-600">
          <HiOutlineLocationMarker className="w-4 h-4" />
          <span className="text-xs font-normal leading-4">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-600">
          <HiOutlinePhone className="w-4 h-4" />
          <span className="text-xs font-normal leading-4">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-600">
          <HiOutlineCalendar className="w-4 h-4" />
          <span className="text-xs font-normal leading-4">Member since {memberSince}</span>
        </div>
      </div>
    </div>
  )
}
