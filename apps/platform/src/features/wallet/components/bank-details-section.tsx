'use client'

import { HiOutlinePlus, HiOutlineTrash, HiOutlineLibrary } from 'react-icons/hi'
import { useBanks, useDeleteBank } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { Skeleton } from "@resolve/ui"

interface BankDetailsSectionProps {
  onAdd: () => void
}

export const BankDetailsSection = ({ onAdd }: BankDetailsSectionProps) => {
  const { data: banks, isLoading } = useBanks()
  const { mutate: deleteBank, isPending: isDeleting } = useDeleteBank()

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this bank account?')) {
      deleteBank(undefined, {
        onSuccess: () => toast.success('Bank account removed'),
        onError: (err: any) => toast.error(err.message || 'Failed to remove bank')
      })
    }
  }

  return (
    <div className="w-full bg-white rounded-[20px] flex flex-col gap-6 p-5 border border-zinc-100 shadow-sm">
      <h3 className="text-slate-900 text-base font-semibold leading-6">
        Saved Bank Accounts
      </h3>
      
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <Skeleton className="h-20 w-full rounded-xl" />
        ) : banks?.length > 0 ? (
          banks.map((bank: any) => (
            <div key={bank.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-zinc-100 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-zinc-100 shadow-sm">
                  <HiOutlineLibrary className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800">{bank.bankName}</p>
                  <p className="text-xs text-zinc-500 font-mono tracking-tight">**** {bank.accountNumber.slice(-4)}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete()}
                className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : null}

        <button 
          onClick={onAdd}
          className="w-full h-24 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-blue-500 hover:bg-blue-50/30 transition-all"
        >
          <div className="w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <HiOutlinePlus className="w-5 h-5 text-zinc-400 group-hover:text-blue-600" />
          </div>
          <span className="text-zinc-500 text-sm font-medium group-hover:text-blue-700 transition-colors">
            Add bank details
          </span>
        </button>
      </div>
    </div>
  )
}
