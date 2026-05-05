'use client'

import React from 'react'

interface PersonalInfoTabProps {
  fullName: string
  email: string
  phone: string
  city: string
  address: string
  bio: string
}

export const PersonalInfoTab = ({
  fullName,
  email,
  phone,
  city,
  address,
  bio
}: PersonalInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      <div className="space-y-1.5">
        <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Full name</label>
        <div className="text-neutral-700 text-sm font-normal">{fullName}</div>
      </div>
      <div className="space-y-1.5">
        <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Email address</label>
        <div className="text-neutral-700 text-sm font-normal">{email}</div>
      </div>
      <div className="space-y-1.5">
        <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Phone number</label>
        <div className="text-neutral-700 text-sm font-normal">{phone}</div>
      </div>
      <div className="space-y-1.5">
        <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">City</label>
        <div className="text-neutral-700 text-sm font-normal">{city}</div>
      </div>
      <div className="col-span-full space-y-1.5">
        <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Home address</label>
        <div className="text-neutral-700 text-sm font-normal">{address}</div>
      </div>
      <div className="col-span-full space-y-1.5">
        <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Bio</label>
        <div className="text-slate-900 text-sm font-normal leading-relaxed">
          {bio}
        </div>
      </div>
    </div>
  )
}
