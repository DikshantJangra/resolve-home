'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  HiOutlineArrowLeft,
  HiOutlineSupport,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi'
import { Button, Input, Label, cn } from "@resolve/ui"
import { useCreateComplaint } from '@/hooks/api-hooks'
import { toast } from 'sonner'

function NewComplaintForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    bookingId: bookingId || ''
  })

  const createMutation = useCreateComplaint()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createMutation.mutateAsync(formData)
      toast.success('Complaint submitted successfully')
      router.push('/complaints')
    } catch (err) {
    }
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-[800px] mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-blue-700 transition-colors w-fit"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-800 font-plus-jakarta">File a Complaint</h1>
        <p className="text-zinc-500 text-sm font-medium">
          Tell us what went wrong and we'll help you resolve it as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-bold text-neutral-700">Complaint Title</Label>
            <Input 
              placeholder="Briefly describe the issue (e.g., Engineer didn't show up)"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="h-12 border-zinc-200 rounded-xl focus:ring-blue-700/10 focus:border-blue-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-neutral-700">Category</Label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="h-12 w-full bg-white border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              >
                <option value="general">General Issue</option>
                <option value="service_quality">Service Quality</option>
                <option value="billing">Billing & Payments</option>
                <option value="behavioral">Staff/Engineer Behavior</option>
                <option value="technical">App Technical Issue</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-neutral-700">Booking ID (Optional)</Label>
              <Input 
                placeholder="e.g. BK-12345"
                value={formData.bookingId}
                onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
                className="h-12 border-zinc-200 rounded-xl focus:ring-blue-700/10 focus:border-blue-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-bold text-neutral-700">Detailed Description</Label>
            <textarea 
              placeholder="Please provide as much detail as possible to help us investigate the issue..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full min-h-[160px] p-4 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-zinc-100">
          <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <HiOutlineInformationCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <p className="text-blue-900 text-xs leading-relaxed font-medium">
              Our support team typically responds to complaints within 24-48 hours. You will receive a notification once an admin has addressed your report.
            </p>
          </div>

          <Button 
            type="submit"
            isLoading={createMutation.isPending}
            className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xl shadow-blue-700/20 transition-all active:scale-[0.98]"
          >
            Submit Support Request
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewComplaintPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><HiOutlineSupport className="animate-spin text-blue-700 size-8" /></div>}>
      <NewComplaintForm />
    </Suspense>
  )
}

