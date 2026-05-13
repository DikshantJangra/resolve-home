'use client'

import React, { useState } from 'react'
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { useWithdraw, useBanks } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlineX, HiOutlineLibrary, HiOutlineCheck } from 'react-icons/hi'
import { cn } from "@resolve/ui"

interface WithdrawModalProps {
  onClose: () => void
  availableBalance: number
}

export const WithdrawModal = ({ onClose, availableBalance }: WithdrawModalProps) => {
  const [amount, setAmount] = useState('')
  const { data: bank, isLoading: isLoadingBank } = useBanks()
  const { mutate: withdraw, isPending } = useWithdraw()

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    
    if (!bank) {
      toast.error('Please add a bank account first')
      return
    }
    if (isNaN(numAmount) || numAmount < 1000) {
      toast.error('Minimum withdrawal amount is ₦1,000')
      return
    }
    if (numAmount > availableBalance) {
      toast.error('Insufficient balance')
      return
    }

    withdraw({ amount: numAmount }, {
      onSuccess: () => {
        toast.success('Withdrawal request submitted successfully!')
        onClose()
      },
      onError: (err: any) => {
        console.error('[WithdrawModal] Failed to process withdrawal:', err)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-stone-50">
          <h3 className="text-xl font-bold text-neutral-700">Withdraw Funds</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <HiOutlineX className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Amount to withdraw (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">₦</span>
                <Input
                  type="number"
                  placeholder="e.g. 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-14 text-lg font-semibold rounded-xl border-zinc-200 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-zinc-500 text-xs flex justify-between">
                <span>Min ₦1,000</span>
                <span>Max ₦{availableBalance.toLocaleString()}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-neutral-700 text-sm font-semibold">Payout Account</label>
              <div className="grid grid-cols-1 gap-2">
                {isLoadingBank ? (
                  <div className="h-20 bg-zinc-50 rounded-xl animate-pulse" />
                ) : bank ? (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-blue-600 bg-blue-50/50 transition-all text-left">
                    <div className="flex items-center gap-3">
                      <HiOutlineLibrary className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-bold text-neutral-800">{bank.bankName}</p>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tight">**** {bank.accountNumber?.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <HiOutlineCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                    <p className="text-amber-700 text-xs font-medium">No bank account linked.</p>
                    <p className="text-amber-600 text-[10px] mt-0.5">Please add your bank account in the wallet settings.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isPending || !bank}
              className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-base font-semibold shadow-lg shadow-blue-700/10"
            >
              {isPending ? 'Processing...' : 'Withdraw Now'}
            </Button>
            <p className="text-center text-[10px] text-zinc-400">
              Processing may take 1-3 business days depending on your bank.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
