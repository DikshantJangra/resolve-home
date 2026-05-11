'use client'

import React, { useState } from 'react'
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { useInitializeDeposit } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlineX } from 'react-icons/hi'

interface FundWalletModalProps {
  onClose: () => void
}

export const FundWalletModal = ({ onClose }: FundWalletModalProps) => {
  const [amount, setAmount] = useState('')
  const { mutate: initializeDeposit, isPending } = useInitializeDeposit()

  const handleFund = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount < 100) {
      toast.error('Minimum deposit amount is ₦100')
      return
    }

    initializeDeposit(numAmount, {
      onSuccess: (data) => {
        toast.success('Redirecting to payment gateway...')
        if (data.authorizationUrl) {
          window.location.href = data.authorizationUrl
        }
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to initialize deposit')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-stone-50">
          <h3 className="text-xl font-bold text-neutral-700">Fund Wallet</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <HiOutlineX className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleFund} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Amount to add (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">₦</span>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-14 text-lg font-semibold rounded-xl border-zinc-200 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-zinc-500 text-xs">Minimum ₦100 per transaction</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="h-11 rounded-lg border border-zinc-200 text-sm font-medium hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all"
                >
                  +₦{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-base font-semibold shadow-lg shadow-blue-700/10"
            >
              {isPending ? 'Processing...' : 'Continue to Payment'}
            </Button>
            <p className="text-center text-[10px] text-zinc-400">
              Payments are securely processed by Paystack. Your funds are held in escrow.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
