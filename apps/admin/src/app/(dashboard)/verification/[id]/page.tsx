'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineIdentification
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useAdminEngineer, useAdminVerifyEngineer } from '@/hooks/api-hooks'
import { toast } from 'sonner'

export default function VerificationDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: engineer, isLoading, error } = useAdminEngineer(id as string)
  const { mutate: verifyEngineer, isPending: isVerifying } = useAdminVerifyEngineer()

  const handleAction = (status: 'approved' | 'rejected') => {
    verifyEngineer({ id: id as string, status }, {
      onSuccess: () => {
        toast.success(`Engineer ${status === 'approved' ? 'approved' : 'rejected'} successfully`)
        router.push('/verification')
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || `Failed to ${status} engineer`)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto animate-pulse">
        <div className="h-6 w-48 bg-zinc-200 rounded" />
        <div className="h-20 w-full bg-stone-50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-white rounded-xl" />
          <div className="h-96 bg-white rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !engineer) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <HiOutlineExclamationCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Failed to load engineer details</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors group"
      >
        <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium font-inter">Back to verification requests</span>
      </button>

      {/* Profile Header */}
      <div className="bg-stone-50 rounded-2xl border border-zinc-300 p-5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl border-2 border-blue-700">
            {engineer.fullName?.charAt(0) || engineer.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-neutral-700 text-lg font-semibold font-plus-jakarta">{engineer.fullName || engineer.name}</h2>
              {engineer.status === 'approved' && <HiOutlineCheckCircle className="text-blue-700 w-4 h-4" />}
            </div>
            <p className="text-zinc-500 text-sm font-normal font-inter">{engineer.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button 
            disabled={isVerifying}
            onClick={() => handleAction('approved')}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
            title="Approve"
          >
            <HiOutlineCheckCircle className="w-6 h-6" />
          </button>
          <button 
            disabled={isVerifying}
            onClick={() => handleAction('rejected')}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
            title="Reject"
          >
            <HiOutlineXCircle className="w-6 h-6" />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
            title="Flag"
          >
            <HiOutlineExclamationCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Information Details */}
        <div className="bg-white rounded-2xl border border-zinc-300 p-6 flex flex-col gap-6 shadow-sm">
          <h3 className="text-neutral-700 text-lg font-semibold font-inter">Information Details</h3>
          
          <div className="flex flex-col gap-5">
            <InfoRow label="Full Name" value={engineer.fullName || engineer.name} icon={<HiOutlineIdentification />} />
            <InfoRow label="Category" value={engineer.category || engineer.primarySpecialty || 'N/A'} icon={<HiOutlineBriefcase />} />
            <InfoRow label="Phone Number" value={engineer.phoneNumber || engineer.phone || 'N/A'} icon={<HiOutlinePhone />} />
            <InfoRow label="Email Address" value={engineer.email} icon={<HiOutlineMail />} />
            <InfoRow label="Experience" value={engineer.experience || engineer.yearsOfExperience || 'N/A'} />
            <InfoRow 
              label="Home Address" 
              value={engineer.address || (engineer.location ? `${engineer.location.streetAddress}, ${engineer.location.city}` : 'N/A')} 
              icon={<HiOutlineLocationMarker />} 
            />
            <InfoRow label="NIN" value={engineer.nin || engineer.idNumber || 'N/A'} />
          </div>
        </div>

        {/* Guarantor Information */}
        <div className="bg-white rounded-2xl border border-zinc-300 p-6 flex flex-col gap-6 shadow-sm">
          <h3 className="text-neutral-700 text-lg font-semibold font-inter">Guarantor Information</h3>
          
          <div className="flex flex-col gap-5">
            <InfoRow label="Guarantor Name" value={engineer.guarantorName || 'N/A'} />
            <InfoRow label="Phone Number" value={engineer.guarantorPhone || 'N/A'} />
            <InfoRow label="Email Address" value={engineer.guarantorEmail || 'N/A'} />
            <InfoRow label="Relationship" value={engineer.guarantorRelationship || 'N/A'} />
            <InfoRow label="Place of Work" value={engineer.guarantorWorkPlace || 'N/A'} />
            
            <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
              <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-medium font-inter leading-relaxed">
                The guarantor has been contacted but yet to be verified via automated email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1 group">
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-400 group-hover:text-blue-600 transition-colors">{icon}</span>}
        <span className="text-neutral-700 text-sm font-normal font-inter">{label}</span>
      </div>
      <span className="text-neutral-700 text-sm font-medium font-inter text-right">{value}</span>
    </div>
  )
}
