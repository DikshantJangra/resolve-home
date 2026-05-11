'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  HiOutlineArrowLeft, 
  HiOutlinePhone, 
  HiOutlineChatAlt, 
  HiOutlineVideoCamera,
  HiOutlineTrendingUp,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineBadgeCheck,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineMail
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminEngineer } from '@/hooks/api-hooks'
import { BookingCard } from '@/components/bookings/booking-card'

export default function ProfessionalDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'personal'>('overview')
  
  const { data: pro, isLoading, error } = useAdminEngineer(id as string)

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (error || !pro) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-rose-600">Failed to load professional details</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const stats = [
    { title: "Total Earnings", value: `₦${(pro.earnings || 142500).toLocaleString()}`, trend: "+12.5%", icon: HiOutlineCurrencyDollar },
    { title: "Jobs Done", value: pro.totalJobs || 245, trend: "+12.5%", icon: HiOutlineBriefcase },
    { title: "Success Rate", value: `${pro.successRate || 99.2}%`, trend: "+12.5%", icon: HiOutlineBadgeCheck },
    { title: "Avg. Rating", value: pro.rating || 4.7, trend: "+12.5%", icon: HiOutlineStar },
  ]

  // Mock booking history as it might not be directly in the pro object
  const bookingHistory = [
    {
      id: "RH-7842-019",
      category: "Plumbing",
      description: "Burst pipe, kitchen sink",
      status: "Upcoming" as const,
      homeowner: { name: "James Adewale", rating: "4.9", avatar: "https://placehold.co/34x34" },
      price: "₦45,000",
      time: "Today · 2:00 PM – 4:00 PM",
      location: "14 Allen Avenue, Ikeja, Lagos"
    },
    {
      id: "RH-7820-055",
      category: "Plumbing",
      description: "Burst pipe, kitchen sink",
      status: "Completed" as const,
      homeowner: { name: "James Adewale", rating: "4.9", avatar: "https://placehold.co/34x34" },
      price: "₦45,000",
      time: "Apr 28, 2026 · Completed 3:45 PM",
      location: "7 Bourdillon Road, Ikoyi, Lagos"
    },
    {
      id: "RH-7835-004",
      category: "Emergency",
      description: "Gas leak",
      status: "Active" as const,
      homeowner: { name: "Chidi Bello", rating: "4.9", avatar: "https://placehold.co/34x34" },
      price: "₦45,000",
      time: "Today · In progress",
      location: "7 Bourdillon Road, Ikoyi, Lagos",
      isEmergency: true
    }
  ]

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1240px] mx-auto bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
        >
          <HiOutlineArrowLeft size={20} className="text-zinc-600" />
        </button>
        <h1 className="text-neutral-700 text-sm font-medium font-inter">Professional details</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Info Card */}
        <div className="p-5 bg-white rounded-xl border border-zinc-200 flex flex-col gap-5 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-neutral-700 text-sm font-semibold font-inter">Professional Info</h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-zinc-200 overflow-hidden bg-zinc-100 flex items-center justify-center">
                {pro.profileImage ? (
                  <img src={pro.profileImage} alt={pro.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-500 font-bold text-lg">{pro.name?.charAt(0) || 'P'}</span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700 text-base font-semibold font-inter">{pro.name || 'Opeyemi Samuel'}</span>
                  {pro.isVerified && <HiOutlineBadgeCheck className="text-blue-700 w-4 h-4" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <span>{pro.category || pro.specialty || 'Electrical'}</span>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                  <span>{pro.location || 'Lagos'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {[HiOutlinePhone, HiOutlineChatAlt, HiOutlineVideoCamera].map((Icon, idx) => (
                <button key={idx} className="p-3 bg-stone-50 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-200 flex gap-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all relative",
              activeTab === 'overview' ? "text-blue-700" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Overview
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700" />}
          </button>
          <button 
            onClick={() => setActiveTab('personal')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all relative",
              activeTab === 'personal' ? "text-blue-700" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Personal Info
            {activeTab === 'personal' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700" />}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div className="flex flex-col gap-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-zinc-300 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-700 text-sm font-normal font-inter">{stat.title}</span>
                      <span className="text-neutral-700 text-2xl font-bold font-heading">{stat.value}</span>
                    </div>
                    <stat.icon className="text-zinc-600 w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineTrendingUp className="text-green-400 w-5 h-5" />
                    <span className="text-green-700 text-xs font-medium">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking History */}
            <div className="p-6 bg-white rounded-xl border border-zinc-200 flex flex-col gap-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-neutral-700 text-base font-semibold font-inter">Booking History</h3>
                <p className="text-zinc-600 text-sm font-normal font-inter">View professional’s booking from sign up till date</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookingHistory.map((booking) => (
                  <BookingCard key={booking.id} booking={booking as any} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Professional Info */}
            <div className="p-6 bg-white rounded-xl border border-zinc-300 flex flex-col gap-6 shadow-sm">
              <h3 className="text-neutral-700 text-base font-semibold font-inter">Professional Info</h3>
              <div className="space-y-6">
                <InfoRow label="Full Name" value={pro.name || 'Opeyemi Samuel'} />
                <InfoRow label="Category" value={pro.category || pro.specialty || 'Electrical'} />
                <InfoRow label="Phone Number" value={pro.phone || pro.phoneNumber || '+234 901 234 5678'} />
                <InfoRow label="Email Address" value={pro.email || 'pro.work@example.com'} />
                <InfoRow label="Experience" value={pro.experience || '5+ Years'} />
                <InfoRow label="Joined Date" value={pro.createdAt ? new Date(pro.createdAt).toLocaleDateString() : '12 - June - 2025'} />
              </div>
            </div>

            {/* Verification & Identity */}
            <div className="p-6 bg-white rounded-xl border border-zinc-300 flex flex-col gap-6 shadow-sm h-fit">
              <h3 className="text-neutral-700 text-base font-semibold font-inter">Verification & Identity</h3>
              <div className="space-y-6">
                <InfoRow label="NIN (Verified)" value={pro.nin || '9876 5432 1098'} />
                <InfoRow label="Work Address" value={pro.location || 'Lagos'} />
                <InfoRow label="Account Name" value={pro.name || 'Opeyemi Samuel'} />
                <InfoRow label="Bank Name" value={pro.bankName || 'Zenith Bank'} />
                <InfoRow label="Account Number" value={pro.accountNumber || '2109847251'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-neutral-700 text-sm font-normal font-inter">{label}</span>
    <span className="text-neutral-700 text-sm font-medium font-inter">{value}</span>
  </div>
)
