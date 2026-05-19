'use client'

import React from 'react'
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi'
import { Button } from "@resolve/ui"
import { useApproveQuotation, useRejectQuotation, usePayBooking, useReleaseEscrow } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { cn } from "@resolve/ui"

interface QuotationViewProps {
  quotation: {
    id: string
    laborFee: number
    callOutFee?: number
    materials: Array<{ name: string; price: number; quantity: number }>
    totalAmount: number
    status: 'pending' | 'approved' | 'rejected' | 'revised'
    engineerId: string
  }
  booking?: any
}

export const QuotationView = ({ quotation, booking }: QuotationViewProps) => {
  const { mutate: approve, isPending: isApproving } = useApproveQuotation()
  const { mutate: reject, isPending: isRejecting } = useRejectQuotation()
  const { mutate: pay, isPending: isPaying } = usePayBooking()
  const { mutate: release, isPending: isReleasing } = useReleaseEscrow()

  const [showRejectModal, setShowRejectModal] = React.useState(false)
  const [showApproveModal, setShowApproveModal] = React.useState(false)
  const [showPayModal, setShowPayModal] = React.useState(false)
  const [showReleaseModal, setShowReleaseModal] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState('')

  const handleApprove = () => {
    setShowApproveModal(true)
  }

  const handleReject = () => {
    setShowRejectModal(true)
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
            <span className="text-zinc-500 font-medium">Call Out Fee</span>
            <span className="text-neutral-700 font-semibold">₦{(quotation.callOutFee || 10000).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-medium">Labor Fee</span>
            <span className="text-neutral-700 font-semibold">₦{(quotation.laborFee || 0).toLocaleString()}</span>
          </div>
          
          {quotation.materials && quotation.materials.length > 0 && (
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Materials</span>
              {quotation.materials.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-zinc-600">{item.name} (x{item.quantity})</span>
                  <span className="text-neutral-700 font-medium">₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
 
        <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
          <div>
            <p className="text-zinc-500 text-xs">Total Estimated Amount</p>
            <p className="text-neutral-700 text-2xl font-bold">₦{(quotation.totalAmount || (quotation as any).totalCost || (quotation as any).totalPrice || 0).toLocaleString()}</p>
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

          {booking?.status === 'payment_pending' && (
            <Button
              className="h-10 bg-emerald-600 hover:bg-emerald-700 animate-pulse font-semibold"
              onClick={() => setShowPayModal(true)}
              disabled={isPaying}
            >
              <HiOutlineCheck className="w-4 h-4 mr-1.5" />
              Process Payment
            </Button>
          )}

          {booking?.status === 'completed' && booking?.paymentStatus !== 'released' && (
            <Button
              className="h-10 bg-blue-700 hover:bg-blue-800 font-semibold"
              onClick={() => setShowReleaseModal(true)}
              disabled={isReleasing}
            >
              <HiOutlineCheck className="w-4 h-4 mr-1.5" />
              Release Payment
            </Button>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-150 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Reject Quotation</h3>
                <p className="text-xs text-zinc-500 mt-1">Please provide a reason for rejecting this quotation.</p>
              </div>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="E.g. Material costs are too high, labor fee is incorrect..."
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-400 text-neutral-800 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRejectModal(false)}
                className="h-11 border-zinc-200 text-zinc-700 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  reject({ quotationId: quotation.id, reason: rejectReason }, {
                    onSuccess: () => {
                      toast.success('Quotation rejected')
                      setShowRejectModal(false)
                      setRejectReason('')
                    }
                  })
                }}
                disabled={isRejecting}
                className="h-11 bg-rose-600 hover:bg-rose-700 font-semibold"
              >
                {isRejecting ? 'Rejecting...' : 'Reject Quotation'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-150 flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-center items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
              <HiOutlineCheck className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-neutral-800">Approve Quotation?</h3>
              <p className="text-sm text-zinc-500 px-4">
                Are you sure you want to approve this quotation? The total amount of <strong className="text-neutral-800">₦{(quotation.totalAmount || (quotation as any).totalCost || (quotation as any).totalPrice || 0).toLocaleString()}</strong> will be deducted from your wallet to secure the job.
              </p>
            </div>

            <div className="flex gap-3 w-full mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowApproveModal(false)}
                className="flex-1 h-11 border-zinc-200 text-zinc-700 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  approve(quotation.id, {
                    onSuccess: () => {
                      toast.success('Quotation approved successfully')
                      setShowApproveModal(false)
                      setTimeout(() => {
                        window.location.reload()
                      }, 800)
                    }
                  })
                }}
                disabled={isApproving}
                className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 font-semibold"
              >
                {isApproving ? 'Approving...' : 'Approve & Pay'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Process Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-150 flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-center items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <HiOutlineCheck className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-neutral-800">Process Payment</h3>
              <p className="text-sm text-zinc-500 px-4">
                Secure this job by processing the payment of <strong className="text-neutral-800">₦{(quotation.totalAmount || (quotation as any).totalCost || (quotation as any).totalPrice || 0).toLocaleString()}</strong> from your wallet balance. The funds will be held securely in escrow until the job is completed.
              </p>
            </div>

            <div className="flex gap-3 w-full mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPayModal(false)}
                className="flex-1 h-11 border-zinc-200 text-zinc-700 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  pay(booking.id, {
                    onSuccess: () => {
                      toast.success('Payment processed successfully! Job is now In Progress.')
                      setShowPayModal(false)
                      setTimeout(() => {
                        window.location.reload()
                      }, 800)
                    },
                    onError: (err: any) => {
                      toast.error(err.response?.data?.message || 'Insufficient wallet balance. Please top up your wallet.')
                    }
                  })
                }}
                disabled={isPaying}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold"
              >
                {isPaying ? 'Processing...' : 'Confirm Payment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Release Payment Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-150 flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-center items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
              <HiOutlineCheck className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-neutral-800">Release Payment</h3>
              <p className="text-sm text-zinc-500 px-4">
                Are you sure you want to release the escrow funds of <strong className="text-neutral-800">₦{(quotation.totalAmount || (quotation as any).totalCost || (quotation as any).totalPrice || 0).toLocaleString()}</strong> to the Pro Partner? This action is irreversible.
              </p>
            </div>

            <div className="flex gap-3 w-full mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowReleaseModal(false)}
                className="flex-1 h-11 border-zinc-200 text-zinc-700 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  release(booking.id, {
                    onSuccess: () => {
                      toast.success('Funds released successfully! Pro Partner has been credited.')
                      setShowReleaseModal(false)
                      setTimeout(() => {
                        window.location.reload()
                      }, 800)
                    },
                    onError: (err: any) => {
                      toast.error(err.response?.data?.message || 'Failed to release funds.')
                    }
                  })
                }}
                disabled={isReleasing}
                className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 font-semibold"
              >
                {isReleasing ? 'Releasing...' : 'Release Funds'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
