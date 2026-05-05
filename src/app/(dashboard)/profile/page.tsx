'use client'

import React, { useState } from 'react'
import { ProfileSummaryCard } from '@/components/shared/profile-summary-card'
import { PersonalInfoTab } from '@/features/profile/components/personal-info-tab'
import { BookingHistoryList } from '@/features/profile/components/booking-history-list'
import { ReviewsGivenList } from '@/features/profile/components/reviews-given-list'
import { useSession } from '@/lib/auth-client'
import { format } from 'date-fns'

type TabType = 'Personal Info' | 'Booking History' | 'Reviews Given'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('Personal Info')
  const { data: session, isPending } = useSession()

  const tabs: TabType[] = ['Personal Info', 'Booking History', 'Reviews Given']

  if (isPending) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-pulse">
        <div className="h-20 bg-zinc-100 rounded-xl" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 h-[400px] bg-zinc-50 rounded-2xl" />
          <div className="w-full lg:w-80 h-96 bg-zinc-50 rounded-2xl" />
        </div>
      </div>
    )
  }

  const user = session?.user

  const profileData = {
    fullName: user?.name || 'User',
    email: user?.email || '',
    phone: '', // Needs to be fetched or added to user model
    city: 'Lagos', // Default or fetch
    address: '',
    bio: 'Resolv Home member.',
    memberSince: user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Recently',
    avatarUrl: user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal Info':
        return <PersonalInfoTab {...profileData} />
      case 'Booking History':
        return <BookingHistoryList />
      case 'Reviews Given':
        return <ReviewsGivenList />
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">My Profile</h1>
        <p className="text-zinc-500 text-base font-normal leading-6">
          Manage your personal information and track your activities on Resolv Home.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-zinc-200 overflow-hidden self-stretch lg:self-start">
          {/* Tabs */}
          <div className="px-8 border-b border-zinc-200 flex gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-blue-700 border-b-2 border-blue-700 font-semibold' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>

        {/* Right Side Profile Card */}
        <ProfileSummaryCard 
          fullName={profileData.fullName}
          email={profileData.email}
          phone={profileData.phone}
          location={profileData.city}
          memberSince={profileData.memberSince}
          avatarUrl={profileData.avatarUrl}
        />
      </div>
    </div>
  )
}
