'use client'

import React from 'react'
import { HiOutlineCurrencyDollar, HiOutlineClipboardCheck, HiOutlineChatAlt, HiOutlineStar } from 'react-icons/hi'
import { StatCard } from '@/features/dashboard/components/stat-card'
import { RecentRequests } from '@/features/dashboard/components/recent-requests'
import { useAuthSession, useUserBookings } from '@/hooks/api-hooks'
import { VerificationRequired } from '@/features/professional-setup/components/verification-required'
import { ProfessionalSetupWizard } from '@/features/professional-setup/components/professional-setup-wizard'

export default function DashboardPage() {
  const { data: session, isLoading: sessionLoading } = useAuthSession()
  const { data: bookings, isLoading: bookingsLoading } = useUserBookings()
  const [isSetupOpen, setIsSetupOpen] = React.useState(false)

  const user = session?.user
  const isEngineer = user?.role === 'worker'
  const isVerified = (user as any)?.isVerified || (user as any)?.status === 'verified'

  React.useEffect(() => {
    if (user) {
      console.log('Dashboard Debug - User:', user);
      console.log('Dashboard Debug - Is Engineer:', isEngineer);
      console.log('Dashboard Debug - Is Verified:', isVerified);
    }
  }, [user, isEngineer, isVerified]);
  
  const avgRating = isEngineer ? "4.8" : "5.0"

  // Derive some stats from bookings
  const completedBookings = bookings?.filter((b: any) => b.status?.toUpperCase() === 'COMPLETED') || []
  const completedCount = completedBookings.length
  const totalSpentOrEarned = completedBookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0) || 0
  const activeBookings = bookings?.filter((b: any) => ['pending', 'confirmed', 'in-progress'].includes(b.status.toLowerCase())) || []

  const categoryCounts: Record<string, number> = {}
  bookings?.forEach((b: any) => {
    const cat = b.service?.category?.name || 'Other'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))

  if (sessionLoading || bookingsLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white border border-zinc-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  const status = (user as any)?.status

  // If worker and not verified
  if (isEngineer && !isVerified) {
    // If setup wizard is manually opened
    if (isSetupOpen) {
      return <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} />
    }

    // If status is pending, show the setup wizard at the final step (Pending Screen)
    if (status === 'pending') {
      return <ProfessionalSetupWizard onComplete={() => setIsSetupOpen(false)} initialStep={4} />
    }

    // Otherwise show the "Verification Required" CTA
    return <VerificationRequired onVerify={() => setIsSetupOpen(true)} />
  }

  return (
    <div className="space-y-6 md:space-y-10 min-h-screen pb-10">
      {/* Stats Section */}
      <div className="flex flex-wrap items-center gap-5">
        <StatCard 
          label={isEngineer ? "Total Earnings" : "Total Spent"} 
          value={`₦${totalSpentOrEarned.toLocaleString()}`} 
          change="+12.5%" 
          icon={HiOutlineCurrencyDollar} 
        />
        <StatCard 
          label="Completed Jobs" 
          value={completedCount.toString()} 
          change="+12.5%" 
          icon={HiOutlineClipboardCheck} 
        />
        <StatCard 
          label={isEngineer ? "Response Rate" : "Active Requests"}
          value={isEngineer ? "98%" : activeBookings.length.toString()} 
          change="+12.5%" 
          icon={HiOutlineChatAlt} 
        />
        <StatCard 
          label="Avg. Rating" 
          value={isEngineer ? "4.7" : avgRating} 
          change="+12.5%" 
          icon={HiOutlineStar} 
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        <RecentRequests />
      </div>
    </div>
  )
}
