'use client'

import React from 'react'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { useApproveQuotation, useRejectQuotation } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { Button } from "@resolve/ui"
import { format } from 'date-fns'

interface ServiceQuotationProps {
  quotation: {
    id: string
    laborFee: number
    materials: { name: string, price: number, quantity: number }[]
    totalAmount: number
    description?: string
    timestamp?: string
  }
  isMe: boolean
}

export const ServiceQuotation = ({ quotation, isMe }: ServiceQuotationProps) => {
  const { mutate: approve, isPending: isApproving } = useApproveQuotation()
  const { mutate: reject, isPending: isRejecting } = useRejectQuotation()

  const handleAccept = () => {
    approve(quotation.id, {
      onSuccess: () => toast.success("Quotation accepted and funded!"),
      onError: (err: any) => toast.error(err.message || "Failed to accept quotation")
    })
  }

  return (
    <div className="w-96 p-5 bg-white rounded-tr-xl rounded-bl-xl rounded-br-xl flex flex-col justify-start items-start gap-6 overflow-hidden shadow-sm border border-zinc-100">
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="flex justify-start items-center gap-1.5">
            <div className="w-9 h-9 bg-stone-50 rounded-lg flex justify-center items-center overflow-hidden">
               <div className="w-4 h-4 text-zinc-600 border-[1.50px] border-zinc-600 rounded-sm flex items-center justify-center text-[10px] font-bold">Q</div>
            </div>
            <div className="inline-flex flex-col justify-center items-start">
              <div className="justify-start text-neutral-700 text-sm font-semibold font-['Inter'] leading-5">Service Quotation</div>
              <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-4">
                {quotation.timestamp ? format(new Date(quotation.timestamp), 'HH:mm') : '12:12pm'}
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
          {quotation.description || 'Replace faulty kitchen circuits and investigate pooling near sink area.'}
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch pb-3 border-b border-zinc-300 flex flex-col justify-start items-start gap-2">
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5 line-clamp-1">Labor fee</div>
            <div className="justify-start text-neutral-700 text-sm font-semibold font-['Inter'] leading-5 line-clamp-1">
              ₦{quotation.laborFee?.toLocaleString()}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5 line-clamp-1">Material Est</div>
            <div className="justify-start text-neutral-700 text-sm font-semibold font-['Inter'] leading-5 line-clamp-1">
              ₦{(quotation.totalAmount - quotation.laborFee)?.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-neutral-700 text-sm font-semibold font-['Inter'] leading-5 line-clamp-1">Total</div>
            <div className="justify-start text-blue-700 text-sm font-semibold font-['Inter'] leading-5 line-clamp-1">
              ₦{quotation.totalAmount?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {!isMe && (
        <div className="self-stretch inline-flex justify-start items-start gap-3">
          <Button 
            variant="outline"
            className="flex-1 px-4 py-2 text-xs border-blue-700 text-blue-700 hover:bg-blue-50 rounded-xl"
          >
            View Material List
          </Button>
          <Button 
            className="flex-1 px-4 py-2 text-xs bg-blue-700 hover:bg-blue-800 text-white rounded-xl"
            onClick={handleAccept}
            disabled={isApproving}
          >
            {isApproving ? 'Approving...' : 'Accept and Fund'}
          </Button>
        </div>
      )}
    </div>
  )
}
