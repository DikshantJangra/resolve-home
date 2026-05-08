'use client'

import React, { useState } from 'react'
import { ProfileSummaryCard } from '@/components/shared/profile-summary-card'
import { PersonalInfoTab } from '@/features/profile/components/personal-info-tab'
import { BookingHistoryList } from '@/features/profile/components/booking-history-list'
import { ReviewsGivenList } from '@/features/profile/components/reviews-given-list'
import { useAuthSession, useUserProfile, useUserBookings } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

type TabType = 'Personal Info' | 'Booking History' | 'Reviews Given'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('Personal Info')
  const { data: session, isLoading: sessionLoading } = useAuthSession()
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const { data: bookings } = useUserBookings()

  const tabs: TabType[] = ['Personal Info', 'Booking History', 'Reviews Given']

  const isLoading = sessionLoading || profileLoading

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8 animate-pulse">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="flex-1 h-[400px] bg-white border border-zinc-200 rounded-2xl" />
          <div className="w-full lg:w-80 h-96 bg-white border border-zinc-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  const user = profile?.user || session?.user
  const completedBookings = bookings?.filter((b: any) => b.status === 'COMPLETED')?.length || 0

  const profileData = {
    fullName: user?.name || 'User',
    email: user?.email || '',
    phone: user?.phone || 'Not provided',
    city: 'Lagos',
    address: 'No primary address set',
    bio: user?.role === 'worker' ? 'Professional Service Engineer on Resolv Home.' : 'Member of Resolv Home.',
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
    <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-8">My Profile</h1>
        <p className="text-zinc-500 text-sm md:text-base font-normal leading-6">
          Manage your personal information and track your activities on Resolv Home.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        {/* Main Content Area */}
        <div className="w-full flex-1 bg-white rounded-2xl border border-zinc-200 overflow-hidden self-stretch lg:self-start order-2 lg:order-1">
          {/* Tabs */}
          <div className="px-4 md:px-8 border-b border-zinc-200 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap ${
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
          <div className="p-4 md:p-8 min-h-[300px] md:min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>

        {/* Right Side Profile Card */}
        <div className="w-full lg:w-80 order-1 lg:order-2">
          <ProfileSummaryCard 
            fullName={profileData.fullName}
            email={profileData.email}
            phone={profileData.phone}
            location={profileData.city}
            memberSince={profileData.memberSince}
            avatarUrl={profileData.avatarUrl}
            completedJobs={completedBookings}
          />
        </div>
      </div>
    </div>
  )
}
