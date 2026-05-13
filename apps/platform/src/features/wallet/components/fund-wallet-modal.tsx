'use client'

import React, { useState } from 'react'
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { useInitializeDeposit, useBanks } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { HiOutlineX, HiOutlineExclamationCircle } from 'react-icons/hi'

interface FundWalletModalProps {
  onClose: () => void
  onAddBank: () => void
}

export const FundWalletModal = ({ onClose, onAddBank }: FundWalletModalProps) => {
  const [amount, setAmount] = useState('')
  const { mutate: initializeDeposit, isPending } = useInitializeDeposit()
  const { data: bank, isLoading: checkingBank } = useBanks()

  const handleFund = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bank) {
      toast.error('Bank account required', {
        description: 'Please add your bank account details before funding your wallet.'
      })
      return
    }

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
        console.error('[FundWalletModal] Failed to initialize deposit:', err)
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
          {!bank && !checkingBank && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <HiOutlineExclamationCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-amber-900 text-sm font-semibold">Bank account required</p>
                <p className="text-amber-800 text-xs leading-relaxed">
                  You need to link a bank account before you can fund your wallet.
                </p>
                <button 
                  type="button"
                  onClick={onAddBank}
                  className="text-amber-900 text-xs font-bold underline hover:text-amber-950 mt-1"
                >
                  Link bank account now
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Amount to add (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">₦</span>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  disabled={!bank}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-14 text-lg font-semibold rounded-xl border-zinc-200 focus:ring-blue-500/20 disabled:bg-zinc-50"
                />
              </div>
              <p className="text-zinc-500 text-xs">Minimum ₦100 per transaction</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  disabled={!bank}
                  onClick={() => setAmount(val.toString())}
                  className="h-11 rounded-lg border border-zinc-200 text-sm font-medium hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all disabled:opacity-50"
                >
                  +₦{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isPending || !bank}
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
