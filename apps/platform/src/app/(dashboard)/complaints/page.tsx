'use client'

import React, { useState } from 'react'
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlinePlus,
  HiOutlineChatAlt,
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineExclamationCircle
} from 'react-icons/hi'
import { cn, Button, Skeleton } from "@resolve/ui"
import { useComplaints } from '@/hooks/api-hooks'
import { format } from 'date-fns'
import Link from 'next/link'

export default function ComplaintsPage() {
  const [filter, setFilter] = useState('all')
  const { data: complaints, isLoading } = useComplaints()

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 flex flex-col gap-8 max-w-[1200px] mx-auto animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const filteredComplaints = complaints?.filter((c: any) => 
    filter === 'all' || c.status?.toLowerCase() === filter.toLowerCase()
  ) || []

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-neutral-800 font-plus-jakarta">Support Tickets</h1>
          <p className="text-zinc-500 text-sm font-medium font-inter">
            Manage your reports and track resolution progress
          </p>
        </div>
        <Link href="/complaints/new">
          <Button className="h-12 px-6 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-700/20 flex items-center gap-2">
            <HiOutlinePlus className="w-5 h-5" />
            File a Complaint
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-1">
        {['all', 'pending', 'resolved', 'in-progress'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-4 py-3 text-sm font-bold capitalize transition-all border-b-2",
              filter === tab 
                ? "border-blue-700 text-blue-700" 
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredComplaints.length > 0 ? filteredComplaints.map((complaint: any) => (
          <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-blue-700/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                  complaint.status === 'resolved' ? "bg-emerald-50 text-emerald-600" :
                  complaint.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                )}>
                  <HiOutlineChatAlt className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neutral-800 font-plus-jakarta line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {complaint.title}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      complaint.status === 'resolved' ? "bg-emerald-50 text-emerald-600" :
                      complaint.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed max-w-2xl">
                    {complaint.description}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM dd, yyyy') : 'Recently'}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-300">#{complaint.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center self-end md:self-center">
                <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-all">
                  <HiOutlineChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="bg-stone-50 border border-dashed border-zinc-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <HiOutlineExclamationCircle className="w-8 h-8 text-zinc-300" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-neutral-800 font-plus-jakarta">No complaints found</h3>
              <p className="text-zinc-500 text-sm max-w-xs">
                You haven't reported any issues yet. If you face any problems, feel free to let us know.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
