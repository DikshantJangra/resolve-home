'use client'

import React, { useState } from 'react'
import { ProfileSummaryCard } from '@/components/shared/profile-summary-card'
import { PersonalInfoTab } from '@/features/profile/components/personal-info-tab'
import { BookingHistoryList } from '@/features/profile/components/booking-history-list'
import { ReviewsGivenList } from '@/features/profile/components/reviews-given-list'

const profileData = {
  fullName: 'Opeyemi Samuel',
  email: 'opeyemisma@gmail.com',
  phone: '+234 812 345 6789',
  city: 'Lagos',
  address: '14B Admiralty Way, Lekki Phase 1',
  bio: 'Homeowner in Lagos. Love keeping my space well-maintained. Resolv Home has made finding trusted professionals so easy.',
  memberSince: 'Apr 2024',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
}

type TabType = 'Personal Info' | 'Booking History' | 'Reviews Given'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('Personal Info')

  const tabs: TabType[] = ['Personal Info', 'Booking History', 'Reviews Given']

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
          location="Lagos, Nigeria"
          memberSince={profileData.memberSince}
          avatarUrl={profileData.avatarUrl}
        />
      </div>
    </div>
  )
}
