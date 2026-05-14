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
  HiOutlineMail,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineTrash
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminUser, useAdminBookings, useDeleteEngineer } from '@/hooks/api-hooks'
import { BookingCard } from '@/components/bookings/booking-card'
import { toast } from 'sonner'

export default function ProfessionalDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'personal'>('overview')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: userData, isLoading: isUserLoading } = useAdminUser(id as string)
  const { data: allBookings, isLoading: isBookingsLoading } = useAdminBookings()
  const { mutate: deleteEngineer, isPending: isDeleting } = useDeleteEngineer()

  const handleDelete = () => {
    deleteEngineer(id as string, {
      onSuccess: () => {
        toast.success('Professional deleted successfully')
        router.push('/professionals')
      },
      onError: () => {
        toast.error('Failed to delete professional')
        setShowDeleteConfirm(false)
      }
    })
  }

  const isLoading = isUserLoading || isBookingsLoading

  const pro = userData

  // Get real booking history for this professional
  const proBookings = allBookings?.filter((b: any) =>
    (b.engineerId === id) ||
    (b.engineer?._id === id) ||
    (b.engineer?.id === id) ||
    (b.assignedEngineerId === id)
  ) || []

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1240px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    )
  }

  const showNotFoundError = !isUserLoading && !pro

  if (showNotFoundError) {
    return (
      <div className="p-4 sm:p-8 text-center flex flex-col items-center gap-4">
        <HiOutlineExclamationCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold text-neutral-700">Professional Not Found</h2>
        <p className="text-zinc-600">We couldn't find a professional record with ID: {id}</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const stats = [
    { title: "Total Earnings", value: `₦${(pro.earnings || 0).toLocaleString()}`, trend: pro.earningsTrend || "0%", icon: HiOutlineCurrencyDollar },
    { title: "Jobs Done", value: pro.totalJobs || proBookings.length || 0, trend: pro.jobsTrend || "0%", icon: HiOutlineBriefcase },
    { title: "Success Rate", value: `${pro.successRate || 100}%`, trend: pro.successTrend || "0%", icon: HiOutlineBadgeCheck },
    { title: "Avg. Rating", value: pro.rating || "N/A", trend: pro.ratingTrend || "0%", icon: HiOutlineStar },
  ]

  // Removed dummy booking history logic

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-[1240px] mx-auto bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <HiOutlineArrowLeft size={20} className="text-zinc-600" />
          </button>
          <h1 className="text-neutral-700 text-sm font-medium font-inter">Professional details</h1>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <HiOutlineTrash className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
                <HiOutlineTrash className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-700">Delete Professional?</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  This will soft-delete <strong>{pro?.name || 'this professional'}</strong>. They will no longer be visible or active on the platform.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-rose-600 rounded-xl text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700 text-base font-semibold font-inter">{pro.name || pro.fullName || 'N/A'}</span>
                  {pro.isVerified && <HiOutlineBadgeCheck className="text-blue-700 w-4 h-4" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <span>{pro.category || pro.specialty || pro.primarySpecialty || 'N/A'}</span>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                  <span>{pro.location || pro.address?.city || 'N/A'}</span>
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
                {proBookings.length > 0 ? proBookings.map((booking: any) => (
                  <BookingCard key={booking.id || booking._id} booking={booking} />
                )) : (
                  <div className="col-span-full py-12 text-center text-zinc-500 bg-stone-50 rounded-xl border border-dashed border-zinc-300">
                    No booking history found for this professional.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Professional Info */}
            <div className="p-6 bg-white rounded-xl border border-zinc-300 flex flex-col gap-6 shadow-sm">
              <h3 className="text-neutral-700 text-base font-semibold font-inter">Professional Info</h3>
              <div className="space-y-6">
                <InfoRow label="Full Name" value={pro.name || pro.fullName || 'N/A'} />
                <InfoRow label="Category" value={pro.category || pro.specialty || pro.primarySpecialty || 'N/A'} />
                <InfoRow label="Phone Number" value={pro.phone || pro.phoneNumber || 'N/A'} />
                <InfoRow label="Email Address" value={pro.email || 'N/A'} />
                <InfoRow label="Experience" value={pro.experience || 'N/A'} />
                <InfoRow label="Joined Date" value={pro.createdAt ? new Date(pro.createdAt).toLocaleDateString() : 'N/A'} />
              </div>
            </div>

            {/* Verification & Identity */}
            <div className="p-6 bg-white rounded-xl border border-zinc-300 flex flex-col gap-6 shadow-sm h-fit">
              <h3 className="text-neutral-700 text-base font-semibold font-inter">Verification & Identity</h3>
              <div className="space-y-6">
                <InfoRow label="BVN (Verified)" value={pro.bvn || pro.idNumber || '9876 5432 1098'} />
                <InfoRow label="Work Address" value={pro.location || pro.address?.street || 'Lagos'} />
                <InfoRow label="Account Name" value={pro.name || pro.fullName || 'Opeyemi Samuel'} />
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
