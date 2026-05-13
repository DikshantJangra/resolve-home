'use client'

import React, { useState } from 'react'
import { Button, Input, cn } from "@resolve/ui"
import { toast } from 'sonner'
import { HiOutlineX, HiOutlineLibrary, HiChevronDown } from 'react-icons/hi'
import { useAddBank, useNigerianBanks } from '@/hooks/api-hooks'

interface AddBankModalProps {
  onClose: () => void
  initialData?: any
}

export const AddBankModal = ({ onClose, initialData }: AddBankModalProps) => {
  const { mutate: addBank, isPending: loading } = useAddBank()
  const { data: banks = [], isLoading: loadingBanks } = useNigerianBanks()
  
  const [formData, setFormData] = useState({
    bankName: initialData?.bankName || initialData?.bank_name || '',
    bankCode: initialData?.bankCode || initialData?.bank_code || '',
    accountNumber: initialData?.accountNumber || initialData?.account_number || '',
    accountName: initialData?.accountName || initialData?.account_name || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.bankName || !formData.bankCode || !formData.accountNumber || !formData.accountName) {
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
             <h3 className="text-xl font-bold text-neutral-700">{initialData ? 'Edit' : 'Add'} Bank Account</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <HiOutlineX className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-neutral-700 text-sm font-semibold">Select Bank</label>
              <div className="relative">
                <select
                  value={formData.bankName}
                  onChange={(e) => {
                    const bank = banks.find((b: any) => b.name === e.target.value)
                    setFormData({ ...formData, bankName: e.target.value, bankCode: bank?.code || '' })
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-stone-800"
                  required
                >
                  <option value="">{loadingBanks ? 'Loading banks...' : 'Choose your bank'}</option>
                  {banks.map((bank: any) => (
                    <option key={`${bank.code}-${bank.name}`} value={bank.name}>{bank.name}</option>
                  ))}
                </select>
                <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
              </div>
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
              {loading ? 'Verifying...' : initialData ? 'Update Bank Details' : 'Save Bank Details'}
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
