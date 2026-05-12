'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  HiOutlineArrowLeft,
  HiOutlineBadgeCheck,
  HiOutlineDotsHorizontal,
  HiOutlinePlus,
  HiOutlinePaperAirplane,
  HiOutlineBriefcase
} from 'react-icons/hi'
import { cn, Skeleton } from "@resolve/ui"
import { useAdminComplaints, useRespondToComplaint } from '@/hooks/api-hooks'
import { format } from 'date-fns'

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [message, setMessage] = useState('')
  
  const { data: complaints, isLoading } = useAdminComplaints()
  const respondMutation = useRespondToComplaint()

  const complaint = complaints?.find((c: any) => c.id === id)

  const handleSend = async () => {
    if (!message.trim()) return
    try {
      await respondMutation.mutateAsync({
        complaintId: id as string,
        response: message
      })
      setMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 flex flex-col gap-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    )
  }

  if (!complaint) return null

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-2">
      {/* Header / Breadcrumb */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => router.back()} className="p-1 hover:bg-zinc-100 rounded-md transition-colors">
          <HiOutlineArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <h1 className="text-neutral-700 text-sm font-medium font-inter leading-5">Home owner details</h1>
      </div>

      {/* Chat Container */}
      <div className="w-[829px] h-[680px] bg-stone-50 rounded-[20px] border border-zinc-300 flex flex-col overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="h-20 p-5 bg-stone-50 border-b border-zinc-300 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-600/10 rounded-full flex items-center justify-center text-neutral-700 font-medium text-sm overflow-hidden">
              {complaint.userAvatar ? (
                <img src={complaint.userAvatar} alt={complaint.userName} className="w-full h-full object-cover" />
              ) : (
                complaint.userName?.charAt(0) || 'A'
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-neutral-800 text-sm font-medium font-inter">{complaint.userName || 'Jamison Stoltenberg'}</span>
                <HiOutlineBadgeCheck className="w-3.5 h-3.5 text-blue-700" />
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                  <span className="text-zinc-600 text-xs font-normal font-inter">5 minutes ago</span>
                </div>
              </div>
              <span className="text-zinc-500 text-xs font-normal font-inter">{complaint.userEmail || 'jamison@email.com'}</span>
            </div>
          </div>
          <button className="p-1 hover:bg-zinc-200 rounded-md transition-colors">
            <HiOutlineDotsHorizontal className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-5 flex flex-col gap-8 overflow-y-auto">
          {/* Info Banner */}
          <div className="flex items-center gap-4 justify-center py-2">
            <div className="flex-1 h-0.5 bg-zinc-300" />
            <p className="w-[450px] text-center text-zinc-600 text-[10px] font-normal font-inter leading-4">
              Chat and fund payments directly here. your money is held in escrow until you approve job
            </p>
            <div className="flex-1 h-0.5 bg-zinc-300" />
          </div>

          {/* Incoming Message (User) */}
          <div className="max-w-[400px] p-5 bg-white rounded-tr-xl rounded-bl-xl rounded-br-xl flex flex-col gap-2 shadow-sm border border-zinc-100">
            <span className="text-zinc-600 text-xs font-normal font-inter">12:12pm</span>
            <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
              {complaint.description || "Hello! I've seen your request for a Electrician. I'll accept this and head over shortly."}
            </p>
          </div>

          {/* Outgoing Message (Admin) */}
          <div className="max-w-[400px] self-end p-5 bg-white rounded-tl-xl rounded-tr-xl rounded-bl-xl flex flex-col gap-2 shadow-sm border border-zinc-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 opacity-0">
                <div className="w-7 h-6 bg-stone-50 rounded-lg flex items-center justify-center">
                  <HiOutlineBriefcase className="w-4 h-4 text-zinc-600" />
                </div>
                <span className="text-zinc-600 text-base font-semibold font-inter leading-6">Job offer details</span>
              </div>
              <span className="text-zinc-600 text-xs font-normal font-inter">12:12pm</span>
            </div>
            <p className="text-zinc-600 text-sm font-normal font-inter leading-5">
              {complaint.adminResponse || "Hello! I've seen your request for a Electrician. I'll accept this and head over shortly."}
            </p>
          </div>

          {/* Special Job Info Message (Example) */}
          {complaint.bookingId && (
            <div className="max-w-[400px] self-end p-5 bg-white rounded-tl-xl rounded-tr-xl rounded-bl-xl flex flex-col gap-3 shadow-sm border border-zinc-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-6 bg-stone-50 rounded-lg flex items-center justify-center">
                    <HiOutlineBriefcase className="w-4 h-4 text-zinc-600" />
                  </div>
                  <span className="text-neutral-700 text-sm font-semibold font-inter">Job details</span>
                </div>
                <span className="text-zinc-600 text-xs font-normal font-inter">12:15pm</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-zinc-200">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 text-xs font-medium uppercase">TICKET ID: #{complaint.id.slice(-6).toUpperCase()}</span>
                  <span className="text-neutral-800 text-sm font-medium">Linked to Booking #{complaint.bookingId.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="h-20 p-5 bg-white border-t border-zinc-100 flex items-center gap-2">
          <button className="p-2 bg-stone-50 rounded-lg hover:bg-zinc-200 transition-colors">
            <HiOutlinePlus className="w-5 h-5 text-zinc-600" />
          </button>
          <div className="flex-1 h-10 px-5 bg-stone-50 rounded-xl flex items-center">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message here"
              className="w-full bg-transparent border-none outline-none text-zinc-600 text-sm font-normal font-inter"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={respondMutation.isPending}
            className="p-2 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors text-blue-700 disabled:opacity-50"
          >
            <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
          </button>
        </div>

      </div>
    </div>
  )
}
