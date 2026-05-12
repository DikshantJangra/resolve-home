'use client'

import React from 'react'
import { 
  HiOutlineChevronLeft, 
  HiOutlineSearch, 
  HiOutlinePhone, 
  HiOutlineChatAlt2,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineRefresh
} from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { cn, Skeleton, Button } from "@resolve/ui"
import { useAdminBooking, useUpdateBookingStatus } from '@/hooks/api-hooks'
import { toast } from 'sonner'

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: booking, isLoading, error } = useAdminBooking(params.id)
  const updateStatus = useUpdateBookingStatus()

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ bookingId: params.id, status })
      toast.success(`Booking marked as ${status}`)
    } catch (err) {
      toast.error('Failed to update booking status')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-6 max-w-[1400px] mx-auto animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-col lg:flex-row gap-5">
          <Skeleton className="w-full lg:w-96 h-[600px] rounded-xl" />
          <Skeleton className="flex-1 h-[600px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading booking details.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">Go Back</Button>
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
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
          <div className="p-5 rounded-xl border border-zinc-300 bg-white flex flex-col gap-8 shadow-sm">
            {/* Service Specification */}
            <div className="flex flex-col gap-4 pb-8 border-b border-zinc-300">
              <h2 className="text-neutral-700 text-sm font-semibold font-inter">Service Specification</h2>
              <div className="flex flex-col gap-5">
                <DetailRow label="Service Category" value={booking.serviceCategory || 'Plumbing'} />
                <DetailRow label="Scheduled Time" value={booking.scheduledTime || '2:00 PM – 4:00 PM'} />
                <DetailRow label="Date" value={booking.scheduledDate || '12 - June - 2025'} />
              </div>
            </div>

            {/* Costs */}
            <div className="flex flex-col gap-4">
              <h2 className="text-neutral-700 text-sm font-semibold font-inter">Material and labor cost</h2>
              <div className="flex flex-col gap-5">
                <DetailRow label="Labor cost" value={`₦${(booking.laborCost || 0).toLocaleString()}`} />
                {booking.materials?.map((item: any, idx: number) => (
                  <DetailRow key={idx} label={item.name} value={`₦${(item.cost || 0).toLocaleString()}`} />
                )) || (
                  <>
                    <DetailRow label="AC Filter" value="₦0" />
                    <DetailRow label="Copper Pipe" value="₦0" />
                  </>
                )}
                <div className="px-2 py-2 bg-indigo-50 rounded flex justify-between items-center mt-2">
                  <span className="text-neutral-700 text-sm font-semibold font-inter uppercase">TOTAL</span>
                  <span className="text-zinc-600 text-sm font-semibold font-inter">₦{(booking.totalPrice || 0).toLocaleString()}</span>
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
                name={booking.customerName || 'Tollideen Samwood'}
                address={booking.location?.address || '14 Allen Avenue, Ikeja, Lagos'}
                avatar={booking.customerAvatar || "https://placehold.co/47x47"}
              />

              {/* Professional Card */}
              <PersonCard 
                title="Allocated Professional"
                name={booking.engineerName || 'Unassigned'}
                address={booking.engineerAddress || 'ResolvHome Platform Partner'}
                avatar={booking.engineerAvatar || "https://placehold.co/47x47"}
                hasReassign={!!booking.engineerName}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-6 mt-auto pt-10 border-t border-zinc-300">
              <h2 className="text-neutral-700 text-sm font-semibold font-inter leading-5">Quick actions</h2>
              <div className="flex flex-wrap gap-6">
                <ActionButton 
                  label="Cancel Booking" 
                  icon={HiOutlineBan} 
                  variant="outline"
                  color="orange"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updateStatus.isPending || booking.status === 'cancelled'}
                />
                <ActionButton 
                  label="Mark as complete" 
                  icon={HiOutlineCheckCircle} 
                  variant="primary"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updateStatus.isPending || booking.status === 'completed'}
                />
                <ActionButton 
                  label="Flag for dispute" 
                  icon={HiOutlineExclamation} 
                  variant="outline"
                  color="red"
                  onClick={() => handleStatusUpdate('disputed')}
                  disabled={updateStatus.isPending}
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
    <span className="text-neutral-700 font-normal font-inter leading-5">{label}</span>
    <span className="text-zinc-600 font-normal font-inter leading-5 text-right">{value}</span>
  </div>
)

const PersonCard = ({ title, name, address, avatar, hasReassign }: { 
  title: string, 
  name: string, 
  address: string, 
  avatar: string,
  hasReassign?: boolean
}) => (
  <div className="p-3 bg-white rounded-xl border border-stone-50 flex flex-col gap-5 shadow-sm">
    <h3 className="text-neutral-700 text-sm font-semibold font-inter leading-5">{title}</h3>
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
        <button className={cn(
          "px-4 py-2.5 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 text-sm font-medium font-inter hover:bg-stone-100 transition-colors",
          !hasReassign && "opacity-50 cursor-not-allowed"
        )}>
          {hasReassign ? 'Reassign' : 'Assign Pro'}
        </button>
      </div>
    </div>
  </div>
)

const IconButton = ({ icon: Icon }: { icon: any }) => (
  <button className="p-3 bg-stone-50 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-stone-100 transition-colors">
    <Icon size={20} />
  </button>
)

const ActionButton = ({ label, icon: Icon, variant, color = 'blue', onClick, disabled }: { 
  label: string, 
  icon: any, 
  variant: 'primary' | 'outline',
  color?: 'blue' | 'orange' | 'red',
  onClick?: () => void,
  disabled?: boolean
}) => {
  const colorClasses = {
    blue: variant === 'primary' ? "bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/10" : "border-blue-700 text-blue-700 hover:bg-blue-50",
    orange: variant === 'primary' ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/10" : "border-orange-400 text-orange-400 hover:bg-orange-50",
    red: variant === 'primary' ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/10" : "border-red-600 text-red-600 hover:bg-red-50"
  }

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 min-w-[180px] px-6 py-3 rounded-xl flex justify-center items-center gap-3 transition-all font-medium text-sm",
        colorClasses[color],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )
}
