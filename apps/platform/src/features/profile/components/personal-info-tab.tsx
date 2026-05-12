import React, { useState } from 'react'
import { Button, Input, Label, Textarea } from "@resolve/ui"
import { useUpdateBioAddress } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlinePencilAlt, HiOutlineCheck } from 'react-icons/hi'

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
  city: initialCity,
  address: initialAddress,
  bio: initialBio
}: PersonalInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    city: initialCity || '',
    homeAddress: initialAddress || '',
    bio: initialBio || ''
  })

  const updateMutation = useUpdateBioAddress()

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        bio: formData.bio,
        homeAddress: {
          city: formData.city,
          street: formData.homeAddress,
        }
      })
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-1.5 opacity-60">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Full name</Label>
            <div className="text-neutral-700 text-sm font-normal">{fullName}</div>
          </div>
          <div className="space-y-1.5 opacity-60">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Email address</Label>
            <div className="text-neutral-700 text-sm font-normal">{email}</div>
          </div>
          <div className="space-y-1.5 opacity-60">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Phone number</Label>
            <div className="text-neutral-700 text-sm font-normal">{phone}</div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">City</Label>
            <Input 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="h-10 border-zinc-200"
            />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Home address</Label>
            <Input 
              value={formData.homeAddress}
              onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
              className="h-10 border-zinc-200"
            />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Bio</Label>
            <Textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="min-h-[120px] border-zinc-200"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-100">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            isLoading={updateMutation.isPending}
            className="bg-blue-700 text-white"
          >
            <HiOutlineCheck className="mr-2 w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-all"
        title="Edit Profile"
      >
        <HiOutlinePencilAlt className="w-5 h-5" />
      </button>

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
          <div className="text-neutral-700 text-sm font-normal">{initialCity || 'Not provided'}</div>
        </div>
        <div className="col-span-full space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Home address</label>
          <div className="text-neutral-700 text-sm font-normal">{initialAddress || 'No primary address set'}</div>
        </div>
        <div className="col-span-full space-y-1.5">
          <label className="text-zinc-600 text-xs font-medium uppercase tracking-wider">Bio</label>
          <div className="text-slate-900 text-sm font-normal leading-relaxed">
            {initialBio || 'No bio provided.'}
          </div>
        </div>
      </div>
    </div>
  )
}
