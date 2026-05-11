'use client'

import React, { useState } from 'react'
import { Button } from "@resolve/ui"
import { Input } from "@resolve/ui"
import { toast } from 'sonner'
import { HiOutlineX, HiOutlineLibrary } from 'react-icons/hi'

import { useAddBank } from '@/hooks/api-hooks'

interface AddBankModalProps {
  onClose: () => void
}

export const AddBankModal = ({ onClose }: AddBankModalProps) => {
  const { mutate: addBank, isPending: loading } = useAddBank()
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
      toast.error('Please fill all fields')
      return
    }

    addBank(formData, {
      onSuccess: () => {
        toast.success('Bank account details added successfully!')
        onClose()
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to add bank account')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-2">
             <HiOutlineLibrary className="w-5 h-5 text-blue-700" />
             <h3 className="text-xl font-bold text-neutral-700">Add Bank Account</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <HiOutlineX className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Bank Name</label>
              <Input
                placeholder="e.g. Zenith Bank"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="h-12 rounded-xl border-zinc-200"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Account Number</label>
              <Input
                placeholder="10-digit number"
                maxLength={10}
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                className="h-12 rounded-xl border-zinc-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Account Holder Name</label>
              <Input
                placeholder="As it appears on your bank profile"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="h-12 rounded-xl border-zinc-200"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-base font-semibold"
            >
              {loading ? 'Verifying...' : 'Save Bank Details'}
            </Button>
            <p className="text-center text-[10px] text-zinc-400 mt-4 px-6">
              This account will be used for withdrawals and refunds. Ensure the name matches your profile.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
