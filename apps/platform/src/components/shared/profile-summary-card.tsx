'use client'

import React from 'react'
import Link from 'next/link'
import { HiOutlinePencilAlt, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi'
import { FileUpload } from "@resolve/ui"
import { useState } from 'react'
import { apiClient } from "@resolve/api"
import { ENDPOINTS } from "@resolve/api"
import { toast } from 'sonner'
import { formatImageUrl } from "@resolve/ui"

interface ProfileSummaryCardProps {
  fullName: string
  email: string
  phone: string
  location: string
  memberSince: string
  avatarUrl: string
  completedJobs?: number
}

export const ProfileSummaryCard = ({
  fullName,
  email,
  phone,
  location,
  memberSince,
  avatarUrl,
  completedJobs = 0
}: ProfileSummaryCardProps) => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState(formatImageUrl(avatarUrl))

  const handleUploadSuccess = async (successfulFiles: any[]) => {
    try {
      const uploadedFile = successfulFiles[0].response.body.data.file
      const newImageUrl = uploadedFile.url
      
      // Update user profile image on backend
      await apiClient.put(ENDPOINTS.USER.PROFILE, {
        name: fullName, // name is required by API
        image: newImageUrl
      })

      setCurrentAvatar(formatImageUrl(newImageUrl))
      toast.success('Profile picture updated!')
    } catch (error) {
      console.error('Failed to update profile image:', error)
    }
  }

  return (
    <div className="w-full p-5 bg-stone-50 rounded-xl border border-stone-100 flex flex-col gap-5 sticky top-24">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-3.5">
          <div
            className="relative w-20 h-20 cursor-pointer group"
            onClick={() => setIsUploaderOpen(true)}
          >
            <img
              className="w-20 h-20 rounded-[40px] border-[3px] border-white shadow-sm object-cover group-hover:opacity-80 transition-opacity"
              src={currentAvatar}
              alt="Avatar"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <HiOutlinePencilAlt className="text-white w-6 h-6 drop-shadow-md" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-700 rounded-xl border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1 border-t-[1.5px] border-r-[1.5px] border-white rotate-45 translate-y-[0.5px] -translate-x-[0.25px]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">{fullName}</h2>
            <p className="text-zinc-600 text-xs font-normal leading-4">{email}</p>
          </div>
        </div>

        <Link href="/settings" className="flex items-center gap-1 text-blue-700 hover:text-blue-800 transition-colors">
          <HiOutlinePencilAlt className="w-4 h-4" />
          <span className="text-base font-medium leading-6">Edit Profile</span>
        </Link>
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
        <div className="mt-2 py-3 border-t border-stone-200 flex justify-between items-center">
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Completed Jobs</span>
          <span className="text-neutral-700 text-sm font-bold bg-white px-2 py-0.5 rounded-lg border border-stone-200">{completedJobs}</span>
        </div>
      </div>

      <FileUpload
        isOpen={isUploaderOpen}
        onRequestClose={() => setIsUploaderOpen(false)}
        onSuccess={handleUploadSuccess}
        uploadType="image"
      />
    </div>
  )
}
