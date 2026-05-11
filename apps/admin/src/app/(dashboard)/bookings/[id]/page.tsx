'use client'

import React from 'react'
import { 
  HiOutlineChevronLeft, 
  HiOutlineSearch, 
  HiOutlinePhone, 
  HiOutlineChatAlt2,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineExclamation
} from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { cn } from "@resolve/ui"

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1240px] mx-auto">
      {/* Back Button & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <HiOutlineChevronLeft className="w-5 h-5 text-zinc-600" />
          </button>
          <h1 className="text-neutral-700 text-sm font-medium font-inter leading-5">Booking details</h1>
        </div>
        <div className="relative w-96 hidden lg:block opacity-0">
          <input placeholder="Search booking" className="w-full h-12 px-4 py-3 rounded-xl border border-zinc-300 text-sm" />
          <HiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Column: Specifications & Costs */}
        <div className="w-full lg:w-96 flex flex-col gap-5 shrink-0">
          <div className="p-4 rounded-xl border border-zinc-300 bg-white flex flex-col gap-8 shadow-sm">
            {/* Service Specification */}
            <div className="flex flex-col gap-4 pb-8 border-b border-zinc-100">
              <h2 className="text-neutral-700 text-sm font-semibold font-inter">Service Specification</h2>
              <div className="flex flex-col gap-5">
                <DetailRow label="Service Category" value="Plumbing" />
                <DetailRow label="Scheduled Time" value="Saturday, May 2024" />
                <DetailRow label="Date" value="12 - June - 2025" />
              </div>
            </div>

            {/* Costs */}
            <div className="flex flex-col gap-4">
              <h2 className="text-neutral-700 text-sm font-semibold font-inter">Material and labor cost</h2>
              <div className="flex flex-col gap-5">
                <DetailRow label="Labor cost" value="₦123,093" />
                <DetailRow label="AC Filter" value="₦123,093" />
                <DetailRow label="AC Filter" value="₦123,093" />
                <DetailRow label="AC Filter" value="₦123,093" />
                <DetailRow label="AC Filter" value="₦123,093" />
                <div className="px-2 py-2 bg-indigo-50 rounded flex justify-between items-center mt-2">
                  <span className="text-neutral-700 text-sm font-semibold font-inter">TOTAL</span>
                  <span className="text-zinc-600 text-sm font-semibold font-inter">₦123,093</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: People & Actions */}
        <div className="flex-1 w-full flex flex-col gap-5">
          <div className="p-6 rounded-xl border border-zinc-300 bg-stone-50 flex flex-col gap-10 shadow-sm min-h-[600px]">
            <div className="flex flex-col gap-10">
              {/* Homeowner Card */}
              <PersonCard 
                title="Homeowner Info"
                name="Tollideen Samwood"
                address="14 Allen Avenue, Ikeja, Lagos"
                avatar="https://placehold.co/47x47"
              />

              {/* Professional Card */}
              <PersonCard 
                title="Allocated Professional"
                name="Tollideen Samwood"
                address="14 Allen Avenue, Ikeja, Lagos"
                avatar="https://placehold.co/47x47"
                hasReassign
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-6 mt-auto pt-10 border-t border-zinc-200">
              <h2 className="text-neutral-700 text-sm font-semibold font-inter">Quick actions</h2>
              <div className="flex flex-wrap gap-6">
                <ActionButton 
                  label="Cancel Booking" 
                  icon={HiOutlineBan} 
                  variant="outline" 
                />
                <ActionButton 
                  label="Mark as complete" 
                  icon={HiOutlineCheckCircle} 
                  variant="primary" 
                />
                <ActionButton 
                  label="Flag for dispute" 
                  icon={HiOutlineExclamation} 
                  variant="outline" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-start text-sm">
    <span className="text-neutral-700 font-normal font-inter">{label}</span>
    <span className="text-zinc-600 font-normal font-inter text-right">{value}</span>
  </div>
)

const PersonCard = ({ title, name, address, avatar, hasReassign }: { 
  title: string, 
  name: string, 
  address: string, 
  avatar: string,
  hasReassign?: boolean
}) => (
  <div className="p-3 bg-white rounded-xl border border-stone-100 flex flex-col gap-5 shadow-sm">
    <h3 className="text-neutral-700 text-sm font-semibold font-inter">{title}</h3>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <img className="w-12 h-12 rounded-full border border-blue-700 object-cover" src={avatar} alt={name} />
        <div className="flex flex-col">
          <span className="text-zinc-600 text-base font-semibold font-inter leading-6">{name}</span>
          <span className="text-zinc-600 text-sm font-normal font-inter leading-5">{address}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <IconButton icon={HiOutlinePhone} />
        <IconButton icon={HiOutlineChatAlt2} />
        {hasReassign && (
          <button className="px-4 py-2.5 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 text-sm font-medium font-inter hover:bg-stone-100 transition-colors">
            Reassign
          </button>
        )}
      </div>
    </div>
  </div>
)

const IconButton = ({ icon: Icon }: { icon: any }) => (
  <button className="p-3 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-stone-100 transition-colors">
    <Icon size={20} />
  </button>
)

const ActionButton = ({ label, icon: Icon, variant }: { 
  label: string, 
  icon: any, 
  variant: 'primary' | 'outline' 
}) => (
  <button className={cn(
    "flex-1 min-w-[180px] px-6 py-3 rounded-xl flex justify-center items-center gap-3 transition-all font-medium text-sm",
    variant === 'primary' 
      ? "bg-blue-700 text-white hover:bg-blue-800 shadow-md shadow-blue-700/10" 
      : "border border-blue-700 text-blue-700 hover:bg-blue-50"
  )}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
)
