'use client'

import React, { useState } from 'react'
import { Button, Input, cn } from "@resolve/ui"
import { toast } from 'sonner'
import { HiOutlineX, HiOutlineLibrary, HiChevronDown } from 'react-icons/hi'
import { useAddBank } from '@/hooks/api-hooks'

const NIGERIAN_BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'United Bank for Africa', code: '033' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Sterling Bank', code: '050' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'Wema Bank', code: '035' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'EcoBank Nigeria', code: '050' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Opay', code: '999992' },
  { name: 'Palmpay', code: '999991' },
]

interface AddBankModalProps {
  onClose: () => void
  initialData?: any
}

export const AddBankModal = ({ onClose, initialData }: AddBankModalProps) => {
  const { mutate: addBank, isPending: loading } = useAddBank()
  const [formData, setFormData] = useState({
    bankName: initialData?.bankName || initialData?.bank_name || '',
    bankCode: initialData?.bankCode || initialData?.bank_code || '',
    accountNumber: initialData?.accountNumber || initialData?.account_number || '',
    accountName: initialData?.accountName || initialData?.account_name || ''
  })

  const handleBankChange = (bankName: string) => {
    const bank = NIGERIAN_BANKS.find(b => b.name === bankName)
    setFormData({
      ...formData,
      bankName: bankName,
      bankCode: bank?.code || ''
    })
  }

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
                  onChange={(e) => handleBankChange(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white text-sm text-neutral-700 focus:border-blue-700 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Choose your bank</option>
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.name} value={bank.name}>{bank.name}</option>
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
