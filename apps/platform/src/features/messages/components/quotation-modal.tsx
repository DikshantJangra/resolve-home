'use client'

import React, { useState } from 'react'
import { HiOutlineX, HiOutlineTrash } from 'react-icons/hi'
import { useCreateQuotation } from '@/hooks/api-hooks'
import { toast } from 'sonner'
import { cn } from "@resolve/ui"

interface MaterialItem {
  id: string
  name: string
  price: string
  quantity: string
}

interface QuotationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
}

export const QuotationModal = ({ isOpen, onClose, bookingId }: QuotationModalProps) => {
  const [laborFee, setLaborFee] = useState('0')
  const [items, setItems] = useState<MaterialItem[]>([
    { id: '1', name: '', price: '0', quantity: '1' }
  ])

  const { mutate: createQuotation, isPending } = useCreateQuotation()

  if (!isOpen) return null

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', price: '0', quantity: '1' }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (index: number, field: keyof MaterialItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const totalAmount = (Number(laborFee) || 0) + items.reduce((acc, item) => {
    return acc + (Number(item.price) || 0) * (Number(item.quantity) || 0)
  }, 0)

  const handleSubmit = () => {
    if (!bookingId) {
      toast.error('No booking selected')
      return
    }

    const formattedMaterials = items
      .filter(i => i.name.trim() !== '')
      .map(i => ({
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1
      }))

    createQuotation({
      bookingId,
      laborFee: Number(laborFee) || 0,
      materials: formattedMaterials,
      totalAmount
    }, {
      onSuccess: () => {
        toast.success('Quotation submitted successfully')
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-[639px] bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          {/* Header */}
          <div className="self-stretch px-5 pt-5 pb-3 border-b border-zinc-300 inline-flex justify-start items-start">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
              <div className="self-stretch justify-start text-neutral-700 text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                Create Job Quotation
              </div>
              <div className="self-stretch justify-start text-zinc-600 text-base font-normal font-['Inter'] leading-6">
                Break down costs for labor and materials.
              </div>
            </div>
            <button 
              onClick={onClose}
              className="flex justify-start items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <HiOutlineX className="w-6 h-6" />
              </div>
              <div className="justify-start text-blue-700 text-base font-normal font-['Inter'] leading-6">Close</div>
            </button>
          </div>

          {/* Content */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5 overflow-y-auto">
            <div className="self-stretch px-5 flex flex-col justify-start items-start gap-4 pb-4">
              {/* Labor Fee */}
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <div className="self-stretch inline-flex justify-start items-start gap-0.5">
                  <div className="justify-start text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Labor fee (₦)</div>
                  <div className="justify-start text-red-600 text-sm font-medium font-['Inter'] leading-5">*</div>
                </div>
                <input 
                  type="number"
                  placeholder="Enter the amount you will charge for the job"
                  className="self-stretch h-12 px-4 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 focus:outline-blue-700 text-zinc-800 text-sm font-normal font-['Inter'] leading-5 placeholder:text-zinc-300"
                  value={laborFee}
                  onChange={(e) => setLaborFee(e.target.value)}
                />
              </div>

              {/* Materials */}
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-between items-start">
                  <div className="flex justify-start items-center gap-0.5">
                    <div className="justify-start text-zinc-600 text-sm font-medium font-['Inter'] leading-5">Materials</div>
                    <div className="justify-start text-red-600 text-sm font-medium font-['Inter'] leading-5">*</div>
                  </div>
                  <button 
                    onClick={addItem}
                    className="justify-start text-blue-700 text-sm font-medium font-['Inter'] leading-5 hover:underline"
                  >
                    Add Item
                  </button>
                </div>

                <div className="self-stretch flex flex-col gap-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="self-stretch inline-flex justify-start items-center gap-1.5">
                      <input 
                        type="text"
                        placeholder="item name (e.g Copper Pipe)"
                        className="w-80 h-12 px-4 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 focus:outline-blue-700 text-zinc-800 text-sm font-normal font-['Inter'] leading-5 placeholder:text-zinc-300"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                      />
                      <div className="relative w-24">
                        <input 
                          type="number"
                          placeholder="₦0.00"
                          className="w-full h-12 px-4 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 focus:outline-blue-700 text-zinc-800 text-sm font-normal font-['Inter'] leading-5 placeholder:text-zinc-300"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', e.target.value)}
                        />
                      </div>
                      <input 
                        type="number"
                        placeholder="1"
                        className="w-24 h-12 px-4 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 focus:outline-blue-700 text-zinc-800 text-sm font-normal font-['Inter'] leading-5 placeholder:text-zinc-300"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      />
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-5 h-5 flex items-center justify-center text-rose-400 hover:text-rose-500 transition-colors"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="self-stretch px-8 py-5 border-t border-zinc-100 inline-flex justify-between items-center bg-white">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="justify-start text-neutral-700 text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
              ₦{totalAmount.toLocaleString()}
            </div>
            <div className="justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
              Total Estimated Amount
            </div>
          </div>
          <button 
            className={cn(
              "w-48 h-11 px-6 py-3 bg-blue-700 hover:bg-blue-800 transition-colors rounded-xl flex justify-center items-center gap-2.5 text-neutral-50 text-sm font-medium leading-5 shadow-sm",
              isPending && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Sending...' : 'Send Quotation'}
          </button>
        </div>
      </div>
    </div>
  )
}
