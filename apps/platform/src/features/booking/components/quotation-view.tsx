'use client'

import React from 'react'
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi'
import { Button } from "@resolve/ui"
import { useApproveQuotation, useRejectQuotation } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { cn } from "@resolve/ui"

interface QuotationViewProps {
  quotation: {
    id: string
    laborFee: number
    materials: Array<{ name: string; price: number; quantity: number }>
    totalAmount: number
    status: 'pending' | 'approved' | 'rejected' | 'revised'
    engineerId: string
  }
}

export const QuotationView = ({ quotation }: QuotationViewProps) => {
  const { mutate: approve, isPending: isApproving } = useApproveQuotation()
  const { mutate: reject, isPending: isRejecting } = useRejectQuotation()

  const handleApprove = () => {
    if (confirm('Are you sure you want to approve this quotation? The amount will be deducted from your wallet.')) {
      approve(quotation.id, {
        onSuccess: () => toast.success('Quotation approved successfully'),
        onError: (err: any) => toast.error(err.message || 'Failed to approve quotation')
      })
    }
  }

  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection (optional):')
    if (reason !== null) {
      reject({ quotationId: quotation.id, reason }, {
        onSuccess: () => toast.success('Quotation rejected'),
        onError: (err: any) => toast.error(err.message || 'Failed to reject quotation')
      })
    }
  }

  const isPending = quotation.status === 'pending'

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-stone-50/50">
        <h3 className="text-neutral-700 text-base font-semibold">Job Quotation</h3>
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
          quotation.status === 'pending' ? "bg-amber-50 text-amber-600" :
          quotation.status === 'approved' ? "bg-green-50 text-green-600" :
          "bg-rose-50 text-rose-600"
        )}>
          {quotation.status}
        </span>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-medium">Labor Fee</span>
            <span className="text-neutral-700 font-semibold">₦{quotation.laborFee.toLocaleString()}</span>
          </div>
          
          <div className="space-y-2">
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Materials</span>
            {quotation.materials.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-zinc-600">{item.name} (x{item.quantity})</span>
                <span className="text-neutral-700 font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
          <div>
            <p className="text-zinc-500 text-xs">Total Estimated Amount</p>
            <p className="text-neutral-700 text-2xl font-bold">₦{quotation.totalAmount.toLocaleString()}</p>
          </div>
          
          {isPending && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="h-10 border-zinc-200 text-rose-600 hover:bg-rose-50 hover:border-rose-100"
                onClick={handleReject}
                disabled={isRejecting || isApproving}
              >
                <HiOutlineX className="w-4 h-4 mr-1.5" />
                Reject
              </Button>
              <Button 
                className="h-10 bg-blue-700 hover:bg-blue-800"
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
              >
                <HiOutlineCheck className="w-4 h-4 mr-1.5" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
