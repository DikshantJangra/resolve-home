'use client'

import React, { useState } from 'react'
import { SettingsSidebar } from '@/features/settings/components/settings-sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { 
  HiOutlinePhone,
  HiOutlineInformationCircle,
  HiOutlineEye,
  HiOutlineEyeOff
} from 'react-icons/hi'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')
  const [showPassword, setShowPassword] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
            <div className="px-8 py-5 border-b border-gray-200">
              <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6">
                Update your name, email, and contact information.
              </p>
            </div>
            <div className="p-8 space-y-7">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex gap-0.5">
                    <label className="text-zinc-600 text-sm font-medium font-['Inter']">First Name</label>
                    <span className="text-red-600 text-sm font-medium">*</span>
                  </div>
                  <Input defaultValue="Tobi" className="h-12 border-stone-300 focus:border-blue-700" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex gap-0.5">
                    <label className="text-zinc-600 text-sm font-medium font-['Inter']">Last Name</label>
                    <span className="text-red-600 text-sm font-medium">*</span>
                  </div>
                  <Input defaultValue="Wasiu" className="h-12 border-stone-300 focus:border-blue-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex gap-0.5">
                    <label className="text-zinc-600 text-sm font-medium font-['Inter']">Email address</label>
                    <span className="text-red-600 text-sm font-medium">*</span>
                  </div>
                  <Input defaultValue="tobiwasiu@gmail.com" type="email" className="h-12 border-stone-300 focus:border-blue-700" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex gap-0.5">
                    <label className="text-zinc-600 text-sm font-medium font-['Inter']">Phone Number</label>
                    <span className="text-red-600 text-sm font-medium">*</span>
                  </div>
                  <Input defaultValue="+23491 3324 2323" className="h-12 border-stone-300 focus:border-blue-700" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="h-12 px-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
            <div className="px-8 py-5 border-b border-gray-200">
              <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6">
                Update your password and manage security settings.
              </p>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-6 max-w-xl">
                <div className="space-y-1.5">
                  <div className="flex gap-0.5">
                    <label className="text-zinc-600 text-sm font-medium font-['Inter']">Current Password</label>
                    <span className="text-red-600 text-sm font-medium">*</span>
                  </div>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      defaultValue="3242Qsswd)98821" 
                      className="h-12 border-stone-300 focus:border-blue-700 pr-12" 
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    >
                      {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex gap-0.5">
                      <label className="text-zinc-600 text-sm font-medium font-['Inter']">New Password</label>
                      <span className="text-red-600 text-sm font-medium">*</span>
                    </div>
                    <Input type="password" placeholder="Enter desired password" className="h-12 border-zinc-300 focus:border-blue-700" />
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
                  <Input type="password" placeholder="Enter password again" className="h-12 border-zinc-300 focus:border-blue-700" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="h-12 flex-1 border-blue-700 text-blue-700 rounded-xl hover:bg-blue-50">
                  Cancel
                </Button>
                <Button className="h-12 flex-1 bg-blue-700 text-white rounded-xl opacity-40 cursor-not-allowed">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )
      case 'notifications':
        const notificationItems = [
          { title: 'Booking updates', desc: 'Status changes, engineer arrival, job completion', active: true },
          { title: 'Messages from professionals', desc: 'New messages in your active bookings', active: true },
          { title: 'Push notifications', desc: 'Receive push notifications on your device', active: true },
          { title: 'SMS alerts', desc: 'Sent to +234 812 •••• 6789', active: true },
          { title: 'Weekly email digest', desc: 'A summary of your bookings and activity', active: true },
          { title: 'Promotions & offers', desc: 'Deals, discounts, and new service announcements', active: false },
        ]

        return (
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
            <div className="px-8 py-5 border-b border-gray-200">
              <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6">
                Choose when and how you&apos;d like to be notified.
              </p>
            </div>
            <div className="p-8 space-y-1">
              {notificationItems.map((item, i) => (
                <div key={i} className="py-4 border-b border-zinc-200 last:border-0 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h3 className="text-neutral-700 text-sm font-semibold">{item.title}</h3>
                    <p className="text-zinc-600 text-xs font-normal">{item.desc}</p>
                  </div>
                  <button className={cn(
                    "w-11 h-6 rounded-full transition-all relative",
                    item.active ? "bg-blue-700" : "bg-gray-300"
                  )}>
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all",
                      item.active ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      case 'help':
        return (
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-fit">
            <div className="px-8 py-5 border-b border-gray-200">
              <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6">
                Get help from our team or browse our resources.
              </p>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-500/10 flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <HiOutlinePhone className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-neutral-700 text-sm font-bold">Call Us</div>
                    <div className="text-zinc-600 text-xs">+234 800 123 4567</div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-600/10 flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <HiOutlineInformationCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-700 text-sm font-bold">FAQ</div>
                    <div className="text-zinc-600 text-xs">Browse help articles</div>
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
                    <Button className="w-48 h-12 bg-blue-700 text-white rounded-xl">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-[1185px] mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">Settings</h1>
        <p className="text-zinc-600 text-base font-normal font-['Inter'] leading-6">
          Manage your account preferences, security, and notification settings.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        <SettingsSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        {renderContent()}
      </div>
    </div>
  )
}
