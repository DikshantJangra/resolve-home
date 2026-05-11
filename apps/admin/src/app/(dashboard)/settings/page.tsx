'use client'

import React, { useState, useEffect } from 'react'
import { 
  HiOutlineUser, 
  HiOutlineLockClosed, 
  HiOutlineCamera,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUserCircle
} from 'react-icons/hi'
import { cn, Button, Input, Label, Skeleton, formatImageUrl } from "@resolve/ui"
import { useUserProfile, useUpdateProfile, useUpdatePassword, useUploadFile } from '@/hooks/api-hooks'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { data: profile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()
  const uploadFile = useUploadFile()

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  })

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatar: profile.avatar || ''
      })
    }
  }, [profile])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync(profileData)
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await updatePassword.mutateAsync({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password updated successfully')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const uploadRes = await uploadFile.mutateAsync(file)
      const url = uploadRes.url || uploadRes
      setProfileData(prev => ({ ...prev, avatar: url }))
      toast.success('Avatar uploaded')
    } catch (err) {
      toast.error('Failed to upload avatar')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[800px]">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1000px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-xl font-semibold font-plus-jakarta leading-8">Account Settings</h1>
        <p className="text-zinc-600 text-base font-normal font-inter leading-6">
          Manage your profile information and account security.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-zinc-200">
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "pb-4 text-sm font-medium transition-all relative",
              activeTab === 'profile' ? "text-blue-700" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Profile
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />}
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={cn(
              "pb-4 text-sm font-medium transition-all relative",
              activeTab === 'security' ? "text-blue-700" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Security
            {activeTab === 'security' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />}
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    {profileData.avatar ? (
                      <img 
                        src={formatImageUrl(profileData.avatar)} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <HiOutlineUserCircle className="w-20 h-20 text-zinc-300" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <HiOutlineCamera className="w-6 h-6 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-neutral-800 text-lg font-semibold font-inter">Profile Picture</h3>
                  <p className="text-zinc-500 text-sm">PNG, JPG or GIF. Max 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <Input 
                      value={profileData.name}
                      onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      placeholder="Enter your name"
                    />
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Input 
                      value={profile?.email || profileData.email}
                      disabled
                      className="pl-10 bg-zinc-50 opacity-80 cursor-not-allowed"
                      placeholder="email@example.com"
                    />
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Input 
                      value={profileData.phone}
                      onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                      placeholder="+234 ..."
                    />
                    <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    isLoading={updateProfile.isPending}
                    className="bg-blue-700 hover:bg-blue-800 px-8 rounded-xl"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col gap-8">
            <div className="flex items-center gap-2 text-neutral-800">
              <HiOutlineLockClosed className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-bold font-plus-jakarta">Update Password</h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6 max-w-[500px]">
              <div className="flex flex-col gap-2">
                <Label>Current Password</Label>
                <Input 
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>New Password</Label>
                <Input 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Confirm New Password</Label>
                <Input 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  isLoading={updatePassword.isPending}
                  className="bg-blue-700 hover:bg-blue-800 px-8 rounded-xl"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
