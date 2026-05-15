'use client'

import React from 'react'
import { 
  HiOutlineChevronLeft, 
  HiOutlinePhone, 
  HiOutlineChatAlt2,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineCalendar
} from 'react-icons/hi'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { useRouter, useParams } from 'next/navigation'
import { cn, Skeleton, Button, formatImageUrl } from "@resolve/ui"
import { useAdminBooking, useUpdateBookingStatus, useBookingQuotations } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function BookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { data: booking, isLoading, error } = useAdminBooking(id)
  const { data: quotations } = useBookingQuotations(id)
  const updateStatus = useUpdateBookingStatus()

  // Get the most recent/approved quotation
  const activeQuotation = quotations?.find((q: any) => q.status === 'APPROVED') || quotations?.[0]

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ bookingId: id, status })
      toast.success(`Booking marked as ${status.replace('_', ' ')}`)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
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
      <div className="p-4 sm:p-8 text-center min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <HiOutlineExclamation size={32} />
        </div>
        <p className="text-zinc-500 font-medium">Error loading booking details or job not found.</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    )
  }

  const statusSteps = [
    { label: 'Pending', status: booking.status === 'pending' ? 'current' : (['confirmed', 'on_the_way', 'arrived', 'in_progress', 'completed'].includes(booking.status) ? 'completed' : 'pending') },
    { label: 'Confirmed', status: booking.status === 'confirmed' ? 'current' : (['on_the_way', 'arrived', 'in_progress', 'completed'].includes(booking.status) ? 'completed' : 'pending') },
    { label: 'Arrived', status: booking.status === 'arrived' ? 'current' : (['in_progress', 'completed'].includes(booking.status) ? 'completed' : 'pending') },
    { label: 'In Progress', status: booking.status === 'in_progress' ? 'current' : (booking.status === 'completed' ? 'completed' : 'pending') },
    { label: 'Completed', status: booking.status === 'completed' ? 'completed' : 'pending' },
  ]

  const homeowner = {
    name: booking.customerName,
    avatar: booking.customerAvatar,
    address: booking.customerAddress,
    phone: (booking.user || booking.customerDetails)?.phone
  }

  const engineer = {
    name: booking.engineerName,
    avatar: booking.engineerAvatar,
    address: booking.engineerAddress,
    phone: (booking.engineer?.user || booking.engineer)?.phone,
    specialty: booking.engineer?.engineerProfile?.specialty || 'Professional'
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm"
          >
            <HiOutlineChevronLeft className="w-6 h-6 text-zinc-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-neutral-700 text-lg font-bold font-inter leading-tight">Booking details</h1>
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">JOB ID: #RH-{booking.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {booking.isEmergency && (
            <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter animate-pulse shadow-lg shadow-red-600/20">
              Emergency
            </div>
          )}
          <div className={cn(
            "px-4 py-1.5 rounded-full flex items-center gap-2 w-fit",
            booking.status === 'completed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
            booking.status === 'cancelled' ? "bg-red-50 text-red-600 border border-red-100" :
            "bg-blue-50 text-blue-700 border border-blue-100"
          )}>
            <div className={cn("w-2 h-2 rounded-full", 
              booking.status === 'completed' ? "bg-emerald-500" : 
              booking.status === 'cancelled' ? "bg-red-500" : "bg-blue-600 animate-pulse"
            )} />
            <span className="text-xs font-bold capitalize">{booking.status?.replace('_', ' ') || 'Pending'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specifications & Costs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white flex flex-col gap-8 shadow-sm">
            {/* Service Specification */}
            <div className="flex flex-col gap-4 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <HiWrenchScrewdriver className="w-4 h-4 text-blue-700" />
                <h2 className="text-neutral-700 text-sm font-bold font-inter uppercase tracking-wide">Service Specification</h2>
              </div>
              <div className="flex flex-col gap-4">
                <DetailRow label="Service Category" value={booking.serviceCategory || 'N/A'} />
                <DetailRow label="Specific Service" value={booking.serviceName || 'N/A'} />
                <DetailRow 
                  label="Date" 
                  value={booking.scheduledDate ? format(new Date(booking.scheduledDate), 'PPP') : 'N/A'} 
                  icon={HiOutlineCalendar}
                />
                <DetailRow 
                  label="Scheduled Time" 
                  value={booking.scheduledTime || 'N/A'} 
                  icon={HiOutlineClock}
                />
              </div>
            </div>

            {/* Costs Breakdown */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-neutral-700 text-sm font-bold font-inter uppercase tracking-wide">Job Costs</h2>
                {activeQuotation && (
                  <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500">Based on Quotation</span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <DetailRow 
                  label="Labor cost" 
                  value={`₦${(activeQuotation?.laborCost || 0).toLocaleString()}`} 
                />
                
                {activeQuotation?.materials?.length > 0 ? (
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-50">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Materials</span>
                    {activeQuotation.materials.map((item: any, idx: number) => (
                      <DetailRow key={idx} label={item.name} value={`₦${(item.cost || 0).toLocaleString()}`} isSmall />
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 italic">No materials listed</p>
                )}

                <div className="px-4 py-3 bg-blue-50/50 rounded-xl flex justify-between items-center mt-2 border border-blue-100/50">
                  <span className="text-blue-900 text-xs font-bold font-inter uppercase tracking-widest">TOTAL AMOUNT</span>
                  <span className="text-blue-700 text-base font-black font-inter">
                    ₦{(activeQuotation?.totalAmount || booking.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Notes */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-stone-50/50 flex flex-col gap-3 shadow-sm">
             <div className="flex items-center gap-2">
               <HiOutlineStar className="w-4 h-4 text-amber-500" />
               <h3 className="text-neutral-700 text-sm font-bold">Job Description & Notes</h3>
             </div>
             <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
               {booking.notes}
             </p>
          </div>
        </div>

        {/* Right Column: People, Timeline & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Progress Timeline */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[600px] px-4">
              {statusSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-3 relative">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                      step.status === 'completed' ? "bg-blue-700 text-white" : 
                      step.status === 'current' ? "bg-blue-700 text-white ring-4 ring-blue-50" : 
                      "bg-zinc-100 text-zinc-300"
                    )}>
                      {step.status === 'completed' ? (
                        <HiOutlineCheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-semibold whitespace-nowrap",
                      step.status !== 'pending' ? "text-neutral-700" : "text-zinc-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-[2px] -mt-7 transition-colors duration-500",
                      statusSteps[idx + 1].status !== 'pending' ? "bg-blue-700" : "bg-zinc-100"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Homeowner Card */}
            <PersonCard 
              title="Homeowner Details"
              name={homeowner.name}
              address={homeowner.address}
              avatar={formatImageUrl(homeowner.avatar)}
              role="Client"
              phone={homeowner.phone}
            />

            {/* Professional Card */}
            <PersonCard 
              title="Allocated Professional"
              name={engineer.name}
              address={engineer.address}
              avatar={formatImageUrl(engineer.avatar)}
              role={engineer.specialty}
              phone={engineer.phone}
              isPro
              hasReassign={engineer.name !== 'Unassigned'}
              onAssign={() => toast.info("Reassignment workflow coming soon")}
            />
          </div>

          {/* Quick Actions Container */}
          <div className="p-8 rounded-2xl border border-zinc-200 bg-white flex flex-col gap-6 shadow-sm mt-auto">
            <div className="flex items-center gap-2 border-b border-zinc-50 pb-4">
              <div className="w-2 h-8 bg-blue-700 rounded-full" />
              <h2 className="text-neutral-700 text-base font-bold font-inter leading-5">Platform Controls</h2>
            </div>
            <div className="flex flex-wrap gap-4">
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
            <p className="text-[10px] text-zinc-400 text-center italic">
              These actions directly affect the financial escrow and job lifecycle. Perform with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const DetailRow = ({ label, value, icon: Icon, isSmall }: { label: string, value: string, icon?: any, isSmall?: boolean }) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors" />}
      <span className={cn("text-neutral-700 font-medium font-inter leading-5", isSmall ? "text-xs" : "text-sm")}>{label}</span>
    </div>
    <span className={cn("text-zinc-600 font-semibold font-inter leading-5 text-right", isSmall ? "text-xs" : "text-sm")}>{value}</span>
  </div>
)

const PersonCard = ({ title, name, address, avatar, role, phone, isPro, hasReassign, onAssign }: { 
  title: string, 
  name: string, 
  address: string, 
  avatar: string,
  role: string,
  phone?: string,
  isPro?: boolean,
  hasReassign?: boolean,
  onAssign?: () => void
}) => (
  <div className="p-6 bg-white rounded-2xl border border-zinc-200 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center">
      <h3 className="text-neutral-700 text-[10px] font-black uppercase tracking-widest opacity-60">{title}</h3>
      {isPro && (
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded uppercase">Verified Pro</span>
      )}
    </div>
    <div className="flex items-start gap-4">
      <div className="relative shrink-0">
        <img 
          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" 
          src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
          alt={name} 
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-neutral-800 text-base font-bold font-inter leading-tight truncate">{name}</span>
        <span className="text-zinc-500 text-xs font-medium mb-2">{role}</span>
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <HiOutlineLocationMarker className="shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <IconButton icon={HiOutlinePhone} onClick={() => phone && (window.location.href = `tel:${phone}`)} disabled={!phone} />
        <IconButton icon={HiOutlineChatAlt2} />
        {isPro && (
          <button 
            onClick={onAssign}
            className={cn(
              "flex-1 h-11 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-bold font-inter transition-all",
              "hover:bg-blue-700 hover:text-white hover:border-blue-700 shadow-sm active:scale-95"
            )}
          >
            {hasReassign ? 'Reassign Job' : 'Assign Engineer'}
          </button>
        )}
      </div>
    </div>
  </div>
)

const IconButton = ({ icon: Icon, onClick, disabled }: { icon: any, onClick?: () => void, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-11 h-11 flex items-center justify-center bg-stone-50 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-blue-700 transition-all shadow-inner disabled:opacity-30 disabled:grayscale"
  >
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
    blue: variant === 'primary' ? "bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20 border-transparent" : "border-blue-700 text-blue-700 hover:bg-blue-50",
    orange: variant === 'primary' ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 border-transparent" : "border-orange-400 text-orange-400 hover:bg-orange-50",
    red: variant === 'primary' ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 border-transparent" : "border-red-600 text-red-600 hover:bg-red-50"
  }

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 min-w-[200px] h-12 px-6 rounded-xl flex justify-center items-center gap-3 transition-all font-bold text-sm border-2",
        colorClasses[color],
        disabled && "opacity-50 cursor-not-allowed scale-100",
        !disabled && "hover:-translate-y-0.5 active:scale-95"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )
}
