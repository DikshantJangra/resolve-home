'use client'

import React, { useState, useEffect } from 'react'
import { SettingsSidebar } from '@/features/settings/components/settings-sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUserProfile, useAuthSession, useUpdateProfile, useUpdatePassword } from '@/hooks/api-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { 
  HiOutlinePhone,
  HiOutlineInformationCircle,
  HiOutlineEye,
  HiOutlineEyeOff
} from 'react-icons/hi'

// --- Schemas ---

const accountSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

const securitySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type AccountFormValues = z.infer<typeof accountSchema>
type SecurityFormValues = z.infer<typeof securitySchema>

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const { data: session, isLoading: sessionLoading } = useAuthSession()
  
  const user = profile?.user || session?.user
  const isLoading = profileLoading || sessionLoading

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-32 ml-auto" />
        </div>
      )
    }

    switch (activeSection) {
      case 'account':
        return <AccountSection user={user} />
      case 'security':
        return <SecuritySection />
      case 'notifications':
        return <NotificationsSection user={user} />
      case 'help':
        return <HelpSection />
      default:
        return null
    }
  }

  return (
    <div className="max-w-[1185px] mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">Settings</h1>
        <p className="text-zinc-500 text-sm md:text-base font-normal leading-6">
          Manage your account preferences, security, and notification settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="w-full lg:w-fit shrink-0">
          <SettingsSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>
        <div className="w-full flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

function AccountSection({ user }: { user: any }) {
  const updateProfile = useUpdateProfile()
  
  const nameParts = user?.name?.split(' ') || ['', '']
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName,
      lastName,
      phone: user?.phone || ''
    }
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName,
        lastName,
        phone: user?.phone || ''
      })
    }
  }, [user, firstName, lastName, reset])

  const onSubmit = async (data: AccountFormValues) => {
    try {
      await updateProfile.mutateAsync({
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone
      })
      toast.success('Account settings updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update account settings')
    }
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
      <div className="px-5 md:px-8 py-5 border-b border-gray-200">
        <p className="text-zinc-600 text-sm md:text-base font-normal font-['Inter'] leading-6">
          Update your name, email, and contact information.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-8 space-y-6 md:space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              <label className="text-zinc-600 text-sm font-medium font-['Inter']">First Name</label>
              <span className="text-red-600 text-sm font-medium">*</span>
            </div>
            <Input {...register('firstName')} placeholder="Enter first name" className="h-12 border-stone-300 focus:border-blue-700" />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              <label className="text-zinc-600 text-sm font-medium font-['Inter']">Last Name</label>
              <span className="text-red-600 text-sm font-medium">*</span>
            </div>
            <Input {...register('lastName')} placeholder="Enter last name" className="h-12 border-stone-300 focus:border-blue-700" />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              <label className="text-zinc-600 text-sm font-medium font-['Inter']">Email address</label>
              <span className="text-red-600 text-sm font-medium">*</span>
            </div>
            <Input defaultValue={user?.email} type="email" disabled className="h-11 md:h-12 border-stone-300 bg-zinc-50 cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              <label className="text-zinc-600 text-sm font-medium font-['Inter']">Phone Number</label>
              <span className="text-red-600 text-sm font-medium">*</span>
            </div>
            <Input {...register('phone')} placeholder="Enter phone number" className="h-11 md:h-12 border-stone-300 focus:border-blue-700" />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={updateProfile.isPending} className="h-12 px-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg">
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false)
  const updatePassword = useUpdatePassword()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema)
  })

  const onSubmit = async (data: SecurityFormValues) => {
    try {
      await updatePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      toast.success('Password updated successfully!')
      reset()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password')
    }
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
      <div className="px-5 md:px-8 py-5 border-b border-gray-200">
        <p className="text-zinc-600 text-sm md:text-base font-normal font-['Inter'] leading-6">
          Update your password and manage security settings.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-8 space-y-6 md:space-y-8">
        <div className="space-y-6 max-w-xl">
          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              <label className="text-zinc-600 text-sm font-medium font-['Inter']">Current Password</label>
              <span className="text-red-600 text-sm font-medium">*</span>
            </div>
            <div className="relative">
              <Input 
                {...register('currentPassword')}
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••••••"
                className="h-12 border-stone-300 focus:border-blue-700 pr-12" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex gap-0.5">
                <label className="text-zinc-600 text-sm font-medium font-['Inter']">New Password</label>
                <span className="text-red-600 text-sm font-medium">*</span>
              </div>
              <Input {...register('newPassword')} type="password" placeholder="Enter desired password" className="h-12 border-zinc-300 focus:border-blue-700" />
              {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-zinc-500 text-xs font-normal">minimum 8 characters</div>
              <div className="text-zinc-500 text-xs font-normal">one uppercase character</div>
              <div className="text-zinc-500 text-xs font-normal">one number</div>
              <div className="text-zinc-500 text-xs font-normal">one lowercase character</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              <label className="text-zinc-600 text-sm font-medium font-['Inter']">Confirm Password</label>
              <span className="text-red-600 text-sm font-medium">*</span>
            </div>
            <Input {...register('confirmPassword')} type="password" placeholder="Enter password again" className="h-12 border-zinc-300 focus:border-blue-700" />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="button" onClick={() => reset()} variant="outline" className="h-11 md:h-12 flex-1 border-blue-700 text-blue-700 rounded-xl hover:bg-blue-50">
            Cancel
          </Button>
          <Button type="submit" disabled={updatePassword.isPending} className="h-11 md:h-12 flex-1 bg-blue-700 text-white rounded-xl">
            {updatePassword.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function NotificationsSection({ user }: { user: any }) {
  const [items, setItems] = useState([
    { id: 'updates', title: 'Booking updates', desc: 'Status changes, engineer arrival, job completion', active: true },
    { id: 'messages', title: 'Messages from professionals', desc: 'New messages in your active bookings', active: true },
    { id: 'push', title: 'Push notifications', desc: 'Receive push notifications on your device', active: true },
    { id: 'sms', title: 'SMS alerts', desc: `Sent to ${user?.phone || 'your registered number'}`, active: true },
    { id: 'digest', title: 'Weekly email digest', desc: 'A summary of your bookings and activity', active: true },
    { id: 'promos', title: 'Promotions & offers', desc: 'Deals, discounts, and new service announcements', active: false },
  ])

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ))
    toast.success('Notification preference updated!')
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
      <div className="px-5 md:px-8 py-5 border-b border-gray-200">
        <p className="text-zinc-600 text-sm md:text-base font-normal font-['Inter'] leading-6">
          Choose when and how you&apos;d like to be notified.
        </p>
      </div>
      <div className="px-5 md:px-8 py-2 space-y-1">
        {items.map((item) => (
          <div key={item.id} className="py-4 border-b border-zinc-200 last:border-0 flex justify-between items-center">
            <div className="space-y-0.5">
              <h3 className="text-neutral-700 text-sm font-semibold">{item.title}</h3>
              <p className="text-zinc-600 text-xs font-normal">{item.desc}</p>
            </div>
            <button 
              type="button"
              onClick={() => toggleItem(item.id)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                item.active ? "bg-blue-700" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  item.active ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function HelpSection() {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
      <div className="px-5 md:px-8 py-5 border-b border-gray-200">
        <p className="text-zinc-600 text-sm md:text-base font-normal font-['Inter'] leading-6">
          Get help from our team or browse our resources.
        </p>
      </div>
      <div className="p-5 md:p-8 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-500/10 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <HiOutlinePhone className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="text-neutral-700 text-sm font-bold">Call Us</div>
              <div className="text-zinc-600 text-[11px] md:text-xs">+234 800 123 4567</div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-600/10 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <HiOutlineInformationCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-neutral-700 text-sm font-bold">FAQ</div>
              <div className="text-zinc-600 text-[11px] md:text-xs">Browse help articles</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-stone-50 rounded-xl border border-gray-200 space-y-6">
          <div className="space-y-1">
            <h3 className="text-slate-900 text-base font-semibold">Send a message</h3>
            <p className="text-zinc-600 text-sm">Describe your issue and we&apos;ll get back to you within 24 hours.</p>
          </div>
          <div className="space-y-4">
            <textarea 
              placeholder="What can we help you with today?"
              className="w-full h-32 p-4 bg-white rounded-lg border border-zinc-300 focus:border-blue-700 outline-none resize-none text-sm"
            />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Support message sent!')} className="w-48 h-12 bg-blue-700 text-white rounded-xl">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
