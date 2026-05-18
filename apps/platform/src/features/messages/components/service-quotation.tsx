'use client'

import React, { useState } from 'react'
import { 
  HiOutlineCheckCircle, 
  HiOutlineX, 
  HiOutlineChevronDown, 
  HiOutlineChevronUp,
  HiOutlineEye
} from 'react-icons/hi'
import { useApproveQuotation, useRejectQuotation } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { Button } from "@resolve/ui"
import { format } from 'date-fns'
import { cn } from '@resolve/ui'

interface ServiceQuotationProps {
  quotation: {
    id: string
    laborFee: number
    materials: { name: string, price: number, quantity: number }[]
    totalAmount: number
    description?: string
    timestamp?: string
    status?: 'pending' | 'approved' | 'rejected'
  }
  isMe: boolean
  bookingStatus?: string
}

export const ServiceQuotation = ({ quotation, isMe, bookingStatus }: ServiceQuotationProps) => {
  const [showMaterials, setShowMaterials] = useState(false)
  const { mutate: approve, isPending: isApproving } = useApproveQuotation()
  const { mutate: reject, isPending: isRejecting } = useRejectQuotation()

  const handleAccept = () => {
    approve(quotation.id, {
      onSuccess: () => {
        toast.success("Quotation approved and funded successfully!")
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.error || err?.message || "Failed to approve quotation"
        toast.error(errMsg)
      }
    })
  }

  const handleDecline = () => {
    reject({ quotationId: quotation.id, reason: 'Quotation declined' }, {
      onSuccess: () => {
        toast.success("Quotation declined.")
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.error || err?.message || "Failed to decline quotation"
        toast.error(errMsg)
      }
    })
  }

  const materialsCost = quotation.materials?.reduce((sum, m) => sum + (m.price * m.quantity), 0) || (quotation.totalAmount - quotation.laborFee)

  return (
    <div className="w-96 p-5 bg-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl flex flex-col justify-start items-start gap-5 overflow-hidden shadow-sm border border-zinc-200 font-['Inter']">
      {/* Header Info */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex justify-start items-center gap-2">
            <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex justify-center items-center overflow-hidden shrink-0">
               <span className="text-blue-700 text-xs font-bold font-mono">Q</span>
            </div>
            <div className="inline-flex flex-col justify-center items-start">
              <span className="text-neutral-800 text-sm font-semibold leading-none">Service Quotation</span>
              <span className="text-zinc-400 text-[10px] font-medium mt-1">
                {quotation.timestamp ? format(new Date(quotation.timestamp), 'hh:mm a') : format(new Date(), 'hh:mm a')}
              </span>
            </div>
          </div>

          {/* Inline Small Status Tag */}
          {quotation.status && (
            <span className={cn(
              "text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide leading-none",
              quotation.status === 'approved' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
              quotation.status === 'rejected' ? "bg-red-50 text-red-700 border border-red-100" :
              "bg-amber-50 text-amber-700 border border-amber-100"
            )}>
              {quotation.status}
            </span>
          )}
        </div>
        {quotation.description && (
          <div className="self-stretch text-zinc-500 text-xs font-normal leading-relaxed">
            {quotation.description}
          </div>
        )}
      </div>

      {/* Pricing Summary */}
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch pb-3 border-b border-zinc-100 flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch inline-flex justify-between items-center">
            <span className="text-zinc-500 text-xs font-medium">Labor fee</span>
            <span className="text-neutral-700 text-xs font-semibold">
              ₦{quotation.laborFee?.toLocaleString()}
            </span>
          </div>
          <div className="self-stretch inline-flex justify-between items-center">
            <span className="text-zinc-500 text-xs font-medium">Materials estimate</span>
            <span className="text-neutral-700 text-xs font-semibold">
              ₦{materialsCost?.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-between items-center pt-0.5">
          <span className="text-neutral-800 text-sm font-bold">Total Amount</span>
          <span className="text-blue-700 text-sm font-bold">
            ₦{quotation.totalAmount?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Accordion Materials Inspector */}
      {quotation.materials && quotation.materials.length > 0 && (
        <div className="self-stretch border-t border-zinc-50 pt-2.5">
          <button
            onClick={() => setShowMaterials(!showMaterials)}
            className="flex items-center justify-between w-full text-zinc-500 hover:text-blue-700 transition-colors text-xs font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <HiOutlineEye className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
              {showMaterials ? "Hide materials details" : "View materials details"}
            </span>
            {showMaterials ? <HiOutlineChevronUp className="w-4 h-4" /> : <HiOutlineChevronDown className="w-4 h-4" />}
          </button>
          
          {showMaterials && (
            <div className="mt-3 bg-zinc-50/50 border border-zinc-100 rounded-xl p-3 flex flex-col gap-2 max-h-40 overflow-y-auto">
              <table className="w-full text-left text-[11px] text-zinc-600">
                <thead>
                  <tr className="border-b border-zinc-200/60 pb-1 font-bold text-zinc-400 uppercase tracking-wider text-[9px]">
                    <th className="pb-1.5">Item</th>
                    <th className="pb-1.5 text-center">Qty</th>
                    <th className="pb-1.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {quotation.materials.map((m, i) => (
                    <tr key={i} className="hover:bg-zinc-100/50">
                      <td className="py-1.5 font-medium pr-2 truncate max-w-[120px]">{m.name}</td>
                      <td className="py-1.5 text-center font-mono">{m.quantity}</td>
                      <td className="py-1.5 text-right font-semibold font-mono">₦{m.price?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Action States & Buttons */}
      <div className="self-stretch mt-1">
        {quotation.status === 'approved' ? (
          <div className="self-stretch bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center justify-center gap-2 text-emerald-800 text-xs font-semibold">
            <HiOutlineCheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Approved &amp; Funded</span>
          </div>
        ) : quotation.status === 'rejected' ? (
          <div className="self-stretch bg-red-50/60 border border-red-100 rounded-xl p-3 flex items-center justify-center gap-2 text-red-800 text-xs font-semibold">
            <HiOutlineX className="w-4.5 h-4.5 text-red-600 shrink-0" />
            <span>Quotation Declined</span>
          </div>
        ) : bookingStatus === 'completed' ? (
          <div className="self-stretch bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-500 text-xs font-semibold">
            <span>Booking Completed</span>
          </div>
        ) : bookingStatus === 'cancelled' ? (
          <div className="self-stretch bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-500 text-xs font-semibold">
            <span>Booking Cancelled</span>
          </div>
        ) : (bookingStatus && ['payment_pending', 'confirmed', 'on_the_way', 'arrived', 'in_progress', 'in-progress'].includes(bookingStatus)) ? (
          <div className="self-stretch bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-400 text-xs font-semibold">
            <span>Quotation Inactive</span>
          </div>
        ) : isMe ? (
          /* Sent by me (pro) - pending approval status */
          <div className="self-stretch bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-center justify-center gap-2 text-amber-800 text-xs font-semibold">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shrink-0" />
            <span>Awaiting customer's confirmation</span>
          </div>
        ) : (
          /* Received by me (customer) - Accept & Decline Buttons */
          <div className="self-stretch flex items-center gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-9 text-xs border-zinc-200 text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl font-semibold transition-all shadow-none shrink-0"
              onClick={handleDecline}
              disabled={isRejecting || isApproving}
            >
              {isRejecting ? 'Declining...' : 'Decline'}
            </Button>
            <Button 
              className="flex-1 h-9 text-xs bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-none shrink-0"
              onClick={handleAccept}
              disabled={isApproving || isRejecting}
            >
              {isApproving ? 'Approving...' : 'Accept & Fund'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
